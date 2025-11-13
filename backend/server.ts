import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import cors from "cors";
import admin from "firebase-admin";
import dotenv from "dotenv";


// تحميل المتغيرات من ملف .env
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ استيراد مفتاح الخدمة من Firebase Admin SDK
import serviceAccount from "./adaptive-collaborative-learn-firebase-adminsdk-fbsvc-eec1eca8c0.json" assert { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

// ✅ الاتصال بقاعدة بيانات MongoDB
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log(" MongoDB connected"))
  .catch((err) => console.error(" MongoDB connection error:", err));

// ✅ Middleware للتحقق من توكن المستخدم من Firebase
const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).send("Unauthorized");

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    (req as any).user = decodedToken;
    next();
  } catch (err) {
    res.status(401).send("Invalid token");
  }
};

// ✅ مثال على Endpoint
app.post("/addData", checkAuth, async (req: Request, res: Response) => {
  const user = (req as any).user;
  res.send({
    message: " Data stored successfully",
    user: user.uid,
  });
});

// ✅ تشغيل السيرفر
const PORT = process.env.PORT || 5000;
const mongoUri = process.env.MONGO_URI;

console.log('Server running on port ${PORT}'); // ✅ backticks هنا ضرورية