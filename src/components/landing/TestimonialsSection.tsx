import TestimonialCard from '../ui/TestimonialCard';

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: '1',
      quote: 'Esta aplicación ha cambiado completamente la forma en que manejo mi dinero. Ahora tengo claridad sobre mis finanzas.',
      authorName: 'María Rodríguez',
      authorRole: 'Diseñadora gráfica',
      authorInitials: 'MR'
    },
    {
      id: '2',
      quote: 'Los reportes visuales me ayudan a identificar fácilmente en qué estoy gastando demasiado. He logrado ahorrar un 20% más.',
      authorName: 'Juan Pérez',
      authorRole: 'Ingeniero de software',
      authorInitials: 'JP'
    },
    {
      id: '3',
      quote: 'Interface sencilla y potente. Me encanta poder acceder desde cualquier dispositivo. Muy recomendable.',
      authorName: 'Carolina López',
      authorRole: 'Contadora',
      authorInitials: 'CL'
    }
  ];

  return (
    <div className="bg-blue-700 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl animate-pulse-slow">
            Lo que dicen nuestros usuarios
          </h2>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              quote={testimonial.quote}
              authorName={testimonial.authorName}
              authorRole={testimonial.authorRole}
              authorInitials={testimonial.authorInitials}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection; 