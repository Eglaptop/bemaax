import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from 'firebase/auth';
import { LogIn, UserPlus, ShieldCheck } from 'lucide-react';
import { db } from '../firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const syncUserProfile = async (user: any) => {
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      // Create new user profile with default role
      await setDoc(userDocRef, {
        uid: user.uid,
        name: user.displayName || email.split('@')[0],
        email: user.email,
        role: user.email === 'Arabdt.com@gmail.com' ? 'admin' : 'cashier',
        createdAt: serverTimestamp()
      });
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        const result = await signInWithEmailAndPassword(auth, email, password);
        await syncUserProfile(result.user);
      } else {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await syncUserProfile(result.user);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      await syncUserProfile(result.user);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white border border-gray-100 p-12 shadow-2xl rounded-3xl">
        <div className="flex justify-center mb-8">
          <img 
            src="https://api.dicebear.com/7.x/shapes/svg?seed=Eglaptop&backgroundColor=FF6321" 
            alt="Eglaptop Logo" 
            className="w-20 h-20 rounded-2xl shadow-2xl shadow-eglaptop-orange/20"
            referrerPolicy="no-referrer"
          />
        </div>
        
        <h1 className="text-4xl font-bold text-center mb-2 tracking-tight text-eglaptop-blue">Eglaptop</h1>
        <p className="text-center text-gray-400 mb-12 uppercase tracking-[0.3em] text-[10px] font-bold">Technology Ecosystem</p>

        <form onSubmit={handleAuth} className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-eglaptop-blue">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 border border-gray-100 rounded-xl focus:outline-none focus:border-eglaptop-orange bg-gray-50/50 transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-eglaptop-blue">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 border border-gray-100 rounded-xl focus:outline-none focus:border-eglaptop-orange bg-gray-50/50 transition-all"
              required
            />
          </div>

          {error && <p className="text-red-500 text-xs font-mono bg-red-50 p-3 rounded-lg">{error}</p>}

          <button 
            type="submit"
            className="w-full bg-eglaptop-blue text-white p-4 rounded-xl font-bold uppercase tracking-widest hover:bg-opacity-90 transition-all flex items-center justify-center shadow-lg shadow-eglaptop-blue/20"
          >
            {isLogin ? <LogIn size={18} className="mr-3" /> : <UserPlus size={18} className="mr-3" />}
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-8 flex items-center justify-between">
          <hr className="flex-1 border-gray-100" />
          <span className="px-4 text-[10px] text-gray-300 uppercase tracking-widest font-bold">Or</span>
          <hr className="flex-1 border-gray-100" />
        </div>

        <button 
          onClick={handleGoogle}
          className="w-full mt-8 border border-gray-100 p-4 rounded-xl font-bold uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center justify-center text-xs"
        >
          <img src="https://www.google.com/favicon.ico" className="w-4 h-4 mr-3" alt="Google" />
          Continue with Google
        </button>

        <p className="mt-10 text-center text-xs text-gray-500">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="ml-2 font-bold text-eglaptop-orange hover:underline"
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
}
