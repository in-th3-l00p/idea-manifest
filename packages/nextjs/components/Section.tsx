"use client";

import type { ReactNode } from "react";

type SectionProps = {
  title: string;
  subtitle?: string;
  className?: string;
  children: ReactNode;
};

export const Section = ({ title, subtitle, className, children }: SectionProps) => {
  return (
    <section className={`w-full space-y-4 ${className ?? ""}`}>
      <div>
        <h2 className="text-2xl font-semibold m-0!">{title}</h2>
        {subtitle ? (
          <p className="text-sm text-white/60 m-0! ">{subtitle}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
};

export default Section;


