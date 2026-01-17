    "use client";

    import * as React from "react";
    import {
    Search as SearchIcon,
    MapPin,
    Heart,
    Navigation2,
    ChevronDown,
    X,
    } from "lucide-react";

    import { Button } from "@/components/ui/button";
    import { Input } from "@/components/ui/input";


    import Image from "next/image";
    import { ArrowRight, Play, Sparkles, CheckCircle2 } from "lucide-react";

    // import { Button } from "@/components/ui/button";
    // import { Badge } from "@/components/ui/badge";
    // import { Input } from "@/components/ui/input";
    import { Card } from "@/components/ui/card";


    import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    } from "@/components/ui/select";
    import { Separator } from "@radix-ui/react-select";

    type Store = {
    id: string;
    name: string;
    addressLine: string;
    cityLine: string;
    km: number;
    img?: string;
    pin: { x: number; y: number }; // map position (percent)
    };

    const STORES: Store[] = [
    {
        id: "s1",
        name: "Hardware & Co",
        addressLine: "VIA TAL DEI TALI 69, 00100",
        cityLine: "ROME",
        km: 3.5,
        img: "/assets/Image/khfoodImage/Image-2.jpg", // replace if needed
        pin: { x: 18, y: 18 },
    },
    {
        id: "s2",
        name: "Store of hardware",
        addressLine: "VIA TAL DEI TALI 69, 00100",
        cityLine: "ROME",
        km: 3.5,
        img: "/assets/Image/khfoodImage/Image-2.jpg",
        pin: { x: 60, y: 16 },
    },
    {
        id: "s3",
        name: "New store",
        addressLine: "VIA TAL DEI TALI 69, 00100",
        cityLine: "ROME",
        km: 3.5,
        img: "/assets/Image/khfoodImage/Image-2.jpg",
        pin: { x: 73, y: 34 },
    },
    {
        id: "s4",
        name: "Mega hardware store",
        addressLine: "VIA TAL DEI TALI 69, 00100",
        cityLine: "ROME",
        km: 3.5,
        img: "/assets/Image/khfoodImage/Image-2.jpg",
        pin: { x: 55, y: 52 },
    },
    {
        id: "s5",
        name: "Ferramenta Store",
        addressLine: "VIA TAL DEI TALI 69, 00100",
        cityLine: "ROME",
        km: 3.5,
        img: "/assets/Image/khfoodImage/Image-2.jpg",
        pin: { x: 26, y: 70 },
    },
    {
        id: "s6",
        name: "Roman Hardware",
        addressLine: "VIA TAL DEI TALI 69, 00100",
        cityLine: "ROME",
        km: 3.5,
        img: "/assets/Image/khfoodImage/Image-2.jpg",
        pin: { x: 86, y: 78 },
    },
    ];

    function formatKm(v: number) {
    // show like screenshot: 3,5 KM
    const s = v.toFixed(1).replace(".", ",");
    return `${s} KM`;
    }

    export default function Page() {
    const [query, setQuery] = React.useState(
        "Via Talenti, 358, 00100, Rome, RM, Italy"
    );
    const [city, setCity] = React.useState("Rome, RM, Italy");
    const [distance, setDistance] = React.useState("distance");
    const [activeId, setActiveId] = React.useState<string>("s1");
    const [favorites, setFavorites] = React.useState<Record<string, boolean>>({
        s1: false,
        s2: false,
        s3: false,
        s4: false,
        s5: false,
        s6: false,
    });
    const [searchText, setSearchText] = React.useState("");

    const activeStore = React.useMemo(
        () => STORES.find((s) => s.id === activeId) || STORES[0],
        [activeId]
    );

    const filteredStores = React.useMemo(() => {
        const q = searchText.trim().toLowerCase();
        if (!q) return STORES;
        return STORES.filter(
        (s) =>
            s.name.toLowerCase().includes(q) ||
            s.addressLine.toLowerCase().includes(q) ||
            s.cityLine.toLowerCase().includes(q)
        );
    }, [searchText]);

    const toggleFav = (id: string) =>
        setFavorites((p) => ({ ...p, [id]: !p[id] }));

    const openDirections = (store: Store) => {
        const full = `${store.name}, ${store.addressLine}, ${store.cityLine}`;
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        full
        )}`;
        window.open(url, "_blank", "noopener,noreferrer");
    };

    const onSearch = () => {
        // "working" demo: search inside list by query+city
        const combined = `${query} ${city}`.trim();
        setSearchText(combined);
    };

    return (
        <>

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
            {/* overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/10" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(255,209,0,0.18),transparent_40%)]" />

            <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 h-full grid lg:grid-cols-2 gap-12 items-center">
            {/* LEFT CONTENT */}
            <div className="max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
                <p className="text-white/80 text-sm tracking-[0.2em] uppercase text-start">
                HOME · STORE LOCATOR 
                </p>

                <h1 className="mt-4 text-white font-medium tracking-tight leading-[1] text-5xl text-start sm:text-5xl md:text-[100px]">
                STORE
                <span className="block text-white/90 font-black text-3xl sm:text-4xl md:text-5xl font-bold mt-2">
                    LOCATOR
                </span>
                </h1>

                <p className="mt-5 text-white/85 leading-relaxed text-sm sm:text-base md:text-lg text-start">
                A history of movement – The Eagle and Vector names are steeped in
                sporting pedigree, the Goodyear range of Road tires come with the
                technology and wealth of experience no other tire can match.
                </p>

                {/* buttons */}
                <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:justify-center lg:justify-start">
                <a
                    href="#browse"
                    className="inline-flex items-center justify-center rounded-full bg-[#FFD100] px-6 py-3 text-sm font-semibold text-black hover:brightness-95 transition"
                >
                    Browse Road Tires
                </a>

                <a
                    href="#modelmap"
                    className="inline-flex items-center justify-center rounded-full border border-white/35 bg-white/10 px-6 py-3 text-sm font-semibold text-white hover:bg-white/15 transition"
                >
                    Model Map
                </a>
                </div>

                {/* stats */}
                <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
                {[
                    ["Rolling", "Fast & Efficient"],
                    ["Grip", "Wet + Dry"],
                    ["Protection", "Race Ready"],
                ].map(([k, v]) => (
                    <div
                    key={k}
                    className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 backdrop-blur"
                    >
                    <p className="text-white/70 text-[10px] tracking-[0.2em] uppercase">
                        {k}
                    </p>
                    <p className="mt-2 text-white font-semibold text-sm">{v}</p>
                    </div>
                ))}
                </div>
            </div>

            {/* RIGHT IMAGE (DESKTOP ONLY) */}
            <div className="hidden lg:block">
                <div className="relative h-[520px] w-full rounded-[28px] overflow-hidden border border-white/15 bg-white/5 shadow-[0_30px_120px_rgba(0,0,0,0.45)]">
                <img
                    src="https://khfood.com/wp-content/uploads/2019/11/Screen-Shot-2019-07-16-at-1.11.14-PM@1X.png"
                    alt="Road ride"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

                <div className="absolute bottom-6 left-6 right-6">
                    <div className="rounded-2xl bg-black/35 border border-white/15 backdrop-blur px-5 py-4">
                    <p className="text-white text-lg font-semibold">
                        “Confidence at speed — built for riders who push.”
                    </p>
                    <p className="mt-1 text-white/70 text-sm tracking-wide">
                        Road range overview · Goodyear Bicycle Tires
                    </p>
                    </div>
                </div>
                </div>
            </div>
            </div>

            {/* bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-white" />
        </div>
          </section>
        
        <div className="min-h-screen w-full relative overflow-hidden py-10">
        {/* Background soft shapes (like image) */}
        <div className="pointer-events-none absolute -top-40 -left-40 h-[560px] w-[560px] rounded-full bg-white/12 blur-3xl" />
        <div className="pointer-events-none absolute top-0 right-[-240px] h-[560px] w-[560px] rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-280px] left-1/2 h-[620px] w-[620px] -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 py-10">
            {/* Main card */}
            <div className="rounded-[30px] bg-white shadow-[0_30px_90px_rgba(0,0,0,0.25)] p-8 md:p-10">
            {/* Title row */}
            {/* <div className="flex items-center justify-between">
                <h1 className="text-[34px] leading-none font-semibold tracking-tight text-[#0B77C8]">
                Store locator
                </h1>

                <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full border border-black/10 hover:bg-black/[0.03]"
                onClick={() => setSearchText("")}
                aria-label="Clear filters"
                title="Clear filters"
                >
                {searchText ? (
                    <X className="h-5 w-5 text-black/70" />
                ) : (
                    <SearchIcon className="h-5 w-5 text-black/70" />
                )}
                </Button>
            </div> */}

            {/* Filters row */}
            <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-12">
                {/* Long input */}
                <div className="lg:col-span-7">
                <div className="relative">
                    <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="h-12 rounded-full border-0 bg-black/[0.03] px-5 text-sm text-black/75 focus-visible:ring-0"
                    placeholder="Enter address..."
                    />
                </div>
                </div>

                {/* Right group */}
                <div className="lg:col-span-5 flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex-1 h-12 rounded-full bg-black/[0.03] px-4 flex items-center gap-3">
                    <Input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="h-10 border-0 bg-transparent px-2 text-sm text-black/75 focus-visible:ring-0"
                    placeholder="City..."
                    />

                    <Separator  className="h-6 bg-black/10" />

                    <div className="min-w-[150px]">
                    <Select value={distance} onValueChange={setDistance}>
                        <SelectTrigger className="h-10 w-full border-0 bg-transparent px-2 text-xs font-semibold tracking-widest text-black/70 focus:ring-0">
                        <SelectValue placeholder="DISTANCE" />
                        </SelectTrigger>
                        <SelectContent align="end">
                        <SelectItem value="distance">DISTANCE</SelectItem>
                        <SelectItem value="5">5 KM</SelectItem>
                        <SelectItem value="10">10 KM</SelectItem>
                        <SelectItem value="25">25 KM</SelectItem>
                        <SelectItem value="50">50 KM</SelectItem>
                        </SelectContent>
                    </Select>
                    </div>
                </div>

                <Button
                    onClick={onSearch}
                    className="h-12 rounded-full bg-black px-8 text-xs font-semibold tracking-widest hover:bg-black/90"
                >
                    SEARCH
                </Button>
                </div>
            </div>

            {/* Content */}
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
                {/* MAP */}
                <div className="lg:col-span-7">
                <div className="relative h-[520px] w-full rounded-3xl bg-[#f3f4f6] overflow-hidden">
                    {/* Map look background (no external map required) */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,0,0,0.06),transparent_55%),radial-gradient(circle_at_70%_55%,rgba(0,0,0,0.05),transparent_55%)]" />
                    <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(to_right,rgba(0,0,0,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.06)_1px,transparent_1px)] [background-size:44px_44px]" />

                    {/* Pins (clickable) */}
                    {filteredStores.map((s) => (
                    <button
                        key={s.id}
                        type="button"
                        onClick={() => setActiveId(s.id)}
                        className="absolute -translate-x-1/2 -translate-y-1/2"
                        style={{ left: `${s.pin.x}%`, top: `${s.pin.y}%` }}
                        aria-label={`Select ${s.name}`}
                        title={s.name}
                    >
                        <div
                        className={[
                            "h-10 w-10 rounded-full flex items-center justify-center shadow-[0_10px_25px_rgba(0,0,0,0.18)] transition",
                            s.id === activeId
                            ? "bg-[#0B77C8] ring-4 ring-[#0B77C8]/20"
                            : "bg-[#0B77C8]/95 hover:bg-[#0B77C8]",
                        ].join(" ")}
                        >
                        <MapPin className="h-5 w-5 text-white" />
                        </div>
                    </button>
                    ))}

                    {/* Big popup card (like screenshot) */}
                    <div className="absolute left-10 top-28 w-[360px] max-w-[86%] rounded-3xl bg-white shadow-[0_25px_70px_rgba(0,0,0,0.20)] overflow-hidden">
                    <div className="p-6">
                        <div className="text-[22px] font-semibold text-black/85">
                        {activeStore.name}
                        </div>
                        <div className="mt-1 text-[11px] font-semibold tracking-widest text-black/45">
                        {activeStore.addressLine} • {activeStore.cityLine}
                        </div>
                    </div>

                    <div className="px-6 pb-4">
                        <div className="h-[150px] w-full rounded-2xl overflow-hidden bg-black/[0.05] relative">
                        {/* replace with real store image */}
                        {activeStore.img ? (
                            <>
                            <img
                                src={activeStore.img}
                                alt={activeStore.name}
                                className="absolute inset-0 h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/10" />
                            </>
                        ) : (
                            <div className="h-full w-full bg-[linear-gradient(135deg,rgba(11,119,200,0.22),rgba(0,0,0,0.06))]" />
                        )}
                        </div>
                    </div>

                    <div className="px-6 pb-5 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm font-semibold text-black/70">
                        <MapPin className="h-4 w-4" />
                        {formatKm(activeStore.km)}
                        </div>

                        <Button
                        variant="outline"
                        className="h-10 rounded-full border-black/20 px-5 text-[11px] font-semibold tracking-widest text-black/70 hover:bg-black/[0.03]"
                        onClick={() => openDirections(activeStore)}
                        >
                        INDICATIONS <span className="ml-2 text-base leading-none">→</span>
                        </Button>
                    </div>
                    </div>
                </div>
                </div>

                {/* LIST */}
                <div className="lg:col-span-5">
                <div className="space-y-4">
                    {filteredStores.map((s) => (
                    <button
                        key={s.id}
                        type="button"
                        onClick={() => setActiveId(s.id)}
                        className={[
                        "w-full text-left rounded-2xl px-5 py-4 flex items-center justify-between transition",
                        "bg-black/[0.03] hover:bg-black/[0.05]",
                        s.id === activeId ? "ring-2 ring-[#0B77C8]/25" : "",
                        ].join(" ")}
                    >
                        <div className="min-w-0">
                        <div className="text-lg font-semibold text-black/85 truncate">
                            {s.name}
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-[11px] font-semibold tracking-widest text-black/45">
                            <MapPin className="h-4 w-4" />
                            <span className="truncate">
                            {s.addressLine} • {s.cityLine}
                            </span>
                        </div>
                        </div>

                        <div className="ml-4 flex items-center gap-5">
                        <div className="text-xs font-semibold text-black/65 whitespace-nowrap">
                            {formatKm(s.km)}
                        </div>

                        <button
                            type="button"
                            onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleFav(s.id);
                            }}
                            className="h-10 w-10 rounded-full bg-white border border-black/10 flex items-center justify-center hover:bg-black/[0.03] transition"
                            aria-label="Toggle favorite"
                            title="Favorite"
                        >
                            <Heart
                            className={[
                                "h-5 w-5 transition",
                                favorites[s.id]
                                ? "fill-[#0B77C8] text-[#0B77C8]"
                                : "text-black/60",
                            ].join(" ")}
                            />
                        </button>

                        <button
                            type="button"
                            onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            openDirections(s);
                            }}
                            className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-widest text-black/60 hover:text-black transition"
                            aria-label="Open directions"
                            title="Directions"
                        >
                            <Navigation2 className="h-5 w-5" />
                            INDICATIONS
                        </button>
                        </div>
                    </button>
                    ))}
                </div>

               
                </div>
            </div>

            {/* small footer spacing like screenshot */}
            <div className="mt-2" />
            </div>
        </div>
        </div>

        
        </>
    );
    }
