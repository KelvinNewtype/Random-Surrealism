import React from 'react'
import ArtCanvas from './components/ArtCanvas'

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0a1e] via-[#1a1233] to-[#0a1a1f] text-pearl font-sans">
      <div className="container mx-auto px-6 py-12">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-400" style={{fontFamily: "'Playfair Display', serif"}}>Random Surrealism</h1>
          <p className="mt-4 text-lg text-gray-200 max-w-2xl mx-auto">Generate exquisite surrealist masterpieces that transcend the boundaries between dreams and reality. Each creation is a unique journey into the sublime.</p>
        </header>

        <main id="main-content">
          <div className="flex flex-col items-center gap-8">
            <ArtCanvas />
            <div className="text-center text-sm text-gray-300 mt-6">Crafted with <span role="img" aria-label="sparkles">✨</span> by <strong><a href="https://x.com/KelvinNewtype" className="text-yellow-300">Kelvin Newtype</a></strong></div>
          </div>
        </main>
      </div>
    </div>
  )
}
