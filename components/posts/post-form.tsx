"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Image, Link } from "lucide-react";

interface PostFormProps {
  initialData?: {
    id: string;
    title: string;
    content: string;
    image_url?: string;
    video_url?: string;
  };
  onSuccess?: () => void;
}

export function PostForm({ initialData, onSuccess }: PostFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    content: initialData?.content || "",
    image_url: initialData?.image_url || "",
    video_url: initialData?.video_url || "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleImageUpload = async (file: File) => {
    const supabase = createClient();

    // Create a unique file name
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload the file
    const { data, error } = await supabase.storage
      .from("post_images")
      .upload(filePath, file);

    if (error) throw error;

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("post_images").getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("You must be logged in to create or edit posts");
      }

      // Handle image upload if there's a new image
      let imageUrl = formData.image_url;
      if (imageFile) {
        imageUrl = await handleImageUpload(imageFile);
      }

      const postData = {
        title: formData.title,
        content: formData.content,
        image_url: imageUrl,
        video_url: formData.video_url,
      };

      if (initialData) {
        // Update existing post
        const { error } = await supabase
          .from("posts")
          .update(postData)
          .eq("id", initialData.id)
          .eq("author_id", user.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Post updated successfully",
        });
      } else {
        // Create new post
        const { error } = await supabase.from("posts").insert([
          {
            ...postData,
            author_id: user.id,
          },
        ]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Post created successfully",
        });
      }

      // Reset form and call success callback
      if (!initialData) {
        setFormData({ title: "", content: "", image_url: "", video_url: "" });
        setImageFile(null);
      }
      onSuccess?.();
    } catch (error: any) {
      console.error("Error saving post:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          placeholder="Post title"
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
          required
        />
      </div>
      <div>
        <Textarea
          placeholder="Post content"
          value={formData.content}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, content: e.target.value }))
          }
          required
          className="min-h-[200px]"
        />
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">Image</label>
          <div className="flex items-center gap-2">
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setImageFile(file);
              }}
              className="flex-1"
            />
            {formData.image_url && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setFormData((prev) => ({ ...prev, image_url: "" }));
                  setImageFile(null);
                }}
              >
                Remove
              </Button>
            )}
          </div>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">Video URL</label>
          <Input
            type="url"
            placeholder="YouTube or Vimeo URL"
            value={formData.video_url}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, video_url: e.target.value }))
            }
          />
        </div>
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : initialData ? "Update Post" : "Create Post"}
      </Button>
    </form>
  );
}
