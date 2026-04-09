import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";

export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-3xl">
      {eyebrow ? (
        <p className="mb-3 text-[11px] font-black uppercase tracking-[4px] text-secondary">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-heading text-3xl font-bold leading-tight md:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-sm font-medium leading-7 text-muted md:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
  ctaHref = "/shop",
  ctaLabel = "Explore Menu",
  image,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  ctaHref?: string;
  ctaLabel?: string;
  image: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-[#07170f] text-white">
      <div className="absolute inset-0">
        <img src={image} alt="" className="h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/25" />
      </div>
      <div className="relative mx-auto grid min-h-[62vh] max-w-7xl items-center gap-10 px-[5%] py-20 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          {eyebrow ? (
            <p className="mb-5 text-[11px] font-black uppercase tracking-[5px] text-secondary">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="max-w-3xl font-heading text-5xl font-bold leading-[0.95] tracking-tight md:text-6xl lg:text-7xl">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-base font-medium leading-8 text-white/78 md:text-lg">
            {description}
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href={ctaHref}
              className="inline-flex h-12 items-center rounded-full bg-secondary px-6 text-[13px] font-black uppercase tracking-[2px] text-black transition hover:opacity-90"
            >
              {ctaLabel}
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-12 items-center rounded-full border border-white/20 px-6 text-[13px] font-black uppercase tracking-[2px] text-white transition hover:bg-white/10"
            >
              Talk to us
            </Link>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative hidden lg:block"
        >
          <div className="rounded-[32px] border border-white/10 bg-white/10 p-4 backdrop-blur-xl">
            <img src={image} alt="" className="h-[420px] w-full rounded-[24px] object-cover" />
          </div>
          <div className="absolute -bottom-8 -left-8 rounded-[24px] bg-secondary px-5 py-4 text-black shadow-2xl">
            <div className="flex items-center gap-3">
              <Sparkles size={18} />
              <span className="text-[11px] font-black uppercase tracking-[3px]">
                Crafted daily
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function ProductPill({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-[24px] border border-border bg-surface p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="font-heading text-2xl font-bold leading-tight">{title}</h3>
          <p className="mt-2 text-sm font-medium leading-6 text-muted">{description}</p>
        </div>
        <ArrowRight className="text-secondary transition group-hover:translate-x-1" size={18} />
      </div>
    </Link>
  );
}
