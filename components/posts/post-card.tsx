"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PostForm } from "./post-form";
import { Pencil, Trash2, Image as ImageIcon, Video } from "lucide-react";

interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  author_id: string;
  image_url?: string;
  video_url?: string;
}

interface PostCardProps {
  post: Post;
  onUpdate: () => void;
}

export function PostCard({ post, onUpdate }: PostCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      const supabase = createClient();

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("You must be logged in to delete posts");
      }

      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", post.id)
        .eq("author_id", user.id); // Ensure user owns the post

      if (error) throw error;

      toast({
        title: "Success",
        description: "Post deleted successfully",
      });
      onUpdate();
    } catch (error: any) {
      console.error("Error deleting post:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to delete post. Please try again.",
        variant: "destructive",
      });
    }
  };

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

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Edit Post</h3>
          <Button variant="ghost" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
        </div>
        <PostForm
          initialData={post}
          onSuccess={() => {
            setIsEditing(false);
            onUpdate();
          }}
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
          <p className="text-sm text-gray-500">
            Posted on {new Date(post.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(true)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  post.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-600 hover:bg-red-700"
                  onClick={handleDelete}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <div className="space-y-4">
        <p className="text-gray-600 whitespace-pre-line">{post.content}</p>

        {post.image_url && (
          <div className="mt-4">
            <img
              src={post.image_url}
              alt={post.title}
              className="rounded-lg max-h-96 object-cover"
            />
          </div>
        )}

        {post.video_url && (
          <div className="mt-4 aspect-video">
            <iframe
              src={getVideoEmbedUrl(post.video_url)}
              className="w-full h-full rounded-lg"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        )}
      </div>
    </div>
  );
}
