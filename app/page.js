'use client'

import { useState } from 'react'

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('home')
  const [messages, setMessages] = useState([
    { id: 1, sender: 'WiftyBot', text: 'Welcome to WiftyUp Chat!' }
  ])
  const [inputMsg, setInputMsg] = useState('')
  
  const [aiPrompts, setAiPrompts] = useState([
    { sender: 'AI', text: 'Hello! How can Wifty AI help you today?' }
  ])
  const [aiInput, setAiInput] = useState('')

  // Interactive Messaging System
  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!inputMsg.trim()) return
    setMessages(prev => [...prev, { id: Date.now(), sender: 'You', text: inputMsg }])
    setInputMsg('')
  }

  // Interactive AI Bot System
  const handleAiQuery = (e) => {
    e.preventDefault()
    if (!aiInput.trim()) return
    const userQ = aiInput
    setAiPrompts(prev => [...prev, { sender: 'You', text: userQ }])
    setAiInput('')
    
    setTimeout(() => {
      setAiPrompts(prev => [
        ...prev, 
        { sender: 'AI', text: `Wifty AI: I received your request for "${userQ}". Feature processing active!` }
      ])
    }, 600)
  }

  return (
    <div className="min-h-screen bg-[#080d1a] text-white flex flex-col justify-between font-sans pb-24">
      {/* Header */}
      <header className="p-6 pt-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">WiftyUp</h1>
          <p className="text-gray-400 text-sm mt-1">Connect • Create • Earn</p>
        </div>
        {activeTab !== 'home' && (
          <button 
            onClick={() => setActiveTab('home')}
            className="text-xs bg-[#11192e] border border-[#1d2945] px-3 py-1.5 rounded-xl text-blue-400 font-medium"
          >
            ← Back Home
          </button>
        )}
      </header>

      {/* Main Feature Screen View */}
      <main className="px-5 flex-1 space-y-6">
        
        {/* HOME GRID VIEW */}
        {activeTab === 'home' && (
          <>
            <div>
              <h2 className="text-4xl font-bold tracking-tight text-white leading-tight">
                Welcome to <br /> WiftyUp
              </h2>
              <p className="text-gray-400 text-sm mt-2">
                Connect, create, share and grow.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div onClick={() => setActiveTab('chat')} className="bg-[#11192e] hover:bg-[#18233d] p-5 rounded-2xl cursor-pointer transition border border-[#1d2945]/50 flex flex-col justify-between h-32">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">💬</span>
                  <h3 className="font-bold text-white text-base">Chat</h3>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed">Messages and conversations</p>
              </div>

              <div onClick={() => setActiveTab('calls')} className="bg-[#11192e] hover:bg-[#18233d] p-5 rounded-2xl cursor-pointer transition border border-[#1d2945]/50 flex flex-col justify-between h-32">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">📹</span>
                  <h3 className="font-bold text-white text-base">Calls</h3>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed">Voice & video</p>
              </div>

              <div onClick={() => setActiveTab('shorts')} className="bg-[#11192e] hover:bg-[#18233d] p-5 rounded-2xl cursor-pointer transition border border-[#1d2945]/50 flex flex-col justify-between h-32">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">▶</span>
                  <h3 className="font-bold text-white text-base">Shorts</h3>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed">Short videos</p>
              </div>

              <div onClick={() => setActiveTab('communities')} className="bg-[#11192e] hover:bg-[#18233d] p-5 rounded-2xl cursor-pointer transition border border-[#1d2945]/50 flex flex-col justify-between h-32">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">👥</span>
                  <h3 className="font-bold text-white text-base">Communities</h3>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed">Groups and people</p>
              </div>

              <div onClick={() => setActiveTab('ai')} className="bg-[#11192e] hover:bg-[#18233d] p-5 rounded-2xl cursor-pointer transition border border-[#1d2945]/50 flex flex-col justify-between h-32">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">🤖</span>
                  <h3 className="font-bold text-white text-base">AI</h3>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed">AI creative tools</p>
              </div>

              <div onClick={() => setActiveTab('creator')} className="bg-[#11192e] hover:bg-[#18233d] p-5 rounded-2xl cursor-pointer transition border border-[#1d2945]/50 flex flex-col justify-between h-32">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">💰</span>
                  <h3 className="font-bold text-white text-base leading-tight">Creator <br /> Center</h3>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed">Creator features</p>
              </div>
            </div>
          </>
        )}

        {/* 1. CHAT FUNCTIONALITY */}
        {activeTab === 'chat' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Live Messaging</h2>
            <div className="bg-[#11192e] p-4 rounded-2xl border border-[#1d2945] h-80 overflow-y-auto space-y-3">
              {messages.map((m) => (
                <div key={m.id} className={`p-3 rounded-xl max-w-[80%] text-sm ${m.sender === 'You' ? 'bg-blue-600 ml-auto' : 'bg-[#1e2a4a]'}`}>
                  <p className="text-xs text-gray-300 font-bold mb-1">{m.sender}</p>
                  <p>{m.text}</p>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input 
                type="text" 
                value={inputMsg} 
                onChange={(e) => setInputMsg(e.target.value)}
                placeholder="Type a message..." 
                className="flex-1 bg-[#11192e] border border-[#1d2945] px-4 py-3 rounded-xl text-sm focus:outline-none"
              />
              <button type="submit" className="bg-blue-600 px-5 rounded-xl font-bold text-sm">Send</button>
            </form>
          </div>
        )}

        {/* 2. CALLS SCREEN */}
        {activeTab === 'calls' && (
          <div className="text-center space-y-6 pt-6">
            <h2 className="text-2xl font-bold">Voice & Video Calling</h2>
            <div className="bg-[#11192e] p-8 rounded-3xl border border-[#1d2945] space-y-4">
              <div className="w-20 h-20 bg-blue-600/20 text-blue-400 text-3xl rounded-full flex items-center justify-center mx-auto border border-blue-500/30">
                📞
              </div>
              <p className="text-gray-300 text-sm">Ready to start encrypted WebRTC Call Room</p>
              <div className="flex gap-3 justify-center">
                <button className="bg-green-600 px-6 py-3 rounded-xl font-bold text-sm">Start Audio Call</button>
                <button className="bg-blue-600 px-6 py-3 rounded-xl font-bold text-sm">Start Video Call</button>
              </div>
            </div>
          </div>
        )}

        {/* 3. SHORTS VIDEO STREAM */}
        {activeTab === 'shorts' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Shorts Feed</h2>
            <div className="aspect-[9/16] max-w-xs mx-auto bg-[#11192e] rounded-3xl border border-[#1d2945] flex flex-col justify-between p-4 relative overflow-hidden">
              <div className="text-right">
                <span className="bg-black/50 px-2 py-1 rounded-full text-xs">Trending</span>
              </div>
              <div className="text-center space-y-2">
                <span className="text-4xl">🎬</span>
                <p className="text-xs text-gray-400">Short Video Player Active</p>
              </div>
              <div className="space-y-1">
                <p className="font-bold text-sm">@wifty_creator</p>
                <p className="text-xs text-gray-400">Building WiftyUp Social App! 🚀</p>
              </div>
            </div>
          </div>
        )}

        {/* 4. COMMUNITIES */}
        {activeTab === 'communities' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Communities</h2>
            <div className="space-y-3">
              {['Tech Innovators', 'Creator Hub', 'Web3 & AI'].map((group, idx) => (
                <div key={idx} className="bg-[#11192e] p-4 rounded-2xl border border-[#1d2945] flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-sm">{group}</h3>
                    <p className="text-xs text-gray-400">Active Members</p>
                  </div>
                  <button className="bg-blue-600/20 text-blue-400 border border-blue-500/30 text-xs px-3 py-1.5 rounded-xl font-bold">Join</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. AI ASSISTANT */}
        {activeTab === 'ai' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Wifty AI Bot</h2>
            <div className="bg-[#11192e] p-4 rounded-2xl border border-[#1d2945] h-80 overflow-y-auto space-y-3">
              {aiPrompts.map((p, i) => (
                <div key={i} className={`p-3 rounded-xl max-w-[85%] text-sm ${p.sender === 'You' ? 'bg-purple-600 ml-auto' : 'bg-[#1e2a4a]'}`}>
                  <p className="text-xs text-gray-300 font-bold mb-1">{p.sender}</p>
                  <p>{p.text}</p>
                </div>
              ))}
            </div>
            <form onSubmit={handleAiQuery} className="flex gap-2">
              <input 
                type="text" 
                value={aiInput} 
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="Ask Wifty AI..." 
                className="flex-1 bg-[#11192e] border border-[#1d2945] px-4 py-3 rounded-xl text-sm focus:outline-none"
              />
              <button type="submit" className="bg-purple-600 px-5 rounded-xl font-bold text-sm">Ask</button>
            </form>
          </div>
        )}

        {/* 6. CREATOR CENTER */}
        {activeTab === 'creator' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Creator Dashboard</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#11192e] p-4 rounded-2xl border border-[#1d2945]">
                <p className="text-xs text-gray-400">Total Earnings</p>
                <p className="text-2xl font-bold text-green-400 mt-1">$0.00</p>
              </div>
              <div className="bg-[#11192e] p-4 rounded-2xl border border-[#1d2945]">
                <p className="text-xs text-gray-400">Shorts Views</p>
                <p className="text-2xl font-bold text-blue-400 mt-1">1,240</p>
              </div>
            </div>
            <div className="bg-[#11192e] p-4 rounded-2xl border border-[#1d2945] space-y-2">
              <p className="font-bold text-sm">Monetization Status</p>
              <p className="text-xs text-gray-400">Complete account verification to enable direct payouts.</p>
            </div>
          </div>
        )}

      </main>

      {/* Floating Bottom Navigation Bar */}
      <div className="fixed bottom-4 left-4 right-4 bg-[#11192e]/90 backdrop-blur-md p-2 rounded-2xl border border-[#1d2945] flex justify-around items-center max-w-md mx-auto z-50">
        <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center py-1 px-4 rounded-xl transition ${activeTab === 'home' ? 'bg-[#1e2a4a] text-blue-400' : 'text-gray-400'}`}>
          <span className="text-lg">🏠</span>
          <span className="text-xs font-medium">Home</span>
        </button>
        <button onClick={() => setActiveTab('chat')} className={`flex flex-col items-center py-1 px-4 rounded-xl transition ${activeTab === 'chat' ? 'bg-[#1e2a4a] text-blue-400' : 'text-gray-400'}`}>
          <span className="text-lg">💬</span>
          <span className="text-xs font-medium">Chat</span>
        </button>
        <button onClick={() => setActiveTab('shorts')} className={`flex flex-col items-center py-1 px-4 rounded-xl transition ${activeTab === 'shorts' ? 'bg-[#1e2a4a] text-blue-400' : 'text-gray-400'}`}>
          <span className="text-lg">▶</span>
          <span className="text-xs font-medium">Shorts</span>
        </button>
        <button onClick={() => setActiveTab('creator')} className={`flex flex-col items-center py-1 px-4 rounded-xl transition ${activeTab === 'creator' ? 'bg-[#1e2a4a] text-blue-400' : 'text-gray-400'}`}>
          <span className="text-lg">👤</span>
          <span className="text-xs font-medium">Profile</span>
        </button>
      </div>
    </div>
  )
}

