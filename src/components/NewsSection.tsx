"use client";

export default function NewsSection() {
  return (
    <section className="w-full py-12 px-4 sm:py-16 sm:px-6 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs tracking-[0.18em] uppercase text-gray-500">
              News & Insights
            </p>
            <h2 className="mt-1 text-2xl font-semibold uppercase leading-tight sm:text-[36px] md:text-[42px]">
              Discover The World Of Premium Peanuts.
            </h2>
          </div>

          <button className="inline-flex self-start items-center gap-2 bg-[#eaba88] px-4 py-2 text-sm font-semibold uppercase transition hover:opacity-80 sm:self-auto">
            View All <span aria-hidden="true">→</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div>
            <div className="relative h-[260px] overflow-hidden rounded-2xl shadow-sm sm:h-[360px] md:h-[420px] lg:h-[480px]">
              <img
                src="https://khfood.com/wp-content/uploads/2019/10/About-Us-Photo-1.png"
                alt="Peanut Roasting Process"
                className="h-full w-full object-cover"
              />

              <span className="absolute bottom-28 left-4 rounded-full bg-white px-3 py-1 text-xs font-medium uppercase text-gray-700 shadow sm:left-6">
                Processing
              </span>

              <div className="absolute bottom-4 left-4 right-4 text-white sm:bottom-5 sm:left-6">
                <h3 className="max-w-xl text-lg font-semibold leading-tight sm:text-xl">
                  The Art of the Perfect Roast // Our Legacy
                </h3>
                <p className="mt-1 line-clamp-2 text-xs opacity-90 sm:text-sm">
                  We take a behind-the-scenes look at how we select the finest California peanuts and roast them to perfection for that signature KH Food crunch...
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            {[
              {
                img: "https://khfood.com/wp-content/uploads/2016/08/khfood_blog2_1-1.jpg",
                title: "The Surprising Health Benefits of Peanuts",
                desc: "Rich in protein and heart-health fats, discover why adding premium roasted peanuts to your daily diet is a smart choice for your lifestyle...",
              },
              {
                img: "https://khfood.com/wp-content/uploads/2016/08/peanuts_blog_4-1.jpg",
                title: "KH Food Expands Wholesale Distribution Network",
                desc: "We are proud to announce new partnerships that bring our premium roasted peanuts to more retailers and businesses across the country...",
              },
              {
                img: "https://khfood.com/wp-content/uploads/2019/12/Image-1.jpg",
                title: "Perfect Gifting: Why Our Gift Boxes Are Best Sellers",
                desc: "From corporate events to family gatherings, find out why our complimentary peanut gift boxes are the perfect way to share the joy...",
              },
            ].map((item, index) => (
              <div key={index} className="flex flex-col gap-4 sm:flex-row sm:gap-5">
                <div className="relative h-[180px] w-full flex-shrink-0 overflow-hidden rounded-xl sm:h-28 sm:w-44 md:h-32 md:w-[445px]">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div>
                  <p className="text-xs text-gray-500">BY KH FOOD TEAM • 15TH JAN 2026</p>
                  <h4 className="mt-1 text-[15px] font-medium sm:text-[16px] md:text-[16px]">
                    {item.title}
                  </h4>
                  <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
