import { Search, Flame } from 'lucide-react';
import Layout from '../components/Layout';
import Link from 'next/link';
import dbConnect from '../lib/mongodb';
import Video from '../models/Video';

export default function Home({ videos, dbError }) {
  return (
    <Layout>
      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        <input 
          type="text" 
          placeholder="Search videos..." 
          className="w-full bg-card border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary"
        />
      </div>

      {/* Premium Banner */}
      <div className="bg-card border border-gray-800 rounded-xl p-3 flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-br from-orange-400 to-red-500 p-2 rounded-lg">
            <Flame className="text-white" size={24} />
          </div>
          <div>
            <h3 className="font-bold text-sm">Premium Telegram Access</h3>
            <p className="text-textMuted text-xs">Unlock all content — No limits</p>
          </div>
        </div>
        <button className="bg-accent text-white text-xs font-bold px-4 py-2 rounded-lg">Join Now</button>
      </div>

      {/* Library Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-gray-400 font-bold text-sm tracking-widest">VIDEO LIBRARY</h2>
          <span className="bg-red-500/20 text-red-500 text-xs px-2 py-0.5 rounded">{videos?.length || 0}</span>
        </div>
        <button className="text-gray-400 text-xs flex items-center bg-card px-2 py-1 rounded border border-gray-700">
          REFRESH
        </button>
      </div>

      {/* Error Message if DB fails */}
      {dbError && (
        <div className="bg-red-500/20 border border-red-500 text-red-500 p-3 rounded-lg text-sm mb-4">
          Database Connection Error: Ensure MONGODB_URI is set in Vercel and Network Access allows 0.0.0.0/0
        </div>
      )}

      {/* Video Grid */}
      <div className="grid grid-cols-2 gap-3">
        {videos && videos.length > 0 ? (
          videos.map((vid) => (
            <Link href={`/video/${vid._id}`} key={vid._id} className="bg-card rounded-xl overflow-hidden block border border-gray-800">
              <div className="relative h-32">
                <img src={vid.thumbnailUrl} alt={vid.title} className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded">NEW</div>
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded">{vid.duration}</div>
              </div>
              <div className="p-2">
                <h3 className="text-sm font-semibold line-clamp-2 leading-tight mb-2">{vid.title}</h3>
                <p className="text-[10px] text-gray-500">Recently added</p>
              </div>
            </Link>
          ))
        ) : (
          !dbError && <p className="text-gray-500 text-sm col-span-2 text-center py-10">No videos found. Add some from the admin panel!</p>
        )}
      </div>
    </Layout>
  );
}

// Added Try/Catch block to prevent 500 error crashes
export async function getServerSideProps() {
  try {
    await dbConnect();
    const videos = await Video.find({}).sort({ createdAt: -1 }).lean();
    return { 
      props: { 
        videos: JSON.parse(JSON.stringify(videos)),
        dbError: false
      } 
    };
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    return { 
      props: { 
        videos: [],
        dbError: true 
      } 
    };
  }
}
