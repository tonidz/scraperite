import Image from "next/image";

interface TestimonialsSectionProps {
  dict: {
    title: string;
    subtitle: string;
    testimonials: {
      text: string;
      author: string;
    }[];
  };
}

export function TestimonialsSection({ dict }: TestimonialsSectionProps) {
  return (
    <section className="relative mt-24 py-24 overflow-hidden min-h-[800px] rounded-lg shadow-lg">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <Image
          src="/pan_cleaning.jpg"
          alt="Background"
          fill
          sizes="100vw"
          style={{ objectFit: "cover" }}
          className="opacity-30"
          priority
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">{dict.title}</h2>
          <p className="text-lg text-gray-600">{dict.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {dict.testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-lg"
            >
              <blockquote className="mb-4 text-gray-700">
                {testimonial.text}
              </blockquote>
              <cite className="block text-right font-medium text-gray-900">
                - {testimonial.author}
              </cite>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
