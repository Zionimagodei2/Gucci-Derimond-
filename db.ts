import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'products.db'));

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    brand TEXT,
    price REAL NOT NULL,
    salePrice REAL,
    description TEXT,
    fitment TEXT,
    category TEXT,
    image TEXT,
    rating REAL DEFAULT 5,
    reviews INTEGER DEFAULT 0,
    badge TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS marquee_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    image_url TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS blog_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT,
    image TEXT,
    author TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed initial data if empty
const count = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
if (count.count === 0) {
  const insert = db.prepare(`
    INSERT INTO products (name, brand, price, salePrice, description, fitment, category, image, rating, reviews, badge)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const initialProducts = [
    ["AlphaRex LUXX-Series LED Headlights (Black) for 3rd Gen Tacoma", "AlphaRex", 1250, 1100, "Upgrade your 3rd Gen Tacoma with the AlphaRex LUXX-Series LED Headlights.", "2016-2023 Toyota Tacoma (All Trims)", "lighting", "https://picsum.photos/seed/prod1/800/800", 5, 42, "SALE"],
    ["Prinsu Roof Rack - Double Cab (2016-2023)", "Prinsu", 950, null, "The original Prinsu Roof Rack.", "2016-2023 Toyota Tacoma", "exterior", "https://picsum.photos/seed/prod2/400/400", 5, 128, "NEW"],
    ["Meso Customs Puddle Pods (2016-2023)", "Meso Customs", 185, null, "High output LED puddle lights.", "2016-2023 Toyota Tacoma", "lighting", "https://picsum.photos/seed/prod3/400/400", 4, 15, null],
    ["Baja Designs Squadron Pro Ditch Lights", "Baja Designs", 420, 380, "High performance ditch lights.", "Universal", "lighting", "https://picsum.photos/seed/prod4/400/400", 5, 89, "SALE"],
    ["CBI Offroad Hybrid Front Bumper", "CBI Offroad", 1450, null, "Heavy duty hybrid bumper.", "2016-2023 Tacoma", "exterior", "https://picsum.photos/seed/prod5/400/400", 5, 12, null],
    ["Method Race Wheels 701 (Matte Black)", "Method", 280, null, "Classic off-road wheels.", "Universal", "wheels", "https://picsum.photos/seed/prod6/400/400", 5, 56, null]
  ];

  for (const p of initialProducts) {
    insert.run(...p);
  }
}

export default db;
