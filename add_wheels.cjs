const fs = require('fs');
const products = JSON.parse(fs.readFileSync('products.json', 'utf8'));

const newWheels = [
  {
    "id": 9000000000001,
    "name": "Method Race Wheels 701 Trail Series - 17x8.5 / 6x139.7 / 0mm Offset - Matte Black",
    "brand": "Method Race Wheels",
    "price": 285.00,
    "salePrice": null,
    "description": "The 701 Trail Series wheel features Method's patented Bead Grip technology. Constructed from solid A356 aluminum with T6 heat treatment.",
    "fitment": "Toyota Tacoma, 4Runner, FJ Cruiser",
    "category": "wheels",
    "image": "https://cdn.shopify.com/s/files/1/0635/8276/5242/files/Hyperdrive_gloss_bronze_6lug_flowformed_b0fb0b87-fa9b-44ba-bbf0-ae43241a1d36.png?v=1772559073",
    "badge": "Best Seller"
  },
  {
    "id": 9000000000002,
    "name": "TRD Pro 17\" Matte Black Alloy Wheel",
    "brand": "Toyota TRD",
    "price": 240.00,
    "salePrice": 220.00,
    "description": "Genuine Toyota TRD Pro 17-inch matte black alloy wheel. 11mm offset widens the overall vehicle track width by 0.9-in (22 mm) for a more aggressive stance.",
    "fitment": "Toyota Tacoma, 4Runner",
    "category": "wheels",
    "image": "https://cdn.shopify.com/s/files/1/0635/8276/5242/files/Hyperdrive_gloss_bronze_6lug_flowformed_b0fb0b87-fa9b-44ba-bbf0-ae43241a1d36.png?v=1772559073",
    "badge": "Sale"
  },
  {
    "id": 9000000000003,
    "name": "Black Rhino Arsenal 17x9.5 6x139.7 -18mm Textured Matte Black",
    "brand": "Black Rhino",
    "price": 310.00,
    "salePrice": null,
    "description": "The Arsenal features a modified tactical look with a bolted face. Perfect for overland and off-road builds.",
    "fitment": "Toyota Tacoma, 4Runner, Tundra",
    "category": "wheels",
    "image": "https://cdn.shopify.com/s/files/1/0635/8276/5242/files/Hyperdrive_gloss_bronze_6lug_flowformed_b0fb0b87-fa9b-44ba-bbf0-ae43241a1d36.png?v=1772559073",
    "badge": null
  },
  {
    "id": 9000000000004,
    "name": "SCS Stealth 6 17x8.5 6x139.7 -10mm Matte Dark Bronze",
    "brand": "Stealth Custom Series",
    "price": 265.00,
    "salePrice": null,
    "description": "The Stealth 6 model is a classic 6-spoke design with a modern twist. Lightweight and strong.",
    "fitment": "Toyota Tacoma, 4Runner, GX460",
    "category": "wheels",
    "image": "https://cdn.shopify.com/s/files/1/0635/8276/5242/files/Hyperdrive_gloss_bronze_6lug_flowformed_b0fb0b87-fa9b-44ba-bbf0-ae43241a1d36.png?v=1772559073",
    "badge": "New"
  },
  {
    "id": 9000000000005,
    "name": "Fuel Off-Road Vector D579 17x8.5 6x139.7 7mm Matte Black",
    "brand": "Fuel Off-Road",
    "price": 295.00,
    "salePrice": null,
    "description": "The Vector D579 features a multi-spoke design with a simulated beadlock ring.",
    "fitment": "Toyota Tacoma, 4Runner",
    "category": "wheels",
    "image": "https://cdn.shopify.com/s/files/1/0635/8276/5242/files/Hyperdrive_gloss_bronze_6lug_flowformed_b0fb0b87-fa9b-44ba-bbf0-ae43241a1d36.png?v=1772559073",
    "badge": null
  },
  {
    "id": 9000000000006,
    "name": "Overland Sector Hyperdrive Gloss Bronze 17x8.5 6x139.7",
    "brand": "Overland Sector",
    "price": 250.00,
    "salePrice": null,
    "description": "Hyperdrive flow-formed wheels in gloss bronze. Lightweight and durable for off-road use.",
    "fitment": "Toyota Tacoma, 4Runner",
    "category": "wheels",
    "image": "https://cdn.shopify.com/s/files/1/0635/8276/5242/files/Hyperdrive_gloss_bronze_6lug_flowformed_b0fb0b87-fa9b-44ba-bbf0-ae43241a1d36.png?v=1772559073",
    "badge": "Featured"
  }
];

// Add the new wheels to the beginning of the products array
const updatedProducts = [...newWheels, ...products];

fs.writeFileSync('products.json', JSON.stringify(updatedProducts, null, 2));
console.log(`Added ${newWheels.length} wheels to products.json`);
