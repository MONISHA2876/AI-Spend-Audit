"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/constants/constants";

export default function Header() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;
  return (
    <header className="sticky top-0 z-50 w-full h-17.5 bg-gray-900">
      <div className="container flex justify-between items-center px-6 py-4 text-gray-500">
        <Link
          className="flex flex-row text-slate-100 font-bold text-2xl gap-3.5 align-bottom justify-baseline items-baseline"
          href="/"
        >
          <Image
            src="/logo.png"
            alt="Logo"
            height={32}
            width={32}
            className="h-8 w-auto cursor-pointer"
          />
          AI Spend Audit
        </Link>
        <nav className="hidden sm:inline-block">
          {NAV_ITEMS.map((item) => (
            <>
              <Link
                href={item.href}
                className={`w-full hover:text-yellow-500 mx-5 transition-colors ${
                  isActive(item.href) ? "text-gray-100" : ""
                }`}
              >
                {item.label}
              </Link>
            </>
          ))}
        </nav>
        <Link href="/contact">
          <button
            className="px-4 py-2
                rounded-xl
                bg-white/10
                border border-white/10
            text-sm font-medium text-gray-200
            backdrop-blur-md
            hover:bg-yellow-500/40
            hover:text-white
            transition-all duration-300
            shadow-lg"
          >
            Get In Touch
          </button>
        </Link>
      </div>
    </header>
  );
}
