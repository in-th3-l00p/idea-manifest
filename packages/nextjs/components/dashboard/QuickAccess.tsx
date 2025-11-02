"use client";

import Link from "next/link";
import type { ReactNode } from "react";

export type QuickAccessItem = {
  key: string;
  label: string;
  icon: ReactNode;
  href?: string;
  onClick?: () => void;
};

export const QuickAccess = ({ items, className }: { items: QuickAccessItem[]; className?: string }) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-3 md:grid-cols-6 gap-2 ${className ?? ""}`}>
      {items.map(item => {
        const content = (
          <div className="bg-zinc-800 rounded-md py-6 flex flex-col gap-4 items-center justify-center border border-zinc-700 duration-300">
            {item.icon}
            <span className="text-sm">{item.label}</span>
          </div>
        );
        if (item.href) {
          return (
            <Link key={item.key} href={item.href} className="contents">
              {content}
            </Link>
          );
        }
        return (
          <button key={item.key} type="button" onClick={item.onClick} className="contents">
            {content}
          </button>
        );
      })}
    </div>
  );
};

export default QuickAccess;


