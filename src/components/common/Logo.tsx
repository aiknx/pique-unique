import Image from 'next/image';
import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <Image
        src="/images/logo.png"
        alt="Pique Unique"
        width={40}
        height={40}
        className="w-10 h-10"
      />
      <span className="text-xl font-semibold text-primary">Pique Unique</span>
    </Link>
  );
} 