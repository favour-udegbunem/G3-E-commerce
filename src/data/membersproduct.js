import Balloon from "../assets/images/balloon.jpg";
import Bodyspray from "../assets/images/body spray.jpg";
import Bracelet from "../assets/images/bracelet.jpg";
import Cards from "../assets/images/cards.jpg";
import Clawclips from "../assets/images/claw clip.jpg";
import Earrings from "../assets/images/earrings.jpg";
import Facecaps from "../assets/images/facecaps.jpg";
import Fancybackpack from "../assets/images/fancy back pack.jpg";
import Flower from "../assets/images/flower.jpg";
import Hairband from "../assets/images/hair band.jpg";
import Hairbonnet from "../assets/images/hair bonnet.jpg";
import Hairbow from "../assets/images/hair bow.jpg";
import Handfan from "../assets/images/hand fan.jpg";
import Idholder from "../assets/images/id holder.jpg";
import Jotter from "../assets/images/jotter.jpg";
import Keyholder from "../assets/images/keyholder.jpg";
import Lipbalm from "../assets/images/lip balm.jpg";
import Necklace from "../assets/images/necklace.jpg";
import Nightwear from "../assets/images/nightwear.jpg";
import Pantielineup from "../assets/images/pantie lineup.jpg";
import Panties from "../assets/images/panties.jpg";
import Pen from "../assets/images/pen.jpg";
import Perfume from "../assets/images/perfume.jpg";
import Periodjournal from "../assets/images/period journal.jpg";
import Pimplepatch from "../assets/images/pimple patch.jpg";
import Purse from "../assets/images/purse.jpg";
import Rollon from "../assets/images/roll on.jpg";
import Sanitarypads from "../assets/images/sanitary pads.jpg";
import Selfiestick from "../assets/images/selfie stick.jpg";
import Sleepyeyecover from "../assets/images/sleepy eye cover.jpg";
import Teacup from "../assets/images/tea cup.jpg";
import Totebag from "../assets/images/tote bag.jpg";
import Towel from "../assets/images/towel.jpg";
import Waterbottle from "../assets/images/water bottle.jpg";
import fancyglasses from "../assets/images/fancy glasses.jpg";
import earpods from "../assets/images/earpod.jpg";
import headset from "../assets/images/headset.jpg";
import laptopsticker from "../assets/images/laptop sticker.jpg";
import scarf from "../assets/images/scarf.jpg";
import toothbrush from "../assets/images/toothbrush.jpg";
import wristwatch from "../assets/images/wrist watch.jpg";

export const categories = [
  {
    id: "beauty-self-care",
    name: "Beauty & Self-Care",
    description: "Little things that help her feel fresh, confident and cared for.",
  },
  {
    id: "accessories",
    name: "Accessories",
    description: "Cute everyday pieces made to complete her look.",
  },
  {
    id: "bags-personal",
    name: "Bags & Personal",
    description: "Useful everyday essentials she can carry and keep close.",
  },
  {
    id: "stationery",
    name: "Stationery",
    description: "Jotters, cards and thoughtful essentials for her everyday life.",
  },
  {
    id: "fashion-hair",
    name: "Fashion & Hair",
    description: "Comfortable and stylish essentials for everyday living.",
  },
  {
    id: "period-care",
    name: "Period Care",
    description: "Practical essentials to help girls prepare, plan and feel comfortable.",
  },
  {
    id: "gifts-fun",
    name: "Gifts & Fun",
    description: "Fun, thoughtful and memorable items for every occasion.",
  },
];

export const products = [
  // Beauty & Self-Care
  {
    id: "beauty-001",
    name: "Velvet Blush Perfume",
    category: "beauty-self-care",
    price: 8500,
    image: Perfume,
    description: "A beautiful fragrance for girls who love to feel fresh, confident and special.",
    tags: ["beauty", "fragrance"],
    featured: true,
  },
  {
    id: "beauty-002",
    name: "Fresh Glow Roll-On",
    category: "beauty-self-care",
    price: 3500,
    image: Rollon,
    description: "An everyday personal-care essential for staying fresh throughout the day.",
    tags: ["beauty", "care"],
    featured: true,
  },
  {
    id: "beauty-003",
    name: "Pink Petals Body Spray",
    category: "beauty-self-care",
    price: 5500,
    image: Bodyspray,
    description: "A refreshing body spray for everyday confidence.",
    tags: ["beauty", "fragrance"],
    featured: true,
  },
  {
    id: "beauty-004",
    name: "Kiss Me Lip Balm",
    category: "beauty-self-care",
    price: 2500,
    image: Lipbalm,
    description: "A simple everyday lip-care essential.",
    tags: ["beauty", "lip-care"],
  },
  {
    id: "beauty-005",
    name: "Clear Skin Pimple Patches",
    category: "beauty-self-care",
    price: 3000,
    image: Pimplepatch,
    description: "A handy skincare accessory for everyday personal care.",
    tags: ["beauty", "skincare"],
  },
  {
    id: "beauty-006",
    name: "Soft Care Toothbrush",
    category: "beauty-self-care",
    price: 2000,
    image: toothbrush,
    description: "An everyday personal hygiene essential.",
    tags: ["care", "hygiene"],
    forMembers: true,
  },
  {
    id: "beauty-007",
    name: "Everyday Hair Brush",
    category: "beauty-self-care",
    price: 4500,
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=85",
    description: "A practical hair-care essential for everyday routines.",
    tags: ["hair", "beauty"],
  },
  {
    id: "beauty-008",
    name: "Detangling Comb",
    category: "beauty-self-care",
    price: 2000,
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=700&q=85",
    description: "A simple everyday hair-care essential.",
    tags: ["hair", "beauty"],
  },

  // Accessories
  {
    id: "accessory-001",
    name: "Amethyst Drop Earrings",
    category: "accessories",
    price: 4500,
    image: Earrings,
    description: "A cute accessory to add a little sparkle to her outfit.",
    tags: ["jewelry", "fashion"],
    featured: true,
  },
  {
    id: "accessory-002",
    name: "Delicate Chain Necklace",
    category: "accessories",
    price: 5000,
    image: Necklace,
    description: "A simple statement piece for everyday outfits.",
    tags: ["jewelry", "fashion"],
    featured: true,
  },
  {
    id: "accessory-003",
    name: "Charm Bracelet",
    category: "accessories",
    price: 3500,
    image: Bracelet,
    description: "A stylish bracelet for adding personality to her look.",
    tags: ["jewelry", "fashion"],
  },
  {
    id: "accessory-004",
    name: "Satin Hair Bow",
    category: "accessories",
    price: 2500,
    image: Hairbow,
    description: "A playful hair accessory for everyday styling.",
    tags: ["hair", "accessory"],
  },
  {
    id: "accessory-005",
    name: "Soft Hair Ties",
    category: "accessories",
    price: 2000,
    image: Hairband,
    description: "Useful everyday hair accessories.",
    tags: ["hair", "accessory"],
  },
  {
    id: "accessory-007",
    name: "Everyday Headband",
    category: "accessories",
    price: 2500,
    image: Hairband,
    description: "A comfortable accessory for everyday styling.",
    tags: ["hair", "fashion"],
  },
    {
    id: "accessory-009",
    name: "Loudspeaker Earpods",
    category: "accessories",
    price: 5000,
    image: earpods,
    description: "A musical everyday accessory.",
    tags: ["fashion", "accessory"],
    forMembers: true,
  },
    {
    id: "accessory-006",
    name: "Matte Claw Clips",
    category: "accessories",
    price: 3000,
    image: Clawclips,
    description: "Easy-to-use clips for quick everyday hairstyles.",
    tags: ["hair", "accessory"],
  },
    {
    id: "accessory-011",
    name: "Fancy Laptop Sticker",
    category: "accessories",
    price: 5000,
    image: laptopsticker,
    description: "A fashionable laptop accessory for styling.",
    tags: ["tech", "accessory"],
    forMembers: true,
  },
  

  // Bags & Personal
  {
    id: "personal-001",
    name: "Mini Crossbody Purse",
    category: "bags-personal",
    price: 7000,
    image: Purse,
    description: "A cute everyday purse for keeping her essentials together.",
    tags: ["bag", "personal"],
    featured: true,
  },
  {
    id: "personal-002",
    name: "Personalized Tote Bag",
    category: "bags-personal",
    price: 6500,
    image: Totebag,
    description: "A practical tote for everyday essentials.",
    tags: ["bag", "personal"],
    featured: true,
  },
  {
    id: "personal-004",
    name: "Card & ID Holder",
    category: "bags-personal",
    price: 2500,
    image: Idholder,
    description: "A simple holder for keeping important cards safe.",
    tags: ["personal", "organizer"],
  },
  {
    id: "personal-005",
    name: "Cute Keychain",
    category: "bags-personal",
    price: 2500,
    image: Keyholder,
    description: "A cute little accessory for keeping keys together.",
    tags: ["personal", "accessory"],
  },
  {
    id: "personal-006",
    name: "Pastel Water Bottle",
    category: "bags-personal",
    price: 6000,
    image: Waterbottle,
    description: "A reusable bottle for staying hydrated throughout the day.",
    tags: ["personal", "lifestyle"],
  },

  // Stationery
  {
    id: "stationery-001",
    name: "Soft Cover Jotter",
    category: "stationery",
    price: 3000,
    image: Jotter,
    description: "A handy notebook for thoughts, plans, ideas and reminders.",
    tags: ["stationery", "writing"],
  },
  {
    id: "stationery-002",
    name: "Glitter Gel Pen",
    category: "stationery",
    price: 1500,
    image: Pen,
    description: "A simple writing essential for school, home or personal planning.",
    tags: ["stationery", "writing"],
  },
    {
    id: "accessory-008",
    name: "Clear Frame Glasses",
    category: "accessories",
    price: 5000,
    image: fancyglasses,
    description: "A fashionable everyday accessory.",
    tags: ["fashion", "accessory"],
    forMembers: true,
  },
  {
    id: "stationery-003",
    name: "Greeting Cards Set",
    category: "stationery",
    price: 2500,
    image: Cards,
    description: "Thoughtful cards for birthdays, celebrations and special moments.",
    tags: ["stationery", "gift"],
  },
  {
    id: "stationery-004",
    name: "Period Tracker Journal",
    category: "stationery",
    price: 5000,
    image: Periodjournal,
    description: "A practical personal planner for tracking important monthly routines.",
    tags: ["stationery", "period-care"],
    featured: true,
  },

  // Fashion & Hair
  {
    id: "fashion-001",
    name: "Soft Nightwear Set",
    category: "fashion-hair",
    price: 12000,
    image: Nightwear,
    description: "Comfortable nightwear for relaxing and winding down.",
    tags: ["fashion", "comfort"],
    featured: true,
  },
  {
    id: "fashion-002",
    name: "Satin Hair Bonnet",
    category: "fashion-hair",
    price: 4500,
    image: Hairbonnet,
    description: "A comfortable hair-care essential for bedtime routines.",
    tags: ["hair", "comfort"],
  },
  {
    id: "fashion-003",
    name: "Casual Face Cap",
    category: "fashion-hair",
    price: 5000,
    image: Facecaps,
    description: "A casual cap for everyday outfits.",
    tags: ["fashion", "accessory"],
  },
  {
    id: "fashion-004",
    name: "Soft Bath Towel",
    category: "fashion-hair",
    price: 5000,
    image: Towel,
    description: "A soft everyday personal-care essential.",
    tags: ["comfort", "care"],
  },
  {
    id: "accessory-013",
    name: "Cute Scarf",
    category: "fashion",
    price: 5000,
    image: scarf,
    description: "A fashionable laptop accessory for styling.",
    tags: ["fashion", "accessory"],
    forMembers: true,
  },
  {
    id: "fashion-005",
    name: "Everyday Panties Pack",
    category: "fashion-hair",
    price: 5000,
    image: Panties,
    description: "An everyday clothing essential.",
    tags: ["fashion", "comfort"],
  },

  // Period Care
  {
    id: "period-001",
    name: "Ultra Soft Sanitary Pads",
    category: "period-care",
    price: 3500,
    image: Sanitarypads,
    description: "An essential personal-care product for period days.",
    tags: ["period", "care"],
    featured: true,
  },
  {
    id: "period-002",
    name: "Daily Panty Liners",
    category: "period-care",
    price: 2500,
    image: Pantielineup,
    description: "A convenient everyday personal-care essential.",
    tags: ["period", "care"],
  },
  {
    id: "period-003",
    name: "Period Tracker Journal",
    category: "period-care",
    price: 5000,
    image: Periodjournal,
    description: "A simple planner for helping girls understand and organize their monthly routines.",
    tags: ["period", "planner"],
  },

  // Gifts & Fun
  {
    id: "fun-001",
    name: "Fresh Rose Bouquet",
    category: "gifts-fun",
    price: 5000,
    image: Flower,
    description: "A beautiful gift for making someone feel special.",
    tags: ["gift", "fun"],
    featured: true,
  },
  {
    id: "fun-002",
    name: "Pink Celebration Balloons",
    category: "gifts-fun",
    price: 2500,
    image: Balloon,
    description: "A fun addition to birthdays, celebrations and special moments.",
    tags: ["gift", "celebration"],
  },
  {
    id: "fun-003",
    name: "Portable Mini Fan",
    category: "gifts-fun",
    price: 2500,
    image: Handfan,
    description: "A handy and fun everyday accessory.",
    tags: ["fun", "personal"],
  },
        {
    id: "accessory-012",
    name: "Wrist Watch",
    category: "accessories",
    price: 5000,
    image: wristwatch,
    description: "A fashionable wristwatch for adding style to any outfit.",
    tags: ["fashion", "accessory"],
    forMembers: true,
  },
    {
    id: "personal-003",
    name: "Stylish Everyday Backpack",
    category: "bags-personal",
    price: 15000,
    image: Fancybackpack,
    description: "A stylish backpack for carrying everyday essentials.",
    tags: ["bag", "fashion"],
    featured: true,
  },
  {
    id: "fun-004",
    name: "Bluetooth Selfie Stick",
    category: "gifts-fun",
    price: 8000,
    image: Selfiestick,
    description: "A fun accessory for capturing memories with friends and family.",
    tags: ["fun", "tech"],
  },
      {
    id: "accessory-010",
    name: "Pinkish & Girlish Headset",
    category: "accessories",
    price: 5000,
    image: headset,
    description: "A super musical everyday accessory.",
    tags: ["fashion", "accessory"],
    forMembers: true,
  },
  {
    id: "fun-005",
    name: "Pink Ceramic Mug",
    category: "gifts-fun",
    price: 6000,
    image: Teacup,
    description: "A cute cup for everyday drinks or gifting.",
    tags: ["gift", "lifestyle"],
  },
  {
    id: "fun-006",
    name: "Comfort Clogs",
    category: "gifts-fun",
    price: 12000,
    image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=700&q=85",
    description: "A casual and comfortable footwear option for everyday use.",
    tags: ["fashion", "comfort"],
    featured: true,
  },
  {
    id: "fun-007",
    name: "Soft Sleep Mask",
    category: "gifts-fun",
    price: 3000,
    image: Sleepyeyecover,
    description: "A soft accessory for relaxing and getting ready for sleep.",
    tags: ["comfort", "sleep"],
  },
];

// Helper functions
export const getProductsByCategory = (categoryId) => {
  return products.filter((product) => product.category === categoryId);
};

export const getProductById = (productId) => {
  return products.find((product) => product.id === productId);
};

export const getCategoryById = (categoryId) => {
  return categories.find((category) => category.id === categoryId);
};