import ThemeSelector from '@/components/themes/ThemeSelector';

export default function ThemesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Our Picnic Themes</h1>
          <p className="text-lg text-gray-600">
            Choose from our carefully curated selection of picnic experiences
          </p>
        </div>
        
        <ThemeSelector />
      </div>
    </div>
  );
} 