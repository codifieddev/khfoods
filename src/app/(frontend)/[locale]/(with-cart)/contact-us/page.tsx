"use client";

import React from "react";
import Image from "next/image";
import { Montserrat } from "next/font/google";
import { Phone, Mail, MapPin, Smartphone } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@radix-ui/react-select";
// import { Separator } from "@/components/ui/separator";f

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function page() {
  return (
    <div className={montserrat.className}>
      {/* HERO (your existing section kept) */}
      <section className="relative w-full">
        <div
          className="relative min-h-[80vh] md:h-[90vh] w-full overflow-hidden pt-24 md:pt-20"
          style={{
            backgroundImage:
              "url(https://khfood.com/wp-content/uploads/2019/11/Screen-Shot-2019-08-17-at-4.05.34-PM@1X.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(255,209,0,0.18),transparent_40%)]" />

          <div className="relative z-10 mx-auto grid h-full max-w-7xl items-center gap-12 px-5 sm:px-6 lg:grid-cols-2">
            <div className="mx-auto max-w-xl text-center lg:mx-0 lg:text-left">
              <p className="text-start text-sm uppercase tracking-[0.2em] text-white/80">
                HOME · Contact us
              </p>

              <h1 className="mt-4 text-start text-5xl font-medium leading-[1] tracking-tight text-white sm:text-5xl md:text-[100px]">
                Contact us
                
              </h1>

              <p className="mt-5 text-start text-sm leading-relaxed text-white/85 sm:text-base md:text-lg">
                A history of movement – The Eagle and Vector names are steeped in
                sporting pedigree, the Goodyear range of Road tires come with the
                technology and wealth of experience no other tire can match.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center rounded-full bg-[#FFD100] px-6 py-3 text-sm font-semibold text-black transition hover:brightness-95"
                >
                  Contact Us
                </a>

                <a
                  href="#map"
                  className="inline-flex items-center justify-center rounded-full border border-white/35 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                >
                  View Map
                </a>
              </div>

              <div className="mt-8 grid max-w-md grid-cols-2 gap-4 sm:grid-cols-3 lg:mx-0">
                {[
                  ["Support", "Fast Response"],
                  ["Quality", "Trusted Service"],
                  ["Care", "Always Helpful"],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 backdrop-blur"
                  >
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/70">
                      {k}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-white">{v}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="relative h-[520px] w-full overflow-hidden rounded-[28px] border border-white/15 bg-white/5 shadow-[0_30px_120px_rgba(0,0,0,0.45)]">
                <img
                  src="https://khfood.com/wp-content/uploads/2019/11/Screen-Shot-2019-07-16-at-1.11.14-PM@1X.png"
                  alt="Road ride"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

                <div className="absolute bottom-6 left-6 right-6">
                  <div className="rounded-2xl border border-white/15 bg-black/35 px-5 py-4 backdrop-blur">
                    <p className="text-lg font-semibold text-white">
                      “Confidence at speed — built for riders who push.”
                    </p>
                    <p className="mt-1 text-sm tracking-wide text-white/70">
                      Road range overview · Goodyear Bicycle Tires
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-white" />
        </div>
      </section>

      {/* CONTACT + DETAILS + FULL MAP */}
      <section id="contact" className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 md:py-20">
          <div className="grid gap-10 lg:grid-cols-12">
            {/* LEFT: Details (from your screenshot content) */}
            <div className="lg:col-span-5">
              <Card className="rounded-none border bg-[#7b7b7b] p-8 text-white shadow-sm">
                <h2 className="text-2xl font-semibold">Contact Details</h2>
                <p className="mt-2 text-sm text-white/80">
                  Reach us using the details below or submit the form.
                </p>

                <Separator className="my-6 bg-white/15" />

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
                  <DetailItem
                    icon={<MapPin className="h-5 w-5" />}
                    title="ADDRESS"
                    value={
                      <>
                        585 Yorbita Rd.
                        <br />
                        La Puente, CA 91744
                      </>
                    }
                  />

                  <DetailItem
                    icon={<Phone className="h-5 w-5" />}
                    title="TELEPHONE"
                    value="(714) 639 - 1201"
                  />

                  <DetailItem
                    icon={<Smartphone className="h-5 w-5" />}
                    title="FAX"
                    value="(714) 639 - 1211"
                  />

                  <DetailItem
                    icon={<Mail className="h-5 w-5" />}
                    title="EMAIL ADDRESS"
                    value="contact@khfood.com"
                  />
                </div>
              </Card>
            </div>

            {/* RIGHT: Form */}
            <div className="lg:col-span-7">
              <Card className="rounded-none border bg-[#e6b27f] p-8 shadow-sm">
                <h2 className="text-3xl font-semibold text-black/85">
                  Write us and we will get back to you.
                </h2>

                <form className="mt-8 space-y-5">
                  <Field label="Your name">
                    <Input
                      placeholder="Your Name"
                      className="h-12 rounded-none border-black/15 bg-white focus-visible:ring-0"
                    />
                  </Field>

                  <Field label="Contact Number">
                    <Input
                      placeholder="Mobile Number"
                      className="h-12 rounded-none border-black/15 bg-white focus-visible:ring-0"
                    />
                  </Field>

                  <Field label="Your email">
                    <Input
                      type="email"
                      placeholder="Your Email"
                      className="h-12 rounded-none border-black/15 bg-white focus-visible:ring-0"
                    />
                  </Field>

                  <Field label="Subject">
                    <Input
                      placeholder="Subject"
                      className="h-12 rounded-none border-black/15 bg-white focus-visible:ring-0"
                    />
                  </Field>

                  <Field label="Your message (optional)">
                    <Textarea
                      placeholder="Type your message..."
                      className="min-h-[180px] rounded-none border-black/15 bg-white focus-visible:ring-0"
                    />
                  </Field>

                  <Button
                    type="button"
                    className="h-11 rounded-none bg-black px-8 font-semibold text-white hover:bg-black/90"
                  >
                    Submit
                  </Button>
                </form>
              </Card>
            </div>
          </div>
          </div>
          </section>

          {/* FULL MAP */}
          <div id="map" className="mt-10 overflow-hidden rounded-none border bg-[#f6f7f8] shadow-sm">
            {/* Replace src with your exact Google Maps embed if needed */}
            <iframe
              title="Map"
              className="h-[420px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps?q=585%20Yorbita%20Rd,%20La%20Puente,%20CA%2091744&output=embed"
            />
          </div>
        </div>
      
   
  );
}

/* ----------------------- small components ----------------------- */

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-black/80">{label}</div>
      {children}
    </div>
  );
}

function DetailItem({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/15">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-sm font-semibold tracking-[0.18em] text-white/90">
          {title}
        </div>
        <div className="mt-2 text-sm leading-relaxed text-white/80">{value}</div>
      </div>
    </div>
  );
}
