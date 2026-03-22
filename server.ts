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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase setup
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

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

  if (process.env.NODE_ENV === "production") {
    app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          ...helmet.contentSecurityPolicy.getDefaultDirectives(),
          "img-src": ["'self'", "data:", "https://picsum.photos", "https://upload.wikimedia.org", "https://images.unsplash.com", "https://cdn.shopify.com", supabaseUrl ? new URL(supabaseUrl).hostname : ""],
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
  const MARQUEE_FILE = path.join(__dirname, 'marquee.json');
  const BLOGS_FILE = path.join(__dirname, 'blogs.json');

  const readJsonFile = (filePath: string) => {
    try {
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
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
      const { data, error } = await supabase.from('products').update({ badge: 'FEATURED' }).eq('id', 1).select();
      res.json({ data, error });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/test-bucket", async (req, res) => {
    try {
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
  app.get("/api/orders", adminCheck, async (req, res) => {
    try {
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
