"use client"

import { motion } from "framer-motion"

interface BladeSurfacesProps {
  dict: {
    surfaces: {
      title: string
      description: string
      blades: {
        name: string
        color: string
        surfaces: string[]
      }[]
    }
  }
}

export function BladeSurfaces({ dict }: BladeSurfacesProps) {
  return (
    <section>
      <h2 className="text-3xl font-bold mb-6">{dict.surfaces.title}</h2>
      <p className="text-gray-600 mb-8">{dict.surfaces.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {dict.surfaces.blades.map((blade, index) => (
          <motion.div
            key={blade.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-lg shadow-lg"
          >
            <div className="flex items-center gap-4 mb-6">
              <div 
                className="w-6 h-6 rounded-full"
                style={{ backgroundColor: blade.color }}
              />
              <h3 className="text-xl font-bold">{blade.name}</h3>
            </div>

            <ul className="space-y-3">
              {blade.surfaces.map((surface, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (index * 0.1) + (idx * 0.05) }}
                  className="flex items-center gap-3 text-gray-600"
                >
                  <span className="w-2 h-2 rounded-full bg-gray-400" />
                  {surface}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  )
}