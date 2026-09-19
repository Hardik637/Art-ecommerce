import Link from 'next/link';
import { Compass, ArrowRight, ShieldCheck } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="bg-[#F4EFE7] min-h-[80vh] flex flex-col items-center justify-center px-6 py-24 text-center">
      <div className="max-w-xl space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#11100F] text-[#B08A4A] flex items-center justify-center mx-auto shadow-md">
          <Compass size={28} />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#B08A4A]">
            Catalog Index Error 404
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-light text-[#11100F]">
            This Gallery Wing is Uncataloged
          </h1>
        </div>

        <p className="text-xs md:text-sm text-[#666] font-sans max-w-md mx-auto leading-relaxed">
          The artwork, exhibition, or archive record you are searching for does not reside in the current Atelier registry — or it has been retired into a private collection.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#11100F] text-[#F4EFE7] hover:bg-[#B08A4A] transition-colors text-xs uppercase tracking-widest font-sans font-medium"
          >
            Return to Grand Salon
          </Link>
          <Link
            href="/products"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl border border-[#E4DBCF] bg-[#FAF8F5] text-[#11100F] hover:border-[#11100F] transition-colors text-xs uppercase tracking-widest font-sans font-medium flex items-center justify-center gap-1.5"
          >
            Explore Catalog <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}
