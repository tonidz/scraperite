"use client";

import { createClient } from "@/lib/supabase/client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function UseCaseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const getVideoEmbedUrl = (url: string) => {
    // Handle YouTube URLs
    const youtubeMatch = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    );
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }

    // Handle Vimeo URLs
    const vimeoMatch = url.match(/vimeo\.com\/(?:.*#|.*)\/?([\d]+)/);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }

    return url;
  };

  useEffect(() => {
    const fetchPost = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", params.id)
        .single();

      if (!error && data) {
        setPost(data);
      }
      setLoading(false);
    };

    fetchPost();
  }, [params.id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className="container mx-auto py-16 px-4">
      <Button variant="ghost" className="mb-8" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <article className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">{post.title}</h1>
        <div className="prose max-w-full bg-gray-50 rounded-lg p-4">
          {post.image_url && (
            <img
              src={post.image_url}
              alt={post.title}
              className="rounded-lg w-1/3 float-left mr-4 mb-4"
            />
          )}
          <p className="whitespace-pre-line text-lg">{post.content}</p>
        </div>

        {post.video_url && (
          <div className="mt-8 aspect-video">
            <iframe
              src={getVideoEmbedUrl(post.video_url)}
              className="w-full h-full rounded-lg"
              allowFullScreen
            />
          </div>
        )}
      </article>
    </div>
  );
}
