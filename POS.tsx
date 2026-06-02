import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { ShoppingCart, Package, Plus, Minus, Trash2, CreditCard, Receipt, Search } from 'lucide-react';
import { triggerNotification } from './NotificationCenter';

export default function POS() {
  const [products, setProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
      const fetchedProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(fetchedProducts);
      
      // Check for low stock
      fetchedProducts.forEach((p: any) => {
        if (p.stock <= 5) {
          triggerNotification({
            title: 'Low Stock Alert',
            message: `Product "${p.name}" is low on stock (${p.stock} remaining).`,
            type: 'warning',
            module: 'POS'
          });
        }
      });
    });
    return () => unsubscribe();
  }, []);

  const addToCart = (product: any) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const [customer, setCustomer] = useState({ name: '', email: '', phone: '' });

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    try {
      // Log Transaction
      await addDoc(collection(db, 'transactions'), {
        items: cart,
        total,
        timestamp: serverTimestamp(),
        cashierId: 'system-cashier',
        customerName: customer.name || 'Walk-in',
        customerEmail: customer.email || 'N/A'
      });

      // Process Automation: If customer email provided, log as lead if not exists
      if (customer.email) {
        await addDoc(collection(db, 'leads'), {
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          source: 'POS Checkout',
          status: 'new',
          createdAt: serverTimestamp()
        });
      }

      setCart([]);
      setCustomer({ name: '', email: '', phone: '' });
      
      triggerNotification({
        title: 'New Transaction',
        message: `A sale of $${total.toFixed(2)} was completed.`,
        type: 'success',
        module: 'POS'
      });

      alert('Transaction completed successfully!');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex h-full space-x-8">
      {/* Product Grid */}
      <div className="flex-1 space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-eglaptop-blue">Point of Sale</h1>
            <p className="text-gray-400 font-mono text-xs">Inventory and sales terminal</p>
          </div>
          <div className="flex items-center bg-white border border-gray-100 px-4 py-3 w-72 rounded-xl shadow-sm focus-within:border-eglaptop-blue transition-all">
            <Search size={18} className="text-gray-300" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none focus:outline-none ml-3 w-full text-sm text-eglaptop-dark placeholder:text-gray-300"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-3 gap-6">
          {products.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).map((product) => (
            <button 
              key={product.id}
              onClick={() => addToCart(product)}
              className="bg-white border border-gray-100 p-6 text-left rounded-3xl hover:bg-eglaptop-blue transition-all group shadow-sm hover:shadow-2xl hover:shadow-eglaptop-blue/20"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-gray-50 text-eglaptop-blue group-hover:bg-white/10 group-hover:text-eglaptop-sky rounded-xl transition-colors">
                  <Package size={24} />
                </div>
                <span className="text-xs font-bold font-mono text-eglaptop-orange group-hover:text-white transition-colors">${product.price.toFixed(2)}</span>
              </div>
              <h3 className="font-bold text-lg mb-1 text-eglaptop-dark group-hover:text-white transition-colors">{product.name}</h3>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 group-hover:text-white/50 transition-colors">{product.category}</p>
              <div className="mt-6 flex justify-between items-center pt-4 border-t border-gray-50 group-hover:border-white/10 transition-colors">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-white/40 transition-colors">Stock: {product.stock}</span>
                <Plus size={18} className="text-eglaptop-orange opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className="w-96 bg-white border border-gray-100 flex flex-col shadow-2xl rounded-3xl overflow-hidden">
        <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h3 className="text-[10px] font-bold uppercase tracking-widest flex items-center text-eglaptop-blue">
            <ShoppingCart size={16} className="mr-2" />
            Current Order
          </h3>
          <span className="text-[10px] font-mono bg-eglaptop-blue text-white px-2 py-1 rounded-full">{cart.length} items</span>
        </div>

        <div className="p-8 border-b border-gray-100 space-y-4">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Customer Info (Optional)</h4>
          <input 
            type="text" 
            placeholder="Name"
            value={customer.name}
            onChange={(e) => setCustomer({...customer, name: e.target.value})}
            className="w-full p-3 border border-gray-100 rounded-xl text-xs focus:outline-none focus:border-eglaptop-blue bg-gray-50/50 transition-all"
          />
          <input 
            type="email" 
            placeholder="Email"
            value={customer.email}
            onChange={(e) => setCustomer({...customer, email: e.target.value})}
            className="w-full p-3 border border-gray-100 rounded-xl text-xs focus:outline-none focus:border-eglaptop-blue bg-gray-50/50 transition-all"
          />
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-300">
              <Receipt size={64} className="mb-4 opacity-20" />
              <p className="text-[10px] font-bold uppercase tracking-widest">Cart is empty</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl group transition-all hover:bg-white hover:shadow-lg hover:shadow-gray-200/50">
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-eglaptop-dark">{item.name}</h4>
                  <p className="text-xs font-mono text-eglaptop-orange">${item.price.toFixed(2)} x {item.quantity}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center bg-white border border-gray-100 rounded-lg overflow-hidden">
                    <button onClick={() => updateQuantity(item.id, -1)} className="p-1.5 hover:bg-gray-50 text-eglaptop-blue"><Minus size={12} /></button>
                    <span className="px-2 text-xs font-bold text-eglaptop-dark">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="p-1.5 hover:bg-gray-50 text-eglaptop-blue"><Plus size={12} /></button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-8 border-t border-gray-100 bg-gray-50/50 space-y-4">
          <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-gray-400">
            <span>Subtotal</span>
            <span className="text-eglaptop-dark">${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-gray-400">
            <span>Tax (0%)</span>
            <span className="text-eglaptop-dark">$0.00</span>
          </div>
          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <span className="text-sm font-bold uppercase tracking-widest text-eglaptop-blue">Total</span>
            <span className="text-3xl font-bold tracking-tight text-eglaptop-dark">${total.toFixed(2)}</span>
          </div>
          <button 
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className="w-full bg-eglaptop-orange text-white py-5 rounded-2xl font-bold uppercase tracking-widest flex items-center justify-center hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-eglaptop-orange/20 transition-all"
          >
            <CreditCard size={20} className="mr-3" />
            Complete Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
