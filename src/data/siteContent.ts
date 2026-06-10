export type NavItem = {
  label: string;
  href: string;
};

export type OpeningHour = {
  day: string;
  time: string;
};

export type MenuGroup = {
  title: string;
  items: string[];
  note: string;
};

export type MenuPhotoFeature = {
  src: string;
  alt: string;
  label: string;
  note: string;
};

export type GalleryItem = {
  src: string;
  alt: string;
  label: string;
};

export const imagePath = (fileName: string) => `${import.meta.env.BASE_URL}images/${fileName}`;

export const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Menu", href: "/menu" },
  { label: "About", href: "/about" },
  { label: "Visit", href: "/visit" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" }
];

export const business = {
  name: "RYCO Coffee House",
  shortName: "RYCO",
  address: "30 Killyman St, Moy, Dungannon BT71 7SJ",
  phoneDisplay: "07749 175885",
  phoneHref: "tel:+447749175885",
  mapsHref:
    "https://www.google.com/maps/search/?api=1&query=RYCO%20Coffee%20House%2030%20Killyman%20St%20Moy%20Dungannon%20BT71%207SJ",
  instagramHref: "https://www.instagram.com/ryco_coffee_house/?hl=en",
  facebookHref: "https://www.facebook.com/rycocoffeehouse/?locale=en_GB"
};

export const openingHours: OpeningHour[] = [
  { day: "Monday", time: "9am-4:30pm" },
  { day: "Tuesday", time: "Closed" },
  { day: "Wednesday", time: "9am-4:30pm" },
  { day: "Thursday", time: "9am-4:30pm" },
  { day: "Friday", time: "9am-4:30pm" },
  { day: "Saturday", time: "8am-4pm" },
  { day: "Sunday", time: "9am-3pm" }
];

export const menuGroups: MenuGroup[] = [
  {
    title: "Coffee",
    items: ["Espresso", "Latte", "Cortado", "Flat white", "Iced coffee"],
    note: "Freshly made for sit-in, takeaway, and the morning coffee run."
  },
  {
    title: "Acai bowls",
    items: ["Fruit", "Coconut", "Granola", "Nut toppings", "Chocolate pieces"],
    note: "Fruit, granola, coconut and richer toppings layered into a bright breakfast bowl."
  },
  {
    title: "Smoothies",
    items: ["Fruit blends", "Cold refreshers", "Seasonal specials"],
    note: "Cold fruit blends for a lighter stop on Killyman Street."
  },
  {
    title: "Traybakes",
    items: ["Cookie pie", "Brownies", "Weekly counter bakes"],
    note: "Counter treats for coffee breaks and takeaway orders."
  },
  {
    title: "Toasties",
    items: ["Hot sandwiches", "Lunch options", "Takeaway-friendly"],
    note: "Hot lunch staples served through the day."
  },
  {
    title: "Overnight oats",
    items: ["Granola pots", "Breakfast pots", "Fruit toppings"],
    note: "Ready-to-go breakfast pots with granola, fruit and easy takeaway portions."
  }
];

export const menuPhotoFeatures: MenuPhotoFeature[] = [
  {
    src: imagePath("ryco-restaurantji-photo-mobile.jpg"),
    alt: "Acai bowl and coffee at Ryco Coffee House",
    label: "Bowls / coffee",
    note: "Fruit bowls, cold drinks and coffee for sit-in mornings or a quick takeaway stop."
  },
  {
    src: imagePath("ryco-restaurantguru-photo.jpg"),
    alt: "RYCO storefront and cafe entrance in Moy",
    label: "Killyman Street",
    note: "The blue storefront marks Ryco's coffee counter in the centre of Moy."
  }
];

export const galleryItems: GalleryItem[] = [
  {
    src: imagePath("ryco-restaurantguru-photo.jpg"),
    alt: "RYCO Coffee House blue storefront on Killyman Street in Moy",
    label: "30 Killyman Street"
  },
  {
    src: imagePath("ryco-restaurantji-photo-mobile.jpg"),
    alt: "RYCO collage with acai bowl, storefront, and coffee",
    label: "Coffee / Acai / Moy"
  },
  {
    src: imagePath("ryco-restaurantji-photo.jpg"),
    alt: "RYCO wide collage with acai bowl, latte, and cafe exterior",
    label: "House favourites"
  }
];

export const sourceNotes = [
  "Facebook and Instagram public profiles",
  "Restaurant Guru menu listing",
  "Restaurantji listing imagery"
];
