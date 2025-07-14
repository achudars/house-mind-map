'use client'

import React from 'react'
import { useColorPalette, ColorPaletteDisplay } from '../lib/useColorPalette'

interface ImageWithPaletteProps {
    imageSrc: string
    alt: string
    roomName: string
    index: number
}

export function ImageWithPalette({ imageSrc, alt, roomName, index }: ImageWithPaletteProps) {
    const { colors, isLoading, error } = useColorPalette(imageSrc, 5)

    return (
        <div className="mb-4">
            <div className="flex gap-4 items-start">
                <div className="flex-1">
                    <img
                        src={imageSrc}
                        alt={alt}
                        className="w-full h-auto object-cover rounded-lg shadow-lg"
                    />
                </div>
                <div className="flex-shrink-0">
                    {isLoading && (
                        <div className="w-16 h-40 bg-gray-200 rounded-lg flex items-center justify-center animate-pulse">
                            <span className="text-gray-400 text-xs">Loading...</span>
                        </div>
                    )}
                    {error && (
                        <div className="w-16 h-40 bg-red-100 rounded-lg flex items-center justify-center">
                            <span className="text-red-400 text-xs">Error</span>
                        </div>
                    )}
                    {!isLoading && !error && (
                        <ColorPaletteDisplay
                            colors={colors}
                            className="ml-4"
                        />
                    )}
                </div>
            </div>
        </div>
    )
}
