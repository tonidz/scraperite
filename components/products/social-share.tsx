"use client"

import { Facebook, Twitter, Link } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface SocialShareProps {
  url: string
  title: string
  dict: {
    share: string
    copied: string
  }
}

export function SocialShare({ url, title, dict }: SocialShareProps) {
  const { toast } = useToast()

  const shareOnFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      "_blank"
    )
  }

  const copyLink = async () => {
    await navigator.clipboard.writeText(url)
    toast({
      title: dict.copied,
      duration: 2000,
    })
  }

  return (
    <div className="flex items-center gap-4 mt-8">
      <span className="text-sm text-gray-600">{dict.share}:</span>
      <Button
        variant="outline"
        size="icon"
        onClick={shareOnFacebook}
        className="rounded-full"
      >
        <Facebook className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={copyLink}
        className="rounded-full"
      >
        <Link className="h-4 w-4" />
      </Button>
    </div>
  )
}