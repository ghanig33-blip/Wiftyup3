'use client'

import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#080d1a] text-white p-6 flex flex-col items-center justify-center text-center">
      <h1 className="text-3xl font-bold mb-4">WiftyUp Dashboard</h1>
      <p className="text-gray-400 mb-6">Redirecting to primary features...</p>
      <button 
        onClick={() => router.push('/')}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl transition"
      >
        Go to Main App
      </button>
    </div>
  )
}

