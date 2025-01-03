"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PostsGrid } from "./posts-grid";

// Define the Post type
interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  image_url?: string;
  video_url?: string;
}

export function FeaturedPosts() {
  // Add type to useState
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(6);

      if (!error && data) {
        setPosts(data);
      }
      setLoading(false);
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="py-16 ">
      <div className="container mx-auto bg-gray-50 px-4 py-14 rounded-lg">
        <h2 className="text-3xl font-bold text-center mb-12">Latest Posts</h2>
        <PostsGrid posts={posts} columns={3} maxPosts={6} />
      </div>
    </section>
  );
}
