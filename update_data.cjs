const fs = require('fs');

const products = JSON.parse(fs.readFileSync('products.json', 'utf8'));

const newProducts = [
  {
    "id": 1001,
    "name": "ARB Retractable Awning",
    "brand": "ARB",
    "price": 295.00,
    "salePrice": null,
    "description": "Easy to mount and operate, these retractable awnings fit on to the side of a roof rack, and are conveniently stored for immediate use on arrival.",
    "fitment": "Universal",
    "category": "Accessories",
    "image": "https://toyotapowered.com/cdn/shop/products/arb-awning-4runner-lifestyle.jpg?crop=region&crop_height=400&crop_left=100&crop_top=0&crop_width=400&v=1700367319&width=600",
    "badge": "FEATURED",
    "created_at": "2026-03-26T00:00:00Z"
  },
  {
    "id": 1002,
    "name": "ARB Deluxe Awning Room",
    "brand": "ARB",
    "price": 199.00,
    "salePrice": null,
    "description": "Designed to function as a fully enclosed room, the ARB Deluxe Awning Room provides additional weather protection and privacy.",
    "fitment": "Fits ARB Awnings",
    "category": "Accessories",
    "image": "https://toyotapowered.com/cdn/shop/products/arb-deluxe-awning-room-setup.jpg?crop=region&crop_height=400&crop_left=100&crop_top=0&crop_width=400&v=1700367319&width=600",
    "badge": null,
    "created_at": "2026-03-26T00:00:00Z"
  },
  {
    "id": 1003,
    "name": "ARB EZ Deflator",
    "brand": "ARB",
    "price": 45.00,
    "salePrice": null,
    "description": "The ARB EZ deflator makes tire deflation easy and accurate.",
    "fitment": "Universal",
    "category": "Accessories",
    "image": "https://toyotapowered.com/cdn/shop/products/ARB_4x4_Accessories_EZ_Deflator_01.jpg?v=1700367348&width=600",
    "badge": null,
    "created_at": "2026-03-26T00:00:00Z"
  },
  {
    "id": 1004,
    "name": "ARB Front Deluxe Bull Bar",
    "brand": "ARB",
    "price": 1250.00,
    "salePrice": null,
    "description": "ARB Deluxe Bull Bars provide maximum protection and a mounting platform for accessories.",
    "fitment": "Toyota Tacoma / 4Runner",
    "category": "Exterior",
    "image": "https://toyotapowered.com/cdn/shop/products/ARB_front_deluxe_bull_bar_winch_mount_bumper_5th_gen_4runner-e1592496271905.jpg?crop=region&crop_height=400&crop_left=100&crop_top=0&crop_width=400&v=1700367423&width=600",
    "badge": "FEATURED",
    "created_at": "2026-03-26T00:00:00Z"
  },
  {
    "id": 1005,
    "name": "ARB Hydraulic Long Travel Recovery Jack",
    "brand": "ARB",
    "price": 850.00,
    "salePrice": null,
    "description": "A safer, lighter, and more compact alternative to traditional mechanical jacks.",
    "fitment": "Universal",
    "category": "Accessories",
    "image": "https://toyotapowered.com/cdn/shop/products/ARB_4x4_Accessories_Hydraulic_Long_Travel_Recovery_Jack_01.jpg?v=1700367370&width=600",
    "badge": null,
    "created_at": "2026-03-26T00:00:00Z"
  },
  {
    "id": 1006,
    "name": "ARB Portable 12V Air Compressor",
    "brand": "ARB",
    "price": 350.00,
    "salePrice": null,
    "description": "High performance portable air compressor for rapid tire inflation.",
    "fitment": "Universal",
    "category": "Accessories",
    "image": "https://toyotapowered.com/cdn/shop/products/arb_portable_high_performance_12_volt_air_compressor-e1592496230999.jpg?crop=region&crop_height=533&crop_left=33&crop_top=0&crop_width=533&v=1700367345&width=600",
    "badge": "FEATURED",
    "created_at": "2026-03-26T00:00:00Z"
  },
  {
    "id": 1007,
    "name": "ARB 50-Qt Weatherproof Fridge Freezer",
    "brand": "ARB",
    "price": 1050.00,
    "salePrice": null,
    "description": "Keep your food and drinks cold on the trail with this rugged fridge freezer.",
    "fitment": "Universal",
    "category": "Camper Storage",
    "image": "https://toyotapowered.com/cdn/shop/products/ARB_4x4_Accessories_Portable_50-Qt_Weatherproof_Fridge_Freezer_01_f60cb2c9-3316-4061-8907-4522f7f54c1b.jpg?v=1700367275&width=600",
    "badge": null,
    "created_at": "2026-03-26T00:00:00Z"
  },
  {
    "id": 1008,
    "name": "ARB Premium Recovery Kit",
    "brand": "ARB",
    "price": 450.00,
    "salePrice": null,
    "description": "Everything you need for a safe and effective vehicle recovery.",
    "fitment": "Universal",
    "category": "Accessories",
    "image": "https://toyotapowered.com/cdn/shop/products/RK9_ARB_Premium_Recovery_Kit.jpg?v=1700367359&width=600",
    "badge": null,
    "created_at": "2026-03-26T00:00:00Z"
  },
  {
    "id": 1009,
    "name": "Safari Snorkel Kit",
    "brand": "Safari",
    "price": 550.00,
    "salePrice": null,
    "description": "Protect your engine from dust and water ingestion with a Safari Snorkel.",
    "fitment": "Toyota Tacoma / 4Runner / FJ Cruiser",
    "category": "Exterior",
    "image": "https://toyotapowered.com/cdn/shop/products/ARB_4x4_Accessories_Safari_Snorkel_Kit_01.jpg?v=1700367408&width=600",
    "badge": null,
    "created_at": "2026-03-26T00:00:00Z"
  },
  {
    "id": 1010,
    "name": "ARB Simpson Series III Rooftop Tent",
    "brand": "ARB",
    "price": 1500.00,
    "salePrice": null,
    "description": "Comfortable and durable rooftop tent for your overland adventures.",
    "fitment": "Universal Roof Rack Mount",
    "category": "Rooftop Tents",
    "image": "https://toyotapowered.com/cdn/shop/products/arb-series-III-simpson-rooftop-tent-front.jpg?v=1700367281&width=395",
    "badge": "FEATURED",
    "created_at": "2026-03-26T00:00:00Z"
  },
  {
    "id": 1011,
    "name": "Tacoma G2 Trixpoly Splash Guards",
    "brand": "Trixpoly",
    "price": 120.00,
    "salePrice": null,
    "description": "Durable splash guards to protect your Tacoma from mud and rocks.",
    "fitment": "2005-2015 Toyota Tacoma",
    "category": "Exterior",
    "image": "https://toyotapowered.com/cdn/shop/files/taco-g2-trixpoly-splash-guards-micros-complete-black_ee3652db-aaea-46c1-b2bc-a2166a589fe4.jpg?crop=region&crop_height=4000&crop_left=94&crop_top=0&crop_width=4000&v=1762277756&width=4188",
    "badge": null,
    "created_at": "2026-03-26T00:00:00Z"
  }
];

// Check if these products already exist to avoid duplicates
const existingIds = new Set(products.map(p => p.id));
const productsToAdd = newProducts.filter(p => !existingIds.has(p.id));

const updatedProducts = [...productsToAdd, ...products];
fs.writeFileSync('products.json', JSON.stringify(updatedProducts, null, 2));

console.log(`Added ${productsToAdd.length} products to products.json`);
