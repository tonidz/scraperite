interface HeroStatsProps {
  dict: {
    monthlyTraffic: string
    happyCustomers: string
  }
}

export function HeroStats({ dict }: HeroStatsProps) {
  return (
    <div className="flex gap-16">
      <div>
        <p className="text-2xl font-bold">{dict.monthlyTraffic}</p>
        <p className="text-sm text-gray-600">{dict.monthlyTraffic}</p>
      </div>
      <div>
        <p className="text-2xl font-bold">100K</p>
        <p className="text-sm text-gray-600">{dict.happyCustomers}</p>
      </div>
    </div>
  )
}