"use client"

import { YoutubeEmbed } from './youtube-embed'

interface BladeSectionProps {
  title: string
  description: string
  color: string
  videoId: string
}

export function BladeSection({ title, description, color, videoId }: BladeSectionProps) {
  return (
    <div className="bg-white rounded-lg p-8 shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-2xl font-bold mb-4">{title}</h3>
          <div 
            className="w-16 h-2 mb-4"
            style={{ backgroundColor: color }}
          />
          <p className="text-lg leading-relaxed">{description}</p>
        </div>
        <div className="aspect-video">
          <YoutubeEmbed videoId={videoId} />
        </div>
      </div>
    </div>
  )
}