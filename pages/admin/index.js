import { useState } from 'react';

export default function Admin() {
  const [formData, setFormData] = useState({ title: '', thumbnailUrl: '', telegramChannelId: '', telegramMessageId: '', duration: '' });
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Uploading...');
    
    try {
      const res = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': password },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();

      if (res.ok) {
        setStatus('✅ Video added successfully!');
        alert('✅ Video added successfully!');
        // Clear the form for the next video
        setFormData({ title: '', thumbnailUrl: '', telegramChannelId: '', telegramMessageId: '', duration: '' });
      } else {
        setStatus(`❌ Failed: ${data.message || 'Unauthorized / Server Error'}`);
        alert(`❌ Failed: ${data.message || 'Unauthorized / Server Error'}`);
      }
    } catch (error) {
      setStatus('❌ Network error. Check Vercel logs.');
      alert('❌ Network error. Is the /api/videos route created?');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-red-500">Admin Dashboard</h1>
        
        {status && <div className="mb-4 p-3 bg-gray-800 border border-gray-600 rounded">{status}</div>}

        <form onSubmit={handleSubmit} className="space-y-4 text-black">
           <input required type="password" placeholder="Admin Password (from Vercel Env)" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-2 rounded" />
           <input required type="text" placeholder="Video Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-2 rounded" />
           <input required type="url" placeholder="Thumbnail URL (e.g., https://imgur.com/...)" value={formData.thumbnailUrl} onChange={e => setFormData({...formData, thumbnailUrl: e.target.value})} className="w-full p-2 rounded" />
           <input required type="text" placeholder="Channel ID (e.g. -1001234567)" value={formData.telegramChannelId} onChange={e => setFormData({...formData, telegramChannelId: e.target.value})} className="w-full p-2 rounded" />
           <input required type="text" placeholder="Message ID (e.g. 54)" value={formData.telegramMessageId} onChange={e => setFormData({...formData, telegramMessageId: e.target.value})} className="w-full p-2 rounded" />
           <input required type="text" placeholder="Duration (e.g. 10:24)" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} className="w-full p-2 rounded" />
           <button type="submit" className="w-full bg-red-600 text-white font-bold py-3 rounded">Add Video</button>
        </form>
      </div>
    </div>
  );
}