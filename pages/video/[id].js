import { ChevronLeft, ThumbsUp, ThumbsDown, Share2, Send } from 'lucide-react';
import { useRouter } from 'next/router';
import CustomPlayer from '../../components/CustomPlayer'; // <-- THIS WAS MISSING
import Layout from '../../components/Layout';
import dbConnect from '../../lib/mongodb';
import Video from '../../models/Video';

export default function VideoPage({ video }) {
  const router = useRouter();

  if (!video) return <div className="text-white p-4">Loading...</div>;

  return (
    <Layout>
      <button onClick={() => router.back()} className="flex items-center text-sm bg-card px-3 py-1.5 rounded-full w-max mb-4 border border-gray-700">
        <ChevronLeft size={16} className="mr-1" /> Back
      </button>

      {/* Pass the new MTProto parameters */}
      <CustomPlayer 
        channelId={video.telegramChannelId} 
        messageId={video.telegramMessageId} 
        thumbnailUrl={video.thumbnailUrl} 
      />

      <div className="mt-4">
        <h1 className="text-lg font-bold leading-snug">{video.title}</h1>
        
        <div className="flex items-center space-x-3 mt-3 text-xs text-gray-400">
          <span className="bg-primary/20 text-primary px-2 py-0.5 rounded font-bold">NEW</span>
          <span className="bg-gray-800 text-yellow-500 px-2 py-0.5 rounded font-bold border border-gray-700">HD</span>
          <span>⏱ {video.duration || '00:00'}</span>
        </div>

        <div className="flex items-center space-x-3 mt-4 border-b border-gray-800 pb-4">
          <button className="flex items-center bg-card border border-gray-700 px-4 py-2 rounded-full text-sm">
            <ThumbsUp size={16} className="mr-2 text-gray-300" /> 819
          </button>
          <button className="flex items-center bg-card border border-gray-700 px-4 py-2 rounded-full text-sm">
            <ThumbsDown size={16} className="mr-2 text-gray-300" /> 65
          </button>
        </div>

        <div className="flex space-x-3 mt-4">
          <button className="flex-1 flex items-center justify-center bg-card border border-gray-700 py-3 rounded-xl font-semibold">
            <Share2 size={18} className="mr-2" /> Share
          </button>
          <button className="flex-[2] flex items-center justify-center bg-accent py-3 rounded-xl font-semibold text-white">
            <Send size={18} className="mr-2" /> More on Telegram
          </button>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  await dbConnect();
  const video = await Video.findById(params.id).lean();
  return { props: { video: JSON.parse(JSON.stringify(video)) } };
}