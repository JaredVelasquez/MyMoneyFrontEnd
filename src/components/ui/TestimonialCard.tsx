interface TestimonialCardProps {
  quote: string;
  authorInitials: string;
  authorName: string;
  authorRole: string;
}

const TestimonialCard = ({ 
  quote, 
  authorInitials, 
  authorName, 
  authorRole 
}: TestimonialCardProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg transition-transform duration-300 hover:scale-102">
      <p className="text-gray-600 mb-4">
        "{quote}"
      </p>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className="h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-medium">
            {authorInitials}
          </div>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-gray-900">{authorName}</h3>
          <p className="text-sm text-gray-500">{authorRole}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard; 