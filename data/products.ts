export interface Product {
  id: number | string;
  title: string;
  price: string;
  category: string;
  rating: number;
  reviews: number;
  badge: string;
  description: string;
  img: string;
  specs?: { label: string; value: string }[];
}

export const products: Product[] = [
  {
    id: "signature-chicken-biryani",
    title: "Signature Chicken Biryani",
    price: "Rs349",
    category: "Main Course",
    rating: 5.0,
    reviews: 124,
    badge: "Bestseller",
    description:
      "A fragrant biryani layered with premium spices and tender chicken.",
    img: "https://images.unsplash.com/photo-1589308078059-be1415eab4c5?auto=format&fit=crop&q=80&w=1400",
    specs: [
      { label: "Portion", value: "Half / Full" },
      { label: "Spice", value: "Customisable" },
      { label: "Style", value: "House Special" },
    ],
  },
  {
    id: "paneer-tikka-wrap",
    title: "Paneer Tikka Wrap",
    price: "Rs179",
    category: "Snacks",
    rating: 4.9,
    reviews: 86,
    badge: "New",
    description:
      "Grilled paneer, crisp vegetables, and mint chutney rolled in a warm wrap.",
    img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=1400",
  },
  {
    id: "masala-lemon-soda",
    title: "Masala Lemon Soda",
    price: "Rs79",
    category: "Beverages",
    rating: 4.8,
    reviews: 52,
    badge: "Classic",
    description:
      "A refreshing citrus drink balanced with roasted cumin and black salt.",
    img: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=1400",
  },
  {
    id: "street-snack-platter",
    title: "Street Snack Platter",
    price: "Rs249",
    category: "Starters",
    rating: 5.0,
    reviews: 45,
    badge: "Top Rated",
    description:
      "A mix of crispy bites, chutneys, and toppings for easy sharing.",
    img: "https://images.unsplash.com/photo-1601050690117-94f5f6fa6f1c?auto=format&fit=crop&q=80&w=1400",
  },
  {
    id: "gulab-jamun-box",
    title: "Gulab Jamun Box",
    price: "Rs129",
    category: "Desserts",
    rating: 4.7,
    reviews: 210,
    badge: "Limited",
    description:
      "Soft, syrup-soaked sweets served warm for a classic finish to any meal.",
    img: "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&q=80&w=1400",
  },
  {
    id: "tandoori-broccoli-bites",
    title: "Tandoori Broccoli Bites",
    price: "Rs199",
    category: "Starters",
    rating: 4.9,
    reviews: 38,
    badge: "Essential",
    description: "Charred broccoli bites finished with a tangy herb drizzle.",
    img: "https://images.unsplash.com/photo-1625943553852-781c6dd46faa?auto=format&fit=crop&q=80&w=1400",
  },
  {
    id: "malai-kofta-thali",
    title: "Malai Kofta Thali",
    price: "Rs399",
    category: "Main Course",
    rating: 4.9,
    reviews: 42,
    badge: "Premium",
    description:
      "A comforting thali featuring rich curry, breads, and accompaniments.",
    img: "https://images.unsplash.com/photo-1601050690294-6f4d1d2b6a4f?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: "cold-coffee",
    title: "Cold Coffee",
    price: "Rs109",
    category: "Beverages",
    rating: 4.4,
    reviews: 28,
    badge: "Essential",
    description:
      "A chilled, creamy coffee blended for an easy midday refresh.",
    img: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&q=80&w=1200",
  },
];

export interface Category {
  id: string;
  name: string;
  description: string;
  img: string;
}

export const categories: Category[] = [
  {
    id: "starters",
    name: "Starters",
    description: "Crisp snacks and sharing platters to kick things off.",
    img: "https://images.unsplash.com/photo-1601050690117-94f5f6fa6f1c?auto=format&fit=crop&q=80&w=2000",
  },
  {
    id: "main-course",
    name: "Main Course",
    description: "Biryani, curries, rice bowls, and thalis for a full meal.",
    img: "https://images.unsplash.com/photo-1589308078059-be1415eab4c5?auto=format&fit=crop&q=80&w=2000",
  },
  {
    id: "desserts",
    name: "Desserts",
    description: "Classic sweets and cool treats for the final course.",
    img: "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&q=80&w=2000",
  },
  {
    id: "beverages",
    name: "Beverages",
    description: "Fresh juices, sodas, lassi, tea, and coffee.",
    img: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=2000",
  },
  {
    id: "combos",
    name: "Combos",
    description: "Ready-to-order meal sets designed for convenience and value.",
    img: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=2000",
  },
  {
    id: "specials",
    name: "Specials",
    description: "Chef-curated items rotated regularly for the season.",
    img: "https://images.unsplash.com/photo-1601050690294-6f4d1d2b6a4f?auto=format&fit=crop&q=80&w=2000",
  },
];
