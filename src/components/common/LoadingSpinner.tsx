import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  message?: string;
}

export default function LoadingSpinner({ 
  size = 'md', 
  className,
  message = 'Kraunama...'
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-32 w-32'
  };

  return (
    <div className={cn(
      'flex flex-col items-center justify-center min-h-[200px]',
      className
    )}>
      <div className={cn(
        'animate-spin rounded-full border-t-2 border-b-2 border-hunter',
        sizeClasses[size]
      )} />
      {message && (
        <p className="mt-4 text-gray-600 text-sm">{message}</p>
      )}
    </div>
  );
} 