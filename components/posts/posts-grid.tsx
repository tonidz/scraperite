"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  image_url?: string;
  video_url?: string;
}

interface PostsGridProps {
  posts: Post[];
  columns?: number;
  maxPosts?: number;
}

export function PostsGrid({ posts, columns = 4, maxPosts }: PostsGridProps) {
  const params = useParams();
  const lang = params.lang as string;

  const displayPosts = maxPosts ? posts.slice(0, maxPosts) : posts;

  return (
    <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-6`}>
      {displayPosts.map((post) => (
        <Link
          key={post.id}
          href={`/${lang}/use-cases/${post.id}`}
          className="group"
        >
          <div className="bg-white rounded-lg shadow overflow-hidden transition-transform hover:scale-105">
            {post.image_url ? (
              <div className="aspect-[16/9] relative">
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="object-cover w-full h-full"
                />
              </div>
            ) : (
              <div className="aspect-[16/9] bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400">No image</span>
              </div>
            )}
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2 line-clamp-1">
                {post.title}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-2">
                {post.content}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
