"use client"

interface YoutubeEmbedProps {
  videoId: string
}

export function YoutubeEmbed({ videoId }: YoutubeEmbedProps) {
  // Ensure we're using the video ID only
  const cleanVideoId = videoId.includes('youtu.be/') 
    ? videoId.split('youtu.be/')[1]
    : videoId

  return (
    <div className="relative w-full h-full">
      <iframe
        src={`https://www.youtube.com/embed/${cleanVideoId}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute top-0 left-0 w-full h-full rounded-lg"
      />
    </div>
  )
}