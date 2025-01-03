"use client"

import { motion } from "framer-motion"

interface BladeComparisonProps {
  dict: {
    comparison: {
      title: string
      description: string
      blades: {
        name: string
        hardness: number
        flexibility: number
        durability: number
        color: string
      }[]
    }
  }
}

export function BladeComparison({ dict }: BladeComparisonProps) {
  return (
    <section>
      <h2 className="text-3xl font-bold mb-6">{dict.comparison.title}</h2>
      <p className="text-gray-600 mb-8">{dict.comparison.description}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {dict.comparison.blades.map((blade, index) => (
          <motion.div
            key={blade.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-lg shadow-lg"
          >
            <div 
              className="w-full h-2 mb-4 rounded"
              style={{ backgroundColor: blade.color }}
            />
            <h3 className="text-xl font-bold mb-4">{blade.name}</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span>Hardness</span>
                  <span>{blade.hardness}/10</span>
                </div>
                <div className="w-full bg-gray-200 rounded">
                  <div 
                    className="h-2 rounded"
                    style={{ 
                      width: `${blade.hardness * 10}%`,
                      backgroundColor: blade.color 
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span>Flexibility</span>
                  <span>{blade.flexibility}/10</span>
                </div>
                <div className="w-full bg-gray-200 rounded">
                  <div 
                    className="h-2 rounded"
                    style={{ 
                      width: `${blade.flexibility * 10}%`,
                      backgroundColor: blade.color 
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span>Durability</span>
                  <span>{blade.durability}/10</span>
                </div>
                <div className="w-full bg-gray-200 rounded">
                  <div 
                    className="h-2 rounded"
                    style={{ 
                      width: `${blade.durability * 10}%`,
                      backgroundColor: blade.color 
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}