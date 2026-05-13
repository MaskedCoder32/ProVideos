import { Home, Calendar, MonitorPlay } from 'lucide-react';
import Link from 'next/link';

export default function Layout({ children }) {
  return (
    <div className="bg-background min-h-screen text-white pb-16 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-gray-800 p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-wider">
          <span className="text-white">PRIME</span><span className="text-primary">VIDEOS</span>
        </h1>
        <div className="flex items-center space-x-2 text-green-500 text-xs bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>4,616 online</span>
        </div>
      </header>

      <main className="p-4">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full bg-background border-t border-gray-800 flex justify-around items-center p-2 pb-safe">
        <Link href="/" className="flex flex-col items-center text-primary">
          <MonitorPlay size={24} />
          <span className="text-[10px] mt-1 font-bold">VIDEOS</span>
        </Link>
        <div className="flex flex-col items-center text-gray-500">
          <Home size={24} />
          <span className="text-[10px] mt-1">POSTS</span>
        </div>
        <div className="flex flex-col items-center text-gray-500">
          <Calendar size={24} />
          <span className="text-[10px] mt-1">CALENDAR</span>
        </div>
      </nav>
    </div>
  );
}