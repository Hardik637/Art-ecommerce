import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="bg-white min-h-[75vh] flex flex-col items-center justify-center px-6 py-24 text-center text-black">
      <div className="max-w-md space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-400">
            404 Error
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-black">
            Page Not Found
          </h1>
        </div>

        <p className="text-xs md:text-sm text-neutral-500 leading-relaxed">
          The product or page you are looking for does not exist, has been removed, or is temporarily unavailable.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3.5 rounded-lg bg-black text-white hover:bg-neutral-800 transition-colors text-xs uppercase tracking-wider font-semibold"
          >
            Back to Home
          </Link>
          <Link
            href="/products"
            className="w-full sm:w-auto px-6 py-3.5 rounded-lg border border-neutral-300 bg-white text-black hover:border-black transition-colors text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-1.5"
          >
            Browse Catalog <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
