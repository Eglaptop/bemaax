import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { Plus, Edit2, Trash2, Globe, FileText, CheckCircle, Clock } from 'lucide-react';

export default function CMS() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newPost, setNewPost] = useState({ 
    title: '', 
    content: '', 
    site: 'voiceover', 
    status: 'draft',
    metaTitle: '',
    metaDescription: '',
    keywords: '',
    slug: ''
  });

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  };

  useEffect(() => {
    const q = query(collection(db, 'posts'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'posts'), {
        ...newPost,
        slug: newPost.slug || generateSlug(newPost.title),
        createdAt: serverTimestamp(),
        authorId: 'system-admin'
      });
      setIsAdding(false);
      setNewPost({ 
        title: '', 
        content: '', 
        site: 'voiceover', 
        status: 'draft',
        metaTitle: '',
        metaDescription: '',
        keywords: '',
        slug: ''
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      await deleteDoc(doc(db, 'posts', id));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-eglaptop-blue">Content Management</h1>
          <p className="text-gray-400 font-mono text-xs">Manage articles and pages for all Eglaptop sites</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="px-6 py-3 bg-eglaptop-orange text-white text-xs font-bold uppercase tracking-widest hover:bg-opacity-90 flex items-center rounded-xl shadow-lg shadow-eglaptop-orange/20 transition-all"
        >
          <Plus size={18} className="mr-2" />
          New Content
        </button>
      </div>

      {isAdding && (
        <div className="bg-white border border-gray-100 p-10 rounded-3xl shadow-2xl">
          <h3 className="text-[10px] font-bold uppercase tracking-widest mb-8 text-eglaptop-blue">Create New Post</h3>
          <form onSubmit={handleAdd} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-gray-400">Title</label>
                  <input 
                    type="text" 
                    value={newPost.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      setNewPost({...newPost, title, slug: generateSlug(title)});
                    }}
                    className="w-full p-4 border border-gray-100 rounded-xl focus:outline-none focus:border-eglaptop-blue bg-gray-50/50 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-gray-400">Slug</label>
                  <input 
                    type="text" 
                    value={newPost.slug}
                    onChange={(e) => setNewPost({...newPost, slug: e.target.value})}
                    className="w-full p-4 border border-gray-100 rounded-xl focus:outline-none focus:border-eglaptop-blue bg-gray-50/50 font-mono text-xs transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-gray-400">Site</label>
                  <select 
                    value={newPost.site}
                    onChange={(e) => setNewPost({...newPost, site: e.target.value})}
                    className="w-full p-4 border border-gray-100 rounded-xl focus:outline-none focus:border-eglaptop-blue bg-gray-50/50 transition-all"
                  >
                    <option value="voiceover">The Arabic Voiceover</option>
                    <option value="eglaptop">Eglaptop Technology</option>
                  </select>
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-[10px] font-bold uppercase tracking-widest border-b border-gray-100 pb-2 text-eglaptop-blue">SEO Settings</h4>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-gray-400">Meta Title</label>
                  <input 
                    type="text" 
                    value={newPost.metaTitle}
                    onChange={(e) => setNewPost({...newPost, metaTitle: e.target.value})}
                    className="w-full p-4 border border-gray-100 rounded-xl focus:outline-none focus:border-eglaptop-blue bg-gray-50/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-gray-400">Meta Description</label>
                  <textarea 
                    rows={2}
                    value={newPost.metaDescription}
                    onChange={(e) => setNewPost({...newPost, metaDescription: e.target.value})}
                    className="w-full p-4 border border-gray-100 rounded-xl focus:outline-none focus:border-eglaptop-blue bg-gray-50/50 text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-gray-400">Keywords (comma separated)</label>
                  <input 
                    type="text" 
                    value={newPost.keywords}
                    onChange={(e) => setNewPost({...newPost, keywords: e.target.value})}
                    className="w-full p-4 border border-gray-100 rounded-xl focus:outline-none focus:border-eglaptop-blue bg-gray-50/50 transition-all"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-gray-400">Content (Markdown)</label>
              <textarea 
                rows={10}
                value={newPost.content}
                onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                className="w-full p-4 border border-gray-100 rounded-xl focus:outline-none focus:border-eglaptop-blue bg-gray-50/50 font-mono text-sm transition-all"
                required
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button 
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-8 py-3 border border-gray-200 text-eglaptop-blue text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-8 py-3 bg-eglaptop-blue text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-opacity-90 shadow-lg shadow-eglaptop-blue/20 transition-all"
              >
                Publish Post
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {posts.map((post) => (
          <div key={post.id} className="bg-white border border-gray-100 p-8 rounded-3xl group hover:bg-eglaptop-blue transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-eglaptop-blue/20">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-50 text-eglaptop-blue rounded-lg group-hover:bg-white/10 group-hover:text-eglaptop-sky transition-colors">
                  <Globe size={16} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-white/60 transition-colors">{post.site}</span>
              </div>
              <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                <button className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"><Edit2 size={14} /></button>
                <button onClick={() => handleDelete(post.id)} className="p-2 bg-red-500/20 hover:bg-red-500 text-white rounded-lg transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>
            <h3 className="text-2xl font-bold tracking-tight mb-4 text-eglaptop-blue group-hover:text-white transition-colors">{post.title}</h3>
            <p className="text-sm text-gray-500 group-hover:text-white/70 line-clamp-3 mb-8 font-mono leading-relaxed transition-colors">
              {post.content}
            </p>
            <div className="flex justify-between items-center pt-6 border-t border-gray-100 group-hover:border-white/10 transition-colors">
              <div className="flex items-center text-[10px] font-bold uppercase tracking-widest text-eglaptop-blue group-hover:text-eglaptop-sky transition-colors">
                {post.status === 'published' ? <CheckCircle size={12} className="mr-1.5 text-green-500" /> : <Clock size={12} className="mr-1.5 text-eglaptop-orange" />}
                {post.status}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-white/40 transition-colors">Oct 24, 2023</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
