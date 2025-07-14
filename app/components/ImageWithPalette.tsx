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
        <div
            className="mb-0.5 md:mb-6 p-0.5 md:p-4 lg:p-8 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 shadow-lg"
            style={{ margin: '1px md:12px', padding: '1px md:12px' }}
        >
            <div style={{ margin: '0.5px 0' }}>
                <div className="flex flex-col md:flex-row gap-0.5 md:gap-4 lg:gap-6 items-stretch" style={{ gap: '1px md:12px' }}>
                    <div className="flex-1" style={{ flex: 1 }}>
                        <div className="mobile-image-container md:auto" style={{ margin: '0', padding: '1px md:12px', backgroundColor: 'rgba(255,255,255,0.05)' }}>
                            <img
                                src={imageSrc}
                                alt={alt}
                                className="w-full h-auto md:h-auto object-contain rounded-lg shadow-lg"
                                style={{ width: '100%', height: 'auto' }}
                            />
                        </div>
                    </div>
                    <div className="flex-shrink-0 flex w-full md:w-auto justify-center md:justify-start">
                        {isLoading && (
                            <div className="w-10 md:w-16 bg-gray-200 rounded-lg flex items-center justify-center animate-pulse">
                                <span className="text-gray-400 text-xs">Loading...</span>
                            </div>
                        )}
                        {error && (
                            <div className="w-10 md:w-16 bg-yellow-100 rounded-lg flex items-center justify-center" title={`Image: ${imageSrc}`}>
                                <span className="text-yellow-600 text-xs">⚠️</span>
                            </div>
                        )}
                        {!isLoading && !error && (
                            <ColorPaletteDisplay
                                colors={colors}
                                className="ml-0 md:ml-4 flex-1"
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
