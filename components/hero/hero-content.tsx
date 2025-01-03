"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { HeroCounter } from "./hero-counter";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

interface HeroContentProps {
  dict: {
    title: string;
    description: string;
    button: string;
    stats: {
      monthlyTraffic: string;
      happyCustomers: string;
    };
  };
}

export function HeroContent({ dict }: HeroContentProps) {
  const router = useRouter();
  const params = useParams();
  const lang = params.lang as string;

  const titleWords = dict.title.split(" ");

  return (
    <div className="flex flex-col justify-center space-y-12 w-full">
      <div>
        <h1 className="text-4xl md:text-7xl font-bold leading-tight">
          {titleWords.map((word, index) => (
            <motion.span
              key={index}
              className="inline-block mr-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: [0.43, 0.13, 0.23, 0.96],
              }}
            >
              {word}
            </motion.span>
          ))}
        </h1>
        <motion.p
          className="text-lg mt-6 text-gray-600 max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {dict.description}
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <Button
          className="bg-black text-white hover:bg-gray-800 rounded-full px-8 py-6 flex items-center gap-3 text-lg"
          variant="default"
          onClick={() => router.push(`/${lang}/demo`)}
        >
          <ShoppingBag className="h-5 w-5" />
          {dict.button}
          <ArrowRight className="h-5 w-5" />
        </Button>
      </motion.div>
    </div>
  );
}
