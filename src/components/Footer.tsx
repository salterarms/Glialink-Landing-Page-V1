import Image from "next/image";
import { FOOTER, NAV } from "@/lib/copy";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-white px-6 py-10 md:px-12 lg:px-20">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center">
        <div className="flex items-center gap-2">
          <Image
            src="/glialink-logo.png"
            alt={NAV.logoAlt}
            width={28}
            height={28}
            className="h-7 w-7"
          />
          <span className="font-[family-name:var(--font-heading)] text-base font-semibold text-ink">
            Glialink
          </span>
        </div>
        <p className="text-sm text-gray">
          {FOOTER.tagline} {FOOTER.org}.
        </p>
        <a
          href={`mailto:${FOOTER.contactEmail}`}
          className="text-sm text-purple hover:text-purple-dark transition-colors"
        >
          {FOOTER.contactEmail}
        </a>
      </div>
    </footer>
  );
}
