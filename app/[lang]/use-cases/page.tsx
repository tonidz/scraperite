"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { PostsGrid } from "@/components/posts/posts-grid";

export default function UseCasesPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

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

  return (
    <div className="container mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold mb-12 text-center">Use Cases</h1>
      <PostsGrid posts={posts} columns={4} />
    </div>
  );
}
