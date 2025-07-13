import { Suspense } from 'react'
import HouseMindMap from './components/HouseMindMap'

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4 mx-auto"></div>
        <p className="text-lg">Loading House Mind Map...</p>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <main>
      <Suspense fallback={<LoadingFallback />}>
        <HouseMindMap />
      </Suspense>
    </main>
  )
}
