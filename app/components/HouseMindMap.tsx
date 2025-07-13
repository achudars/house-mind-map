'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Home,
  MapPin,
  Trees,
  Bath,
  ChefHat,
  Bed,
  Sofa
} from 'lucide-react'

interface Room {
  id: string
  name: string
  icon: React.ReactNode
  angle: number
  color: string
}

const rooms: Room[] = [
  { id: 'interior', name: 'INTERIOR', icon: <MapPin size={24} />, angle: 0, color: 'bg-slate-500' },
  { id: 'living', name: 'LIVING ROOM', icon: <Sofa size={24} />, angle: 60, color: 'bg-gray-500' },
  { id: 'bathroom', name: 'BATHROOM', icon: <Bath size={24} />, angle: 120, color: 'bg-zinc-500' },
  { id: 'exterior', name: 'EXTERIOR', icon: <Trees size={24} />, angle: 180, color: 'bg-neutral-600' },
  { id: 'kitchen', name: 'KITCHEN', icon: <ChefHat size={24} />, angle: 240, color: 'bg-stone-500' },
  { id: 'bedroom', name: 'BEDROOM', icon: <Bed size={24} />, angle: 300, color: 'bg-gray-600' },
]

export default function HouseMindMap() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null)
  const [roomImages, setRoomImages] = useState<string[]>([])

  const centerX = 800  // Doubled from 400 to 800
  const centerY = 300
  const radius = 200

  // Initialize selected room from URL parameters
  useEffect(() => {
    const roomFromUrl = searchParams.get('room')
    if (roomFromUrl && rooms.some(room => room.id === roomFromUrl)) {
      setSelectedRoom(roomFromUrl)
    }
  }, [searchParams])

  // Function to update URL when room selection changes
  const updateRoomSelection = (roomId: string | null) => {
    setSelectedRoom(roomId)

    // Update URL
    const params = new URLSearchParams(searchParams.toString())
    if (roomId) {
      params.set('room', roomId)
    } else {
      params.delete('room')
    }

    const newUrl = params.toString() ? `?${params.toString()}` : '/'
    router.push(newUrl, { scroll: false })
  }

  // Function to get images for a specific room
  const getRoomImages = (roomId: string): string[] => {
    const imageMap: Record<string, string[]> = {
      interior: [
        '/interior/interior1.jpg',
        '/interior/interior2.jpg',
        '/interior/interior3.jpg'
      ],
      // Add other rooms here when images are available
      living: [],
      bathroom: [],
      exterior: [],
      kitchen: [],
      bedroom: []
    }
    return imageMap[roomId] || []
  }

  // Load images when room is selected
  React.useEffect(() => {
    if (selectedRoom) {
      const images = getRoomImages(selectedRoom)
      setRoomImages(images)
    } else {
      setRoomImages([])
    }
  }, [selectedRoom])

  // Utility function to ensure consistent rounding and prevent hydration mismatches
  const roundCoordinate = (value: number): number => {
    return Math.round(value * 100) / 100
  }

  const getRoomPosition = (angle: number) => {
    const radian = (angle * Math.PI) / 180
    return {
      x: roundCoordinate(centerX + radius * Math.cos(radian)),
      y: roundCoordinate(centerY + radius * Math.sin(radian)),
    }
  }

  const getRoomPositionVertical = (index: number) => {
    const verticalSpacing = 140 // Increased spacing for better text visibility
    const startY = 120 // Moved up slightly to fit better
    return {
      x: 280, // Adjusted for wider canvas - moved further right
      y: startY + (index * verticalSpacing),
    }
  }

  const getConnectionPath = (angle: number) => {
    const innerRadius = 80
    const outerRadius = radius - 40
    const radian = (angle * Math.PI) / 180

    const startX = roundCoordinate(centerX + innerRadius * Math.cos(radian))
    const startY = roundCoordinate(centerY + innerRadius * Math.sin(radian))
    const endX = roundCoordinate(centerX + outerRadius * Math.cos(radian))
    const endY = roundCoordinate(centerY + outerRadius * Math.sin(radian))

    return `M ${startX} ${startY} L ${endX} ${endY}`
  }

  return (
    <div className={`${selectedRoom ? 'main-container-expanded' : 'main-container'} p-8 bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900`}>
      <div className={`${selectedRoom ? 'flex items-start justify-center' : 'flex items-center justify-center min-h-screen'}`}>
        <div className="relative">
          <svg
            width="1600"
            height={selectedRoom ? "900" : "600"}
            viewBox={selectedRoom ? "0 0 1600 900" : "0 0 1600 600"}
            className="drop-shadow-2xl transition-all duration-500"
          >
            {/* Connection lines - only show when no room is selected */}
            {!selectedRoom && rooms.map((room) => (
              <path
                key={`line-${room.id}`}
                d={getConnectionPath(room.angle)}
                stroke={selectedRoom === room.id || hoveredRoom === room.id ? '#60a5fa' : '#374151'}
                strokeWidth={selectedRoom === room.id || hoveredRoom === room.id ? '3' : '2'}
                strokeDasharray="5,5"
                className={`transition-all duration-300 ${selectedRoom === room.id || hoveredRoom === room.id
                  ? 'connection-line-active'
                  : 'connection-line-inactive'
                  }`}
              />
            ))}

            {/* Circular grid - only show when no room is selected */}
            {!selectedRoom && (
              <>
                <circle
                  cx={centerX}
                  cy={centerY}
                  r="120"
                  fill="none"
                  stroke="#374151"
                  strokeWidth="1"
                  strokeDasharray="2,4"
                  opacity="0.3"
                />
                <circle
                  cx={centerX}
                  cy={centerY}
                  r="160"
                  fill="none"
                  stroke="#374151"
                  strokeWidth="1"
                  strokeDasharray="2,4"
                  opacity="0.2"
                />
              </>
            )}

            {/* Small decorative dots - only show when no room is selected */}
            {!selectedRoom && rooms.map((room) => {
              const midRadius = 140
              const radian = (room.angle * Math.PI) / 180
              const dotX = roundCoordinate(centerX + midRadius * Math.cos(radian))
              const dotY = roundCoordinate(centerY + midRadius * Math.sin(radian))

              return (
                <circle
                  key={`dot-${room.id}`}
                  cx={dotX}
                  cy={dotY}
                  r="3"
                  fill={hoveredRoom === room.id ? '#60a5fa' : '#6b7280'}
                  className="transition-all duration-300"
                />
              )
            })}
          </svg>

          {/* Central home icon - only show when no room is selected */}
          {!selectedRoom && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                <div className="w-32 h-32 bg-white rounded-full shadow-2xl flex items-center justify-center animate-float">
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center shadow-inner">
                    <Home size={48} className="text-white drop-shadow-lg" />
                  </div>
                </div>
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                  <span className="text-white font-bold text-lg tracking-wider drop-shadow-lg">
                    HOME
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Room buttons */}
          {rooms.map((room, index) => {
            const position = selectedRoom ? getRoomPositionVertical(index) : getRoomPosition(room.angle)
            const isSelected = selectedRoom === room.id
            const isHovered = hoveredRoom === room.id

            return (
              <button
                key={room.id}
                className={selectedRoom ? "room-button-fixed" : "room-button"}
                style={{
                  '--button-left': `${position.x}px`,
                  '--button-top': `${position.y}px`,
                } as React.CSSProperties}
                onMouseEnter={() => setHoveredRoom(room.id)}
                onMouseLeave={() => setHoveredRoom(null)}
                onClick={() => updateRoomSelection(selectedRoom === room.id ? null : room.id)}
                aria-label={`Select ${room.name}`}
              >
                <div className="relative group">
                  <div
                    className={`w-20 h-20 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 transform ${isSelected || isHovered
                      ? 'scale-110 shadow-2xl'
                      : 'scale-100 hover:scale-105'
                      } ${isSelected
                        ? 'bg-gradient-to-br from-blue-400 to-blue-600 ring-4 ring-blue-300 ring-opacity-50'
                        : 'bg-white hover:bg-gray-50'
                      }`}
                  >
                    <div className={`transition-colors duration-300 ${isSelected ? 'text-white' : 'text-gray-700'
                      }`}>
                      {room.icon}
                    </div>
                  </div>

                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                    <span className={`text-sm font-semibold tracking-wide transition-all duration-300 ${isSelected || isHovered
                      ? 'text-white text-shadow-lg scale-105'
                      : 'text-gray-300'
                      }`}>
                      {room.name}
                    </span>
                  </div>

                  {/* Pulse animation for selected room */}
                  {isSelected && (
                    <div className="absolute inset-0 w-20 h-20 rounded-full bg-blue-400 opacity-30 animate-ping"></div>
                  )}
                </div>
              </button>
            )
          })}

          {/* Selected room info */}
          {selectedRoom && (
            <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
              <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg px-6 py-3 shadow-xl border border-white border-opacity-20">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-white text-center font-medium">
                    Selected: <span className="font-bold">{rooms.find(r => r.id === selectedRoom)?.name}</span>
                  </p>
                  <button
                    onClick={() => updateRoomSelection(null)}
                    className="p-1 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors"
                    aria-label="Back to home view"
                  >
                    <Home size={16} className="text-white" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Center content area - appears when room is selected */}
          {selectedRoom && (
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2">
              <div className="content-area bg-white bg-opacity-5 backdrop-blur-sm rounded-lg border border-white border-opacity-20 p-4">
                {roomImages.length > 0 ? (
                  <div className="space-y-4">
                    {roomImages.map((imageSrc, index) => (
                      <div key={imageSrc} className="w-full">
                        <img
                          src={imageSrc}
                          alt={`${selectedRoom} view ${index + 1}`}
                          className="w-full h-auto object-cover rounded-lg shadow-lg"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-white text-opacity-50 text-center p-8">
                    <div className="text-6xl mb-4">📷</div>
                    <p className="text-lg font-medium">No Images Available</p>
                    <p className="text-sm">Images for {selectedRoom} will appear here</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
