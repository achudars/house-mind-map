'use client'

/* eslint-disable react/forbid-dom-props */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import { useState, useEffect, useCallback } from 'react'
import { ColorThief } from './color-thief/color-thief.js'

interface ColorPalette {
    colors: number[][]
    isLoading: boolean
    error: string | null
}

/**
 * Custom hook to extract color palette from an image
 * @param imageSrc - The source URL of the image
 * @param colorCount - Number of colors to extract (default: 5)
 * @returns ColorPalette object with colors, loading state, and error
 */
export function useColorPalette(imageSrc: string, colorCount: number = 5): ColorPalette {
    const [colors, setColors] = useState<number[][]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const extractColors = useCallback(async (src: string) => {
        if (!src) {
            setColors([])
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            // Create a new image element
            const img = new Image()
            img.crossOrigin = 'anonymous'

            return new Promise<void>((resolve, reject) => {
                img.onload = () => {
                    try {
                        // Extract color palette using ColorThief
                        const palette = ColorThief.getPalette(img, colorCount, 10)
                        if (palette) {
                            setColors(palette)
                        } else {
                            setColors([])
                            setError('Failed to extract colors from image')
                        }
                        setIsLoading(false)
                        resolve()
                    } catch (err) {
                        setError('Error processing image')
                        setIsLoading(false)
                        reject(err)
                    }
                }

                img.onerror = () => {
                    setError('Failed to load image')
                    setIsLoading(false)
                    reject(new Error('Image load failed'))
                }

                img.src = src
            })
        } catch (err) {
            console.error('Error extracting color palette:', err)
            setError('Error extracting color palette')
            setIsLoading(false)
        }
    }, [colorCount])

    useEffect(() => {
        extractColors(imageSrc)
    }, [imageSrc, extractColors])

    return { colors, isLoading, error }
}

/**
 * Component to display a vertical color palette
 * @param colors - Array of RGB color arrays
 * @param className - Additional CSS classes
 */
interface ColorPaletteDisplayProps {
    colors: number[][]
    className?: string
}

export function ColorPaletteDisplay({ colors, className = '' }: ColorPaletteDisplayProps) {
    const handleColorClick = (color: number[]) => {
        const hexColor = ColorThief.rgbToHex(color)
        navigator.clipboard.writeText(hexColor).catch(console.error)
    }

    if (!colors || colors.length === 0) {
        return (
            <div className={`w-16 min-h-40 bg-gray-200 rounded-lg flex items-center justify-center ${className}`}>
                <span className="text-gray-400 text-xs">No colors</span>
            </div>
        )
    }

    return (
        <div className={`w-16 h-full rounded-lg shadow-lg flex flex-col gap-2 py-1 ${className}`}>
            {colors.map((color, index) => {
                const colorKey = `${color[0]}-${color[1]}-${color[2]}-${index}`
                const hexColor = ColorThief.rgbToHex(color)

                // Calculate luminance to determine text color (white or black)
                const luminance = (0.299 * color[0] + 0.587 * color[1] + 0.114 * color[2]) / 255
                const textColor = luminance > 0.5 ? '#000000' : '#FFFFFF'

                return (
                    <div key={colorKey} className="flex-1 min-h-0">
                        <div
                            className={`w-full h-full cursor-pointer rounded-sm flex items-center justify-center`}
                            title={`RGB(${color[0]}, ${color[1]}, ${color[2]}) | ${hexColor}`}
                            onClick={() => handleColorClick(color)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault()
                                    handleColorClick(color)
                                }
                            }}
                            role="button"
                            tabIndex={0}
                            aria-label={`Color ${hexColor}, click to copy`}
                            style={{
                                backgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
                            }}
                        >
                            <span
                                className="text-xs font-bold text-center leading-tight px-1"
                                style={{
                                    color: textColor,
                                    textShadow: textColor === '#FFFFFF' ? '0 1px 2px rgba(0,0,0,0.5)' : '0 1px 2px rgba(255,255,255,0.5)'
                                }}
                            >
                                {hexColor}
                            </span>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
