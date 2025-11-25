import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// تحميل المتغيرات من ملف .env
dotenv.config();

const app = express();

// ✅ CORS مضبوط للفرونت إند على بورت 3000
app.use(cors({
  origin: "http://:3000", // أو "*" أثناء التطوير
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// دعم قراءة JSON من البوادي
app.use(express.json());

// Handle preflight requests
app.options('*', cors());

// ✅ الاتصال بقاعدة بيانات MongoDB
console.log("MongoDB URI:", process.env.MONGO_URI ? "*** exists *" : "* missing ***");

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Route للتأكد من أن السيرفر شغال
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ 
    status: "OK", 
    message: "Server is running!",
    database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected"
  });
});

// ✅ مثال على Endpoint بدون حماية
app.post("/api/addData", async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;
    
    res.json({
      message: "✅ Data stored successfully",
      data: {
        name,
        email,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error("Error in /api/addData:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ تشغيل السيرفر
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
  console.log("📊 Health check: http://127.0.0.1:" + PORT + "/api/health");
});