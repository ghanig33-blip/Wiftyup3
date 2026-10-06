
'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('reels')
  const supabase = createClient()
  const router = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black text-white font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-neutral-900 border-b md:border-b-0 md:border-r border-neutral-800 p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-orange-500 flex items-center justify-center font-bold text-lg">
              W
            </div>
            <h1 className="text-xl font-extrabold bg-gradient-to-r from-cyan-400 via-purple-400 to-orange-400 bg-clip-text text-transparent">
              WiftyUp
            </h1>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('reels')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition ${
                activeTab === 'reels' ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold' : 'hover:bg-neutral-800 text-neutral-400'
              }`}
            >
              <span>🎬</span>
              <span>Reels & TikTok</span>
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition ${
                activeTab === 'chat' ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold' : 'hover:bg-neutral-800 text-neutral-400'
              }`}
            >
              <span>💬</span>
              <span>WhatsApp Chat</span>
            </button>

            <button
              onClick={() => setActiveTab('calls')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition ${
                activeTab === 'calls' ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold' : 'hover:bg-neutral-800 text-neutral-400'
              }`}
            >
              <span>📞</span>
              <span>Video & Voice Calls</span>
            </button>

            <button
              onClick={() => setActiveTab('ai')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition ${
                activeTab === 'ai' ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold' : 'hover:bg-neutral-800 text-neutral-400'
              }`}
            >
              <span>🤖</span>
              <span>AI Assistant</span>
            </button>

            <button
              onClick={() => setActiveTab('earn')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition ${
                activeTab === 'earn' ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white font-bold' : 'hover:bg-neutral-800 text-neutral-400'
              }`}
            >
              <span>👑</span>
              <span>Creator Monetization</span>
            </button>
          </nav>
        </div>

        <div className="pt-4 border-t border-neutral-800 mt-6">
          <button
            onClick={handleSignOut}
            className="w-full bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white py-2.5 rounded-xl transition font-medium"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Feature Screen */}
      <main className="flex-1 p-6 bg-neutral-950 overflow-y-auto">
        {activeTab === 'reels' && (
          <div className="max-w-md mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Trending Reels</h2>
            <div className="aspect-[9/16] bg-neutral-900 rounded-3xl border border-neutral-800 flex items-center justify-center text-neutral-500 shadow-2xl">
              [ Short Video
