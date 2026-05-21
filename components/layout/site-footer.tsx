import Link from "next/link";

const sections = [
  { title: "Company", links: [["About", "/about"], ["Careers", "/careers"], ["Contact", "/contact"], ["Blog", "/blog"]] },
  { title: "Platform", links: [["Login", "/login"], ["Profile", "/profile"]] },
  { title: "Legal", links: [["Privacy", "/privacy-policy"], ["Terms", "/terms-and-conditions"], ["Disclaimer", "/disclaimer"]] },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#070a12]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_2fr]">
        <div>
          <div className="mb-5 text-2xl font-black uppercase">Global Insight</div>
          <p className="max-w-md text-sm leading-7 text-white/55">
            Independent global coverage on politics, technology, markets, culture, and power. Built for readers who want signal, context, and calm clarity.
          </p>
          <div className="mt-6 rounded border border-dashed border-white/15 p-4 text-xs uppercase tracking-[0.22em] text-white/40">
            Ad placement ready
          </div>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-white/45">{section.title}</h3>
              <div className="grid gap-3 text-sm text-white/65">
                {section.links.map(([label, href]) => (
                  <Link key={label} href={href} className="transition hover:text-white">
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-6 text-center text-xs uppercase tracking-[0.22em] text-white/35">
        © 2026 Global Insight. All rights reserved.
      </div>
    </footer>
  );
}
