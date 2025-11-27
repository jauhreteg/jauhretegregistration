import Image from "next/image";
import { activeConfig } from "@/config/website";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showLogo?: boolean;
}

export function PageHeader({
  title,
  subtitle,
  showLogo = true,
}: PageHeaderProps) {
  return (
    <div className="flex items-center gap-6 mb-8">
      {showLogo && (
        <Image
          src="/jet-black.svg"
          alt="Jauhr E Teg Logo"
          width={80}
          height={80}
          className={`w-16 h-16 md:w-20 md:h-20 object-contain ${
            false && activeConfig.effects.enableLogoInversion ? "invert" : ""
          }`}
        />
      )}
      <div>
        <h1
          className={`text-2xl md:text-3xl font-bold uppercase font-montserrat ${"text-gray-900"}`}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className={`text-sm md:text-base font-montserrat ${"text-gray-600"}`}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
