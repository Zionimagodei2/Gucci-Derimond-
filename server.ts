import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import fs from "fs";
import db from "./db";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "public", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer config for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.set('trust proxy', 1);

  if (process.env.NODE_ENV === "production") {
    app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          ...helmet.contentSecurityPolicy.getDefaultDirectives(),
          "img-src": ["'self'", "data:", "https://picsum.photos", "https://upload.wikimedia.org", "https://images.unsplash.com"],
          "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
          "style-src": ["'self'", "'unsafe-inline'"],
          "connect-src": ["'self'", "*"],
        },
      },
    }));
  }

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again after 15 minutes",
    validate: { xForwardedForHeader: false },
  });
  app.use("/api/", limiter);

  app.use(express.json());
  app.use("/uploads", express.static(uploadsDir));

  // API routes
  app.get("/api/health", (req, res) => {
    try {
      const count = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
      res.json({ status: "ok", message: "Marco Tac Lifestyle API is running", productCount: count.count });
    } catch (err) {
      res.status(500).json({ status: "error", message: "Database connection failed" });
    }
  });

  // Get all products
  app.get("/api/products", (req, res) => {
    const products = db.prepare("SELECT * FROM products ORDER BY created_at DESC").all();
    res.json(products);
  });

  // Get single product
  app.get("/api/products/:id", (req, res) => {
    const product = db.prepare("SELECT * FROM products WHERE id = ?").get(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  });

  // Basic admin check middleware
  const adminCheck = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const isAdmin = req.headers['x-admin-access'] === 'true';
    if (isAdmin) {
      next();
    } else {
      res.status(403).json({ error: "Unauthorized access" });
    }
  };

  // Create product
  app.post("/api/products", adminCheck, upload.single("imageFile"), (req, res) => {
    const { name, brand, price, salePrice, description, fitment, category, imageUrl } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : imageUrl;

    const insert = db.prepare(`
      INSERT INTO products (name, brand, price, salePrice, description, fitment, category, image)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insert.run(name, brand, price, salePrice || null, description, fitment, category, image);
    res.json({ id: result.lastInsertRowid, image });
  });

  // Update product
  app.put("/api/products/:id", adminCheck, upload.single("imageFile"), (req, res) => {
    const { name, brand, price, salePrice, description, fitment, category, imageUrl } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : imageUrl;

    const update = db.prepare(`
      UPDATE products 
      SET name = ?, brand = ?, price = ?, salePrice = ?, description = ?, fitment = ?, category = ?, image = ?
      WHERE id = ?
    `);

    update.run(name, brand, price, salePrice || null, description, fitment, category, image, req.params.id);
    res.json({ success: true, image });
  });

  // Delete product
  app.delete("/api/products/:id", adminCheck, (req, res) => {
    db.prepare("DELETE FROM products WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // --- Marquee Images API ---
  app.get("/api/marquee", (req, res) => {
    const images = db.prepare("SELECT * FROM marquee_images ORDER BY created_at DESC").all();
    res.json(images);
  });

  app.post("/api/marquee", adminCheck, upload.single("imageFile"), (req, res) => {
    const { imageUrl } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : imageUrl;
    if (!image) return res.status(400).json({ error: "Image is required" });

    const insert = db.prepare("INSERT INTO marquee_images (image_url) VALUES (?)");
    const result = insert.run(image);
    res.json({ id: result.lastInsertRowid, image_url: image });
  });

  app.delete("/api/marquee/:id", adminCheck, (req, res) => {
    db.prepare("DELETE FROM marquee_images WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // --- Blog Posts API ---
  app.get("/api/blogs", (req, res) => {
    const blogs = db.prepare("SELECT * FROM blog_posts ORDER BY created_at DESC").all();
    res.json(blogs);
  });

  app.get("/api/blogs/:id", (req, res) => {
    const blog = db.prepare("SELECT * FROM blog_posts WHERE id = ?").get(req.params.id);
    if (blog) {
      res.json(blog);
    } else {
      res.status(404).json({ error: "Blog post not found" });
    }
  });

  app.post("/api/blogs", adminCheck, upload.single("imageFile"), (req, res) => {
    const { title, excerpt, content, author, imageUrl } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : imageUrl;

    const insert = db.prepare(`
      INSERT INTO blog_posts (title, excerpt, content, author, image)
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = insert.run(title, excerpt, content, author || 'Admin', image);
    res.json({ id: result.lastInsertRowid });
  });

  app.put("/api/blogs/:id", adminCheck, upload.single("imageFile"), (req, res) => {
    const { title, excerpt, content, author, imageUrl } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : imageUrl;

    const update = db.prepare(`
      UPDATE blog_posts 
      SET title = ?, excerpt = ?, content = ?, author = ?, image = ?
      WHERE id = ?
    `);
    update.run(title, excerpt, content, author || 'Admin', image, req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/blogs/:id", adminCheck, (req, res) => {
    db.prepare("DELETE FROM blog_posts WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
