'use client'

import React from 'react'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html>
      <body className="min-h-screen bg-black text-white flex items-center justify-center p-8">
        <div className="max-w-md text-center space-y-4">
          <h2 className="text-2xl font-semibold">Something went wrong</h2>
          {process.env.NODE_ENV !== 'production' && (
            <p className="text-sm text-gray-400 break-words">{error?.message}</p>
          )}
          <button
            onClick={() => reset()}
            className="mt-2 rounded-md border border-white/20 px-4 py-2 text-sm hover:bg-white/10"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
