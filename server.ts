import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [".jpg", ".jpeg", ".png", ".bmp"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, PNG and BMP files are allowed"));
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use("/uploads", express.static(uploadsDir));

  // In-memory data store (for prototype purposes)
  let news = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800",
      date: "12 May, 2024",
      title: "Navro'z bayrami tantanalari bo'lib o'tdi",
      description: "Maktabimizda Navro'z bayrami munosabati bilan katta madaniy tadbir tashkil etildi. Tadbirda milliy qadriyatlarimiz aks ettirildi."
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800",
      date: "5 May, 2024",
      title: "Matematika fanidan olimpiada g'oliblari",
      description: "Shahar bosqichida o'quvchilarimiz faxrli 1-o'rinni egallashdi. Ularning yutuqlari butun jamoamiz uchun faxrdir."
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800",
      date: "28 Aprel, 2024",
      title: "Yangi laboratoriya foydalanishga topshirildi",
      description: "Kimyo va fizika fanlari uchun yangi zamonaviy laboratoriya jihozlari olib kelindi va o'quvchilar ixtiyoriga berildi."
    }
  ];

  let gallery = [
    "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1501290741922-b56c0d097e79?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=600"
  ];

  // API Routes
  app.get("/api/news", (req, res) => {
    res.json(news);
  });

  app.post("/api/news", upload.single("image"), (req, res) => {
    const { title, description } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : req.body.image;
    
    if (!title || !description || !imageUrl) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newItem = { 
      id: Date.now(), 
      title, 
      description, 
      image: imageUrl,
      date: new Date().toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' })
    };
    news = [newItem, ...news];
    res.status(201).json(newItem);
  });

  app.delete("/api/news/:id", (req, res) => {
    news = news.filter(n => n.id !== parseInt(req.params.id));
    res.status(204).send();
  });

  app.get("/api/gallery", (req, res) => {
    res.json(gallery);
  });

  app.post("/api/gallery", upload.single("image"), (req, res) => {
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : req.body.url;
    
    if (!imageUrl) {
      return res.status(400).json({ error: "Missing image" });
    }

    gallery = [imageUrl, ...gallery];
    res.status(201).json({ url: imageUrl });
  });

  // Error handler for API routes
  app.use("/api", (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("API Error:", err);
    res.status(err.status || 500).json({
      error: err.message || "Internal Server Error",
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
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
