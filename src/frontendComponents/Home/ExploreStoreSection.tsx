"use client";

export default function ExploreStoreSection() {
  return (
    <section className="w-full bg-[#f5f5f7] px-4 py-20 md:py-28">
      <div className="mx-auto max-w-5xl text-center">
        <p className="text-[11px] tracking-[0.22em] uppercase text-slate-400">
          Our Story
        </p>

        <h2 className="mt-4 text-3xl font-semibold uppercase leading-tight text-black md:text-[52px]">
          Explore Minicom Store
        </h2>

        <div className="mx-auto mt-8 max-w-5xl space-y-4 text-sm leading-7 text-slate-500 md:text-[17px]">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi quam
            risus lacus risus posuere quis hendrerit vestibulum ut sagittis sit
            amet tortor. Mauris mauris lectus, ornare vel erat non, imperdiet
            consectetur leo.
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce
            sagittis tincidunt mi at sagittis. Cras dui justo, tristique a
            posuere a, dapibus in quam. Quisque a quam euismod, interdum erat ut,
            commodo lectus.
          </p>
        </div>

        <a
          href="#shop"
          className="mt-12 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.22em] text-[#1f2c5c] transition hover:text-black"
        >
          View More
          <span aria-hidden="true">↓</span>
        </a>
      </div>
    </section>
  );
}
