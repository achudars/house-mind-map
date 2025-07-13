'use client'

import React, { useState } from 'react'
import {
  Home,
  MapPin,
  Trees,
  Bath,
  ChefHat,
  Bed,
  Sofa,
  Wifi
} from 'lucide-react'

interface Room {
  id: string
  name: string
  icon: React.ReactNode
  angle: number
  color: string
}

const rooms: Room[] = [
  { id: 'interior', name: 'INTERIOR', icon: <MapPin size={24} />, angle: 0, color: 'bg-blue-500' },
  { id: 'living', name: 'LIVING ROOM', icon: <Sofa size={24} />, angle: 45, color: 'bg-green-500' },
  { id: 'exterior', name: 'EXTERIOR', icon: <Trees size={24} />, angle: 90, color: 'bg-emerald-500' },
  { id: 'bathroom', name: 'BATHROOM', icon: <Bath size={24} />, angle: 135, color: 'bg-cyan-500' },
  { id: 'kitchen', name: 'KITCHEN', icon: <ChefHat size={24} />, angle: 180, color: 'bg-orange-500' },
  { id: 'bedroom', name: 'BEDROOM', icon: <Bed size={24} />, angle: 225, color: 'bg-purple-500' },
]

export default function HouseMindMap() {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null)

  const centerX = 400
  const centerY = 300
  const radius = 200

  const getRoomPosition = (angle: number) => {
    const radian = (angle * Math.PI) / 180
    return {
      x: centerX + radius * Math.cos(radian),
      y: centerY + radius * Math.sin(radian),
    }
  }

  const getConnectionPath = (angle: number) => {
    const innerRadius = 80
    const outerRadius = radius - 40
    const radian = (angle * Math.PI) / 180

    const startX = centerX + innerRadius * Math.cos(radian)
    const startY = centerY + innerRadius * Math.sin(radian)
    const endX = centerX + outerRadius * Math.cos(radian)
    const endY = centerY + outerRadius * Math.sin(radian)

    return `M ${startX} ${startY} L ${endX} ${endY}`
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="relative">
        <svg
          width="800"
          height="600"
          viewBox="0 0 800 600"
          className="drop-shadow-2xl"
        >
          {/* Connection lines */}
          {rooms.map((room) => (
            <path
              key={`line-${room.id}`}
              d={getConnectionPath(room.angle)}
              stroke={selectedRoom === room.id || hoveredRoom === room.id ? '#60a5fa' : '#374151'}
              strokeWidth={selectedRoom === room.id || hoveredRoom === room.id ? '3' : '2'}
              strokeDasharray="5,5"
              className="transition-all duration-300"
              style={{
                opacity: selectedRoom === room.id || hoveredRoom === room.id ? 1 : 0.4,
              }}
            />
          ))}

          {/* Circular grid */}
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

          {/* Small decorative dots */}
          {rooms.map((room) => {
            const midRadius = 140
            const radian = (room.angle * Math.PI) / 180
            const dotX = centerX + midRadius * Math.cos(radian)
            const dotY = centerY + midRadius * Math.sin(radian)

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

        {/* Central home icon */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <div className="w-32 h-32 bg-white rounded-full shadow-2xl flex items-center justify-center animate-float">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-inner">
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

        {/* Room buttons */}
        {rooms.map((room) => {
          const position = getRoomPosition(room.angle)
          const isSelected = selectedRoom === room.id
          const isHovered = hoveredRoom === room.id

          return (
            <div
              key={room.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              style={{
                left: position.x,
                top: position.y,
              }}
              onMouseEnter={() => setHoveredRoom(room.id)}
              onMouseLeave={() => setHoveredRoom(null)}
              onClick={() => setSelectedRoom(selectedRoom === room.id ? null : room.id)}
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
            </div>
          )
        })}

        {/* Selected room info */}
        {selectedRoom && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg px-6 py-3 shadow-xl border border-white border-opacity-20">
              <p className="text-white text-center font-medium">
                Selected: <span className="font-bold">{rooms.find(r => r.id === selectedRoom)?.name}</span>
              </p>
            </div>
          </div>
        )}

        {/* Network signal indicator */}
        <div className="absolute top-4 right-4">
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-3 shadow-xl border border-white border-opacity-20">
            <Wifi size={20} className="text-white" />
          </div>
        </div>
      </div>
    </div>
  )
}
