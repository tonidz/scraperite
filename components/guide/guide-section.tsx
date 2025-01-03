"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

interface GuideProps {
  dict: {
    title: string;
    safetyTitle: string;
    safetyText: string;
    applications: {
      title: string;
      items: string[];
    };
    tips: {
      title: string;
      items: string[];
    };
  };
  videos?: string[]; // Array of YouTube video IDs
}

function YouTubeEmbed({ videoId }: { videoId: string }) {
  return (
    <div className="aspect-video">
      <iframe
        className="w-full h-full rounded-lg"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

export function GuideSection({ dict, videos = [] }: GuideProps) {
  return (
    <section className="py-16 mt-16 bg-white rounded-lg shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">{dict.title}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="p-6">
            <h3 className="text-2xl font-bold mb-4">{dict.safetyTitle}</h3>
            <p className="text-gray-600">{dict.safetyText}</p>
          </Card>

          <Card className="p-6">
            <h3 className="text-2xl font-bold mb-4">
              {dict.applications.title}
            </h3>
            <ul className="space-y-3">
              {dict.applications.items.map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </Card>
        </div>

        <Card className="p-6 mb-12">
          <h3 className="text-2xl font-bold mb-4">{dict.tips.title}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dict.tips.items.map((tip, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg"
              >
                <span className="font-bold text-xl text-gray-400">
                  {index + 1}.
                </span>
                <span>{tip}</span>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Video Grid - Moved to bottom */}
        {videos.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold mb-6">Product Demonstrations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {videos.map((videoId, index) => (
                <motion.div
                  key={videoId}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <YouTubeEmbed videoId={videoId} />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
