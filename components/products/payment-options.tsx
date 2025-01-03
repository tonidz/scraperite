"use client"

import { motion } from "framer-motion"
import { Lock, CreditCard, Shield } from "lucide-react"

interface PaymentOptionsProps {
  dict: {
    securePayment: string
    paymentMethods: string
    securityNote: string
  }
}

export function PaymentOptions({ dict }: PaymentOptionsProps) {
  return (
    <motion.div 
      className="mt-8 p-6 bg-gray-50 rounded-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Lock className="h-5 w-5 text-green-600" />
        <span className="font-medium">{dict.securePayment}</span>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2">
          <img src="/visa.svg" alt="Visa" className="h-8" />
          <img src="/mastercard.svg" alt="Mastercard" className="h-8" />
        </div>
        <div className="flex items-center gap-2">
          <img src="/klarna.svg" alt="Klarna" className="h-8" />
          <img src="/swish.svg" alt="Swish" className="h-8" />
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Shield className="h-4 w-4" />
        <span>{dict.securityNote}</span>
      </div>
    </motion.div>
  )
}