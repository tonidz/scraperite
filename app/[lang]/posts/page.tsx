"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState, useCallback } from "react";
import { PostForm } from "@/components/posts/post-form";
import { PostCard } from "@/components/posts/post-card";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  author_id: string;
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  const fetchPosts = useCallback(async () => {
    const supabase = createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    // Fetch posts
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch posts",
        variant: "destructive",
      });
      return;
    }

    setPosts(data || []);
    setLoading(false);
  }, [router, toast]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8">Posts</h1>

      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Create New Post</h2>
          <PostForm onSuccess={fetchPosts} />
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">All Posts</h2>
          {posts.map((post: Post) => (
            <PostCard key={post.id} post={post} onUpdate={fetchPosts} />
          ))}
        </div>
      </div>
    </div>
  );
}
