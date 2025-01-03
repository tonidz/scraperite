interface GuideIntroProps {
  text: string
}

export function GuideIntro({ text }: GuideIntroProps) {
  return (
    <div className="bg-white rounded-lg p-8 shadow-lg mb-8">
      <p className="text-lg leading-relaxed">{text}</p>
    </div>
  )
}