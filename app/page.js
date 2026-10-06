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

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!inputMsg.trim()) return
    setMessages(prev => [...prev, { id: Date.now(), sender: 'You', text: inputMsg }])
    setInputMsg('')
  }

  const handleAiQuery = (e) => {
    e.preventDefault()
    if (!aiInput.trim()) return
    const userQ = aiInput
    setAiPrompts(prev => [...prev, { sender: 'You', text: userQ }])
    setAiInput('')
    
    setTimeout(() => {
      setAiPrompts(prev => [
        ...prev, 
        { sender: 'AI', text: `Wifty AI: Direct response for "${userQ}". Processing active!` }
      ])
    }, 500)
  }

  const containerStyle = {
    backgroundColor: '#080d1a',
    color: '#ffffff',
    minHeight: '100vh',
    fontFamily: 'sans-serif',
    padding: '20px',
    paddingBottom: '90px',
    boxSizing: 'border-box'
  }

  const cardStyle = {
    backgroundColor: '#11192e',
    border: '1px solid #1d2945',
    borderRadius: '16px',
    padding: '16px',
    cursor: 'pointer',
    minHeight: '110px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  }

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    marginTop: '20px'
  }

  const navStyle = {
    position: 'fixed',
    bottom: '15px',
    left: '15px',
    right: '15px',
    backgroundColor: 'rgba(17, 25, 46, 0.95)',
    border: '1px solid #1d2945',
    borderRadius: '20px',
    display: 'flex',
    justifyThoroughly: 'space-around',
    justifyContent: 'space-around',
    padding: '8px 4px',
    backdropFilter: 'blur(10px)',
    zIndex: 1000
  }

  const navBtnStyle = (tab) => ({
    background: activeTab === tab ? '#1e2a4a' : 'transparent',
    border: 'none',
    color: activeTab === tab ? '#60a5fa' : '#9ca3af',
    padding: '8px 12px',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
    fontSize: '12px'
  })

  return (
    <div style={containerStyle}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '28px', margin: 0, fontWeight: 'bold' }}>WiftyUp</h1>
          <p style={{ color: '#9ca3af', fontSize: '13px', margin: '4px 0 0 0' }}>Connect • Create • Earn</p>
        </div>
        {activeTab !== 'home' && (
          <button 
            onClick={() => setActiveTab('home')}
            style={{ backgroundColor: '#11192e', border: '1px solid #1d2945', color: '#60a5fa', padding: '6px 12px', borderRadius: '10px', cursor: 'pointer', fontSize: '12px' }}
          >
            ← Back Home
          </button>
        )}
      </header>

      <main>
        {activeTab === 'home' && (
          <>
            <div>
              <h2 style={{ fontSize: '32px', margin: 0, fontWeight: 'bold' }}>Welcome to <br /> WiftyUp</h2>
              <p style={{ color: '#9ca3af', fontSize: '14px', marginTop: '6px' }}>Connect, create, share and grow.</p>
            </div>

            <div style={gridStyle}>
              <div onClick={() => setActiveTab('chat')} style={cardStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '18px' }}>💬</span>
                  <h3 style={{ margin: 0, fontSize: '16px' }}>Chat</h3>
                </div>
                <p style={{ color: '#9ca3af', fontSize: '11px', margin: 0 }}>Messages and conversations</p>
              </div>

              <div onClick={() => setActiveTab('calls')} style={cardStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '18px' }}>📹</span>
                  <h3 style={{ margin: 0, fontSize: '16px' }}>Calls</h3>
                </div>
                <p style={{ color: '#9ca3af', fontSize: '11px', margin: 0 }}>Voice & video</p>
              </div>

              <div onClick={() => setActiveTab('shorts')} style={cardStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '18px' }}>▶</span>
                  <h3 style={{ margin: 0, fontSize: '16px' }}>Shorts</h3>
                </div>
                <p style={{ color: '#9ca3af', fontSize: '11px', margin: 0 }}>Short videos</p>
              </div>

              <div onClick={() => setActiveTab('communities')} style={cardStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '18px' }}>👥</span>
                  <h3 style={{ margin: 0, fontSize: '16px' }}>Communities</h3>
                </div>
                <p style={{ color: '#9ca3af', fontSize: '11px', margin: 0 }}>Groups and people</p>
              </div>

              <div onClick={() => setActiveTab('ai')} style={cardStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '18px' }}>🤖</span>
                  <h3 style={{ margin: 0, fontSize: '16px' }}>AI</h3>
                </div>
                <p style={{ color: '#9ca3af', fontSize: '11px', margin: 0 }}>AI creative tools</p>
              </div>

              <div onClick={() => setActiveTab('creator')} style={cardStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '18px' }}>💰</span>
                  <h3 style={{ margin: 0, fontSize: '15px', lineHeight: '1.2' }}>Creator <br /> Center</h3>
                </div>
                <p style={{ color: '#9ca3af', fontSize: '11px', margin: 0 }}>Creator features</p>
              </div>
            </div>

            <div style={{ ...cardStyle, marginTop: '20px', minHeight: 'auto', gap: '10px' }}>
              <h3 style={{ margin: 0, fontSize: '20px' }}>Join WiftyUp</h3>
              <p style={{ color: '#9ca3af', fontSize: '13px', margin: 0 }}>Create an account to continue.</p>
              <button style={{ width: '100%', backgroundColor: '#ffffff', color: '#000000', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', marginTop: '5px' }}>
                Create account / Login
              </button>
            </div>
          </>
        )}

        {/* CHAT TAB */}
        {activeTab === 'chat' && (
          <div>
            <h3>Live Messaging</h3>
            <div style={{ backgroundColor: '#11192e', border: '1px solid #1d2945', borderRadius: '16px', padding: '12px', height: '300px', overflowY: 'auto', marginBottom: '10px' }}>
              {messages.map(m => (
                <div key={m.id} style={{ backgroundColor: m.sender === 'You' ? '#2563eb' : '#1e2a4a', padding: '8px 12px', borderRadius: '10px', marginBottom: '8px', marginLeft: m.sender === 'You' ? 'auto' : '0', width: 'fit-content', maxWidth: '80%' }}>
                  <small style={{ color: '#cbd5e1', display: 'block', fontWeight: 'bold' }}>{m.sender}</small>
                  <span>{m.text}</span>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '8px' }}>
              <input type="text" value={inputMsg} onChange={e => setInputMsg(e.target.value)} placeholder="Type a message..." style={{ flex: 1, backgroundColor: '#11192e', border: '1px solid #1d2945', color: '#fff', padding: '10px', borderRadius: '10px', outline: 'none' }} />
              <button type="submit" style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '10px', cursor: 'pointer' }}>Send</button>
            </form>
          </div>
        )}

        {/* CALLS TAB */}
        {activeTab === 'calls' && (
          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <h3>Voice & Video Calling</h3>
            <div style={{ ...cardStyle, textAlign: 'center', gap: '15px' }}>
              <div style={{ fontSize: '40px' }}>📞</div>
              <p style={{ color: '#9ca3af', margin: 0 }}>Encrypted WebRTC Call Room Ready</p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button style={{ backgroundColor: '#16a34a', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '10px', cursor: 'pointer' }}>Audio Call</button>
                <button style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '10px', cursor: 'pointer' }}>Video Call</button>
              </div>
            </div>
          </div>
        )}

        {/* SHORTS TAB */}
        {activeTab === 'shorts' && (
          <div>
            <h3>Shorts Feed</h3>
            <div style={{ backgroundColor: '#11192e', border: '1px solid #1d2945', borderRadius: '20px', height: '380px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '16px', textAlign: 'center' }}>
              <span style={{ fontSize: '12px', color: '#9ca3af', alignSelf: 'flex-end' }}>Trending</span>
              <div>
                <div style={{ fontSize: '50px' }}>🎬</div>
                <p style={{ color: '#9ca3af' }}>Video Stream Player Active</p>
              </div>
              <div style={{ textAlign: 'left' }}>
                <p style={{ margin: 0, fontWeight: 'bold' }}>@wifty_creator</p>
                <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>Building WiftyUp Social App! 🚀</p>
              </div>
            </div>
          </div>
        )}

        {/* AI TAB */}
        {activeTab === 'ai' && (
          <div>
            <h3>Wifty AI Bot</h3>
            <div style={{ backgroundColor: '#11192e', border: '1px solid #1d2945', borderRadius: '16px', padding: '12px', height: '300px', overflowY: 'auto', marginBottom: '10px' }}>
              {aiPrompts.map((p, i) => (
                <div key={i} style={{ backgroundColor: p.sender === 'You' ? '#9333ea' : '#1e2a4a', padding: '8px 12px', borderRadius: '10px', marginBottom: '8px', marginLeft: p.sender === 'You' ? 'auto' : '0', width: 'fit-content', maxWidth: '80%' }}>
                  <small style={{ color: '#cbd5e1', display: 'block', fontWeight: 'bold' }}>{p.sender}</small>
                  <span>{p.text}</span>
                </div>
              ))}
            </div>
            <form onSubmit={handleAiQuery} style={{ display: 'flex', gap: '8px' }}>
              <input type="text" value={aiInput} onChange={e => setAiInput(e.target.value)} placeholder="Ask Wifty AI..." style={{ flex: 1, backgroundColor: '#11192e', border: '1px solid #1d2945', color: '#fff', padding: '10px', borderRadius: '10px', outline: 'none' }} />
              <button type="submit" style={{ backgroundColor: '#9333ea', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '10px', cursor: 'pointer' }}>Ask</button>
            </form>
          </div>
        )}

        {/* CREATOR TAB */}
        {activeTab === 'creator' && (
          <div>
            <h3>Creator Dashboard</h3>
            <div style={gridStyle}>
              <div style={cardStyle}>
                <span style={{ color: '#9ca3af', fontSize: '12px' }}>Total Earnings</span>
                <span style={{ color: '#4ade80', fontSize: '22px', fontWeight: 'bold' }}>$0.00</span>
              </div>
              <div style={cardStyle}>
                <span style={{ color: '#9ca3af', fontSize: '12px' }}>Shorts Views</span>
                <span style={{ color: '#60a5fa', fontSize: '22px', fontWeight: 'bold' }}>1,240</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Bottom Nav */}
      <div style={navStyle}>
        <button onClick={() => setActiveTab('home')} style={navBtnStyle('home')}>
          <span style={{ fontSize: '18px' }}>🏠</span>
          <span>Home</span>
        </button>
        <button onClick={() => setActiveTab('chat')} style={navBtnStyle('chat')}>
          <span style={{ fontSize: '18px' }}>💬</span>
          <span>Chat</span>
        </button>
        <button onClick={() => setActiveTab('shorts')} style={navBtnStyle('shorts')}>
          <span style={{ fontSize: '18px' }}>▶</span>
          <span>Shorts</span>
        </button>
        <button onClick={() => setActiveTab('creator')} style={navBtnStyle('creator')}>
          <span style={{ fontSize: '18px' }}>👤</span>
          <span>Profile</span>
        </button>
      </div>
    </div>
  )
}

