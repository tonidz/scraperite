"use client"

import { motion } from "framer-motion"
import { CheckCircle2 } from "lucide-react"

interface BladeFeaturesProps {
  dict: {
    features: {
      title: string
      description: string
      list: {
        title: string
        description: string
      }[]
    }
  }
}

export function BladeFeatures({ dict }: BladeFeaturesProps) {
  return (
    <section>
      <h2 className="text-3xl font-bold mb-6">{dict.features.title}</h2>
      <p className="text-gray-600 mb-8">{dict.features.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {dict.features.list.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-4 bg-white p-6 rounded-lg shadow-lg"
          >
            <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}