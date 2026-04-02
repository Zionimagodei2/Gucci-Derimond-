import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import nodemailer from "nodemailer";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase setup
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null as any;

// Multer config for memory storage (buffer for Supabase upload)
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.set('trust proxy', 1);
  app.use(cors());

  // Request logging middleware
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
  });

  if (process.env.NODE_ENV === "production") {
    app.use(helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: { policy: "cross-origin" }
    }));
  }

  // Enable rate limiter for production to protect from attacks
  if (process.env.NODE_ENV === "production") {
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 500, // Limit each IP to 500 requests per windowMs
      message: "Too many requests from this IP, please try again after 15 minutes",
      validate: { xForwardedForHeader: false },
    });
    app.use("/api/", limiter);
  }

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Helper to upload image to Supabase Storage or fallback to base64
  const uploadImageToSupabase = async (file: Express.Multer.File) => {
    try {
      if (!supabaseUrl || !supabaseKey) {
        // Fallback to base64 if Supabase is not configured
        const base64 = file.buffer.toString('base64');
        return `data:${file.mimetype};base64,${base64}`;
      }
      
      const fileExt = file.originalname.split('.').pop();
      const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${fileExt}`;
      const { data, error } = await supabase.storage
        .from('images')
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
        });
      
      if (error) throw error;
      
      const { data: publicUrlData } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);
        
      return publicUrlData.publicUrl;
    } catch (err) {
      console.error('Supabase upload failed, falling back to base64:', err);
      const base64 = file.buffer.toString('base64');
      return `data:${file.mimetype};base64,${base64}`;
    }
  };

  const PRODUCTS_FILE = path.join(__dirname, 'products.json');
  const COLLECTION_PRODUCTS_FILE = path.join(__dirname, 'collection_products.json');
  const SCRAPED_CATEGORIES_FILE = path.join(__dirname, 'scraped_categories.json');
  const MARQUEE_FILE = path.join(__dirname, 'marquee.json');
  const BLOGS_FILE = path.join(__dirname, 'blogs.json');
  const VISITS_FILE = path.join(__dirname, 'visits.json');
  const MESSAGES_FILE = path.join(__dirname, 'messages.json');

  // Startup check for data files
  console.log('--- Startup Data Check ---');
  const filesToCheck = [
    { name: 'Products', path: PRODUCTS_FILE },
    { name: 'Collections', path: COLLECTION_PRODUCTS_FILE },
    { name: 'Categories', path: SCRAPED_CATEGORIES_FILE },
    { name: 'Marquee', path: MARQUEE_FILE },
    { name: 'Blogs', path: BLOGS_FILE }
  ];

  filesToCheck.forEach(file => {
    if (fs.existsSync(file.path)) {
      const data = fs.readFileSync(file.path, 'utf8');
      try {
        const parsed = JSON.parse(data);
        const count = Array.isArray(parsed) ? parsed.length : Object.keys(parsed).length;
        console.log(`✅ ${file.name}: Found, Valid JSON, ${count} items.`);
      } catch (e) {
        console.error(`❌ ${file.name}: Found, INVALID JSON! Error: ${e.message}`);
      }
    } else {
      console.warn(`⚠️ ${file.name}: NOT FOUND at ${file.path}`);
    }
  });
  console.log('--------------------------');

  const readJsonFile = (filePath: string) => {
    try {
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        if (!data || data.trim() === '') {
          console.warn(`Warning: File ${filePath} is empty.`);
          return filePath.endsWith('.json') && data.startsWith('{') ? {} : [];
        }
        try {
          const parsed = JSON.parse(data);
          console.log(`Successfully read ${filePath}, items: ${Array.isArray(parsed) ? parsed.length : 'object'}`);
          return parsed;
        } catch (parseErr) {
          console.error(`Error parsing JSON from ${filePath}:`, parseErr);
          console.error(`Data snippet: ${data.substring(0, 100)}...`);
          return [];
        }
      } else {
        console.warn(`Warning: File ${filePath} does not exist at ${filePath}`);
      }
    } catch (err) {
      console.error(`Error reading file ${filePath}:`, err);
    }
    return [];
  };

  const writeJsonFile = (filePath: string, data: any[]) => {
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (err) {
      console.error(`Error writing file ${filePath}:`, err);
    }
  };

  const sendNotificationEmail = async (subject: string, text: string) => {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return;
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.SMTP_USER || '"Marco Tac Lifestyle" <noreply@marcotaclifestyle.com>',
        to: process.env.SMTP_USER, // Send to the admin's email
        subject: subject,
        text: text
      });
    } catch (error) {
      console.error('Failed to send notification email:', error);
    }
  };

  // API routes
  app.get("/api/health", async (req, res) => {
    try {
      const products = readJsonFile(PRODUCTS_FILE);
      res.json({ status: "ok", message: "Marco Tac Lifestyle API is running", productCount: products.length });
    } catch (err) {
      res.status(500).json({ status: "error", message: "Database connection failed" });
    }
  });

  // Get all products
  app.get("/api/products", async (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    const products = readJsonFile(PRODUCTS_FILE);
    products.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    res.json(products);
  });

  // Get single product
  app.get("/api/products/:id", async (req, res) => {
    const products = readJsonFile(PRODUCTS_FILE);
    const product = products.find((p: any) => p.id.toString() === req.params.id);
    if (!product) {
      res.status(404).json({ error: "Product not found" });
    } else {
      res.json(product);
    }
  });

  // Get products for a collection
  app.get("/api/collections/:slug/products", async (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    const slug = req.params.slug;
    const products = readJsonFile(PRODUCTS_FILE);
    
    if (slug === 'all') {
      products.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      return res.json(products);
    }
    
    if (slug === 'sale') {
      const saleProducts = products.filter((p: any) => p.badge === 'Sale' || (p.tags && p.tags.includes('Sale')) || p.salePrice);
      saleProducts.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      return res.json(saleProducts);
    }
    
    if (slug === 'velcro-bag') {
      const velcroProducts = products.filter((p: any) => p.name.toLowerCase().includes('velcro'));
      velcroProducts.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      return res.json(velcroProducts);
    }
    
    if (slug === 'camping-overland') {
      const campingProducts = products.filter((p: any) => 
        p.category && (p.category.toLowerCase().includes('camping') || p.category.toLowerCase().includes('overland') || p.category.toLowerCase().includes('tent'))
      );
      campingProducts.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      return res.json(campingProducts);
    }
    
    const collectionProductsMap = readJsonFile(COLLECTION_PRODUCTS_FILE);
    const productIds = collectionProductsMap[`/collections/${slug}`];
    
    if (!productIds) {
      // If collection not found in map, fallback to filtering by category
      const filteredProducts = products.filter((p: any) => {
        if (!p.category) return false;
        const catSlug = p.category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        return catSlug === slug;
      });
      filteredProducts.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      return res.json(filteredProducts);
    }
    
    const filteredProducts = products.filter((p: any) => productIds.includes(p.id.toString()));
    filteredProducts.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    res.json(filteredProducts);
  });

  // Get generation categories
  app.get("/api/generations/:slug/categories", async (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    const slug = req.params.slug;
    const categoriesMap = readJsonFile(SCRAPED_CATEGORIES_FILE);
    
    // Convert slug back to name (e.g., "3rd-gen-tacoma" -> "3rd Gen Tacoma")
    let name = slug.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    // Handle special cases
    if (name === '3rd Gen 4runner') name = '3rd Gen 4Runner';
    if (name === '4th Gen 4runner') name = '4th Gen 4Runner';
    if (name === '5th Gen 4runner') name = '5th Gen 4Runner';
    if (name === 'Fj Cruiser') name = 'FJ Cruiser';
    if (name === 'Lexus Gx470') name = 'Lexus GX470';
    
    const categories = categoriesMap[name] || [];
    
    res.json(categories);
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

  // Test endpoint
  app.get("/api/test-env", (req, res) => {
    res.json({ url: process.env.SUPABASE_URL, key: process.env.SUPABASE_SERVICE_ROLE_KEY });
  });

  // Test schema endpoint
  app.get("/api/test-schema", async (req, res) => {
    try {
      if (!supabase) return res.status(500).json({ error: "Supabase not configured" });
      const { data, error } = await supabase.from('products').update({ badge: 'FEATURED' }).eq('id', 1).select();
      res.json({ data, error });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/test-bucket", async (req, res) => {
    try {
      if (!supabase) return res.status(500).json({ error: "Supabase not configured" });
      const { data, error } = await supabase.storage.getBucket('images');
      if (error) {
        // Try to create it
        const { data: createData, error: createError } = await supabase.storage.createBucket('images', { public: true });
        return res.json({ status: 'created', data: createData, error: createError });
      }
      res.json({ status: 'exists', data });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Upload profile picture
  app.post("/api/upload-profile-picture", upload.single("imageFile"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }
      const imageUrl = await uploadImageToSupabase(req.file);
      res.json({ imageUrl });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create product
  app.post("/api/products", adminCheck, upload.single("imageFile"), async (req, res) => {
    try {
      const { name, brand, price, salePrice, description, fitment, category, image: existingImage, badge } = req.body;
      let image = existingImage;
      
      if (req.file) {
        image = await uploadImageToSupabase(req.file);
      }

      const parsedPrice = parseFloat(price);
      const parsedSalePrice = salePrice ? parseFloat(salePrice) : null;

      const products = readJsonFile(PRODUCTS_FILE);
      const newProduct = {
        id: Date.now(),
        name, brand, price: parsedPrice, salePrice: parsedSalePrice, description, fitment, category, image, badge: badge || null,
        created_at: new Date().toISOString()
      };
      
      products.push(newProduct);
      writeJsonFile(PRODUCTS_FILE, products);

      res.json({ id: newProduct.id, image });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Toggle featured status
  app.put("/api/products/:id/featured", adminCheck, async (req, res) => {
    try {
      const { isFeatured } = req.body;
      
      const products = readJsonFile(PRODUCTS_FILE);
      const productIndex = products.findIndex((p: any) => p.id.toString() === req.params.id);
      
      if (productIndex === -1) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      let currentBadge = products[productIndex].badge || '';
      let badges = currentBadge ? currentBadge.split(',').map((b: string) => b.trim()) : [];
      
      if (isFeatured) {
        if (!badges.includes('FEATURED')) {
          badges.push('FEATURED');
        }
      } else {
        badges = badges.filter((b: string) => b !== 'FEATURED');
      }
      
      const newBadge = badges.length > 0 ? badges.join(',') : null;
      
      products[productIndex].badge = newBadge;
      writeJsonFile(PRODUCTS_FILE, products);
        
      res.json({ success: true, badge: newBadge });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Update product
  app.put("/api/products/:id", adminCheck, upload.single("imageFile"), async (req, res) => {
    try {
      const { name, brand, price, salePrice, description, fitment, category, image: existingImage, badge } = req.body;
      let image = existingImage;
      
      if (req.file) {
        image = await uploadImageToSupabase(req.file);
      }

      const parsedPrice = parseFloat(price);
      const parsedSalePrice = salePrice ? parseFloat(salePrice) : null;

      const products = readJsonFile(PRODUCTS_FILE);
      const productIndex = products.findIndex((p: any) => p.id.toString() === req.params.id);
      
      if (productIndex === -1) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      products[productIndex] = {
        ...products[productIndex],
        name, brand, price: parsedPrice, salePrice: parsedSalePrice, description, fitment, category, image, badge: badge || null
      };
      
      writeJsonFile(PRODUCTS_FILE, products);

      res.json({ success: true, image });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Delete product
  app.delete("/api/products/:id", adminCheck, async (req, res) => {
    try {
      let products = readJsonFile(PRODUCTS_FILE);
      products = products.filter((p: any) => p.id.toString() !== req.params.id);
      writeJsonFile(PRODUCTS_FILE, products);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // --- Marquee Images API ---
  app.get("/api/marquee", async (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    const images = readJsonFile(MARQUEE_FILE);
    images.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    res.json(images);
  });

  app.post("/api/marquee", adminCheck, upload.single("imageFile"), async (req, res) => {
    try {
      const { imageUrl } = req.body;
      let image = imageUrl;
      
      if (req.file) {
        image = await uploadImageToSupabase(req.file);
      }
      
      if (!image) return res.status(400).json({ error: "Image is required" });

      const images = readJsonFile(MARQUEE_FILE);
      const newImage = {
        id: Date.now(),
        image_url: image,
        created_at: new Date().toISOString()
      };
      
      images.push(newImage);
      writeJsonFile(MARQUEE_FILE, images);
      
      res.json({ id: newImage.id, image_url: image });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/marquee/:id", adminCheck, async (req, res) => {
    try {
      let images = readJsonFile(MARQUEE_FILE);
      images = images.filter((img: any) => img.id.toString() !== req.params.id);
      writeJsonFile(MARQUEE_FILE, images);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // --- Blog Posts API ---
  app.get("/api/blogs", async (req, res) => {
    const blogs = readJsonFile(BLOGS_FILE);
    blogs.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    res.json(blogs);
  });

  app.get("/api/blogs/:id", async (req, res) => {
    const blogs = readJsonFile(BLOGS_FILE);
    const blog = blogs.find((b: any) => b.id.toString() === req.params.id);
    if (!blog) {
      res.status(404).json({ error: "Blog post not found" });
    } else {
      res.json(blog);
    }
  });

  app.post("/api/blogs", adminCheck, upload.single("imageFile"), async (req, res) => {
    try {
      const { title, excerpt, content, author, image: existingImage } = req.body;
      let image = existingImage;
      
      if (req.file) {
        image = await uploadImageToSupabase(req.file);
      }

      const blogs = readJsonFile(BLOGS_FILE);
      const newBlog = {
        id: Date.now(),
        title, excerpt, content, author: author || 'Admin', image,
        created_at: new Date().toISOString()
      };
      
      blogs.push(newBlog);
      writeJsonFile(BLOGS_FILE, blogs);
      
      res.json({ id: newBlog.id });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/blogs/:id", adminCheck, upload.single("imageFile"), async (req, res) => {
    try {
      const { title, excerpt, content, author, image: existingImage } = req.body;
      let image = existingImage;
      
      if (req.file) {
        image = await uploadImageToSupabase(req.file);
      }

      const blogs = readJsonFile(BLOGS_FILE);
      const blogIndex = blogs.findIndex((b: any) => b.id.toString() === req.params.id);
      
      if (blogIndex === -1) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      
      blogs[blogIndex] = {
        ...blogs[blogIndex],
        title, excerpt, content, author: author || 'Admin', image
      };
      
      writeJsonFile(BLOGS_FILE, blogs);

      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/blogs/:id", adminCheck, async (req, res) => {
    try {
      let blogs = readJsonFile(BLOGS_FILE);
      blogs = blogs.filter((b: any) => b.id.toString() !== req.params.id);
      writeJsonFile(BLOGS_FILE, blogs);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const ORDERS_FILE = path.join(__dirname, 'orders.json');

  const readOrders = () => {
    try {
      if (fs.existsSync(ORDERS_FILE)) {
        const data = fs.readFileSync(ORDERS_FILE, 'utf8');
        return JSON.parse(data);
      }
    } catch (err) {
      console.error('Error reading orders file:', err);
    }
    return [];
  };

  const writeOrders = (orders: any[]) => {
    try {
      fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
    } catch (err) {
      console.error('Error writing orders file:', err);
    }
  };

  // --- Orders API ---
  app.get("/api/orders", async (req, res) => {
    try {
      // For now, return all orders if authenticated, or filter by user if we had user IDs
      // In a real app, we would filter by req.user.id
      const orders = readOrders();
      // Sort by created_at descending
      orders.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      res.json(orders);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const order = req.body;
      
      const newOrder = {
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toISOString().split('T')[0],
        status: 'Pending',
        ...order,
        created_at: new Date().toISOString()
      };
      
      const orders = readOrders();
      orders.push(newOrder);
      writeOrders(orders);
      
      // Send email notification
      try {
        const customerName = newOrder.customer ? `${newOrder.customer.firstName} ${newOrder.customer.lastName}` : 'Unknown Customer';
        const customerEmail = newOrder.customer ? newOrder.customer.email : 'Unknown Email';
        const adminEmail = 'support@marcotaclifestyle.com';
        const subject = `New Order Received: ${newOrder.id}`;
        const htmlContent = `
            <h2>New Order Received</h2>
            <p><strong>Order ID:</strong> ${newOrder.id}</p>
            <p><strong>Customer:</strong> ${customerName}</p>
            <p><strong>Email:</strong> ${customerEmail}</p>
            <p><strong>Total:</strong> $${newOrder.total}</p>
            <h3>Items:</h3>
            <ul>
              ${newOrder.items ? newOrder.items.map((item: any) => `<li>${item.name} - Qty: ${item.quantity} - $${item.price}</li>`).join('') : 'No items listed'}
            </ul>
          `;

        if (process.env.BREVO_API_KEY) {
          // Use Brevo API
          console.log('Using Brevo API for email notification');
          const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
              'accept': 'application/json',
              'api-key': process.env.BREVO_API_KEY,
              'content-type': 'application/json'
            },
            body: JSON.stringify({
              sender: {
                name: 'Marco Tac Lifestyle',
                email: 'support@marcotaclifestyle.com'
              },
              to: [
                { email: customerEmail, name: customerName },
                { email: adminEmail, name: 'Admin' }
              ],
              subject: subject,
              htmlContent: htmlContent
            })
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Brevo API error: ${response.status} ${errorText}`);
          }
          console.log('Order notification email sent successfully via Brevo');
        } else {
          // Fallback to SMTP
          const smtpPort = parseInt(process.env.SMTP_PORT || '587');
          const isSecure = process.env.SMTP_SECURE === 'true' || smtpPort === 465;

          const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: smtpPort,
            secure: isSecure,
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            },
          });

          const mailOptions = {
            from: process.env.SMTP_USER || '"Marco Tac Lifestyle" <noreply@marcotaclifestyle.com>',
            to: `${customerEmail}, ${adminEmail}`,
            subject: subject,
            html: htmlContent
          };

          if (process.env.SMTP_USER && process.env.SMTP_PASS) {
            await transporter.sendMail(mailOptions);
            console.log('Order notification email sent successfully via SMTP');
          } else {
            console.log('Email credentials not configured. Skipping email notification.');
          }
        }
      } catch (emailError) {
        console.error('Failed to send order notification email:', emailError);
        // We don't throw here because the order was successfully created
      }
      
      res.json({ success: true, orderId: newOrder.id });
    } catch (error: any) {
      console.error('Error creating order:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/orders/:id/status", adminCheck, async (req, res) => {
    try {
      const { status } = req.body;
      const orders = readOrders();
      
      const orderIndex = orders.findIndex((o: any) => o.id === req.params.id);
      if (orderIndex === -1) {
        return res.status(404).json({ error: 'Order not found' });
      }
      
      orders[orderIndex].status = status;
      writeOrders(orders);
      
      res.json({ success: true, order: orders[orderIndex] });
    } catch (error: any) {
      console.error('Error updating order status:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Track visits
  app.post("/api/visit", async (req, res) => {
    try {
      const visits = readJsonFile(VISITS_FILE);
      const newVisit = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        path: req.body.path || '/'
      };
      visits.unshift(newVisit);
      // Keep only last 100 visits
      writeJsonFile(VISITS_FILE, visits.slice(0, 100));
      
      // Send email notification for new visit
      sendNotificationEmail(
        'New Site Visit - Marco Tac Lifestyle',
        `A new visit was recorded on your site.\n\nPath: ${newVisit.path}\nIP: ${newVisit.ip}\nUser Agent: ${newVisit.userAgent}\nTime: ${newVisit.timestamp}`
      );

      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to log visit" });
    }
  });

  app.get("/api/visits", adminCheck, async (req, res) => {
    const visits = readJsonFile(VISITS_FILE);
    res.json(visits);
  });

  // --- Contact API ---
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, message } = req.body;
      if (!name || !email || !message) {
        return res.status(400).json({ error: "All fields are required" });
      }
      
      const messages = readJsonFile(MESSAGES_FILE);
      const newMessage = {
        id: Date.now(),
        name,
        email,
        message,
        timestamp: new Date().toISOString()
      };
      
      messages.unshift(newMessage);
      writeJsonFile(MESSAGES_FILE, messages.slice(0, 500)); // Keep last 500
      
      // Send email notification for new support message
      sendNotificationEmail(
        'New Support Message - Marco Tac Lifestyle',
        `You have received a new support message.\n\nFrom: ${name} (${email})\nMessage:\n${message}\n\nTime: ${newMessage.timestamp}`
      );

      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/messages", adminCheck, async (req, res) => {
    const messages = readJsonFile(MESSAGES_FILE);
    res.json(messages);
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
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
