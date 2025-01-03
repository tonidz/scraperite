interface ProductShowcaseTitleProps {
  title: string
}

export function ProductShowcaseTitle({ title }: ProductShowcaseTitleProps) {
  return (
    <div className="text-center mb-12">
      <h2 className="text-4xl font-bold">{title}</h2>
    </div>
  )
}