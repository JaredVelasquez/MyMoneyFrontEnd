interface SectionTitleProps {
  title: string;
  subtitle?: string;
}

const SectionTitle = ({ title, subtitle }: SectionTitleProps) => {
  return (
    <div className="text-center mb-8">
      <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionTitle; 