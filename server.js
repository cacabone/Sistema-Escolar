import express from "express";
import session from "express-session";
import mongoose from "mongoose";
import dotenv from "dotenv";
import helmet from "helmet";
import path from "path";

dotenv.config();

const app = express();

// Configuración
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
  })
);

// Motor de vistas
app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "src/views"));
app.use(express.static("public"));

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => console.error("❌ Error en conexión:", err));

// Rutas
import authRoutes from "./src/routes/authRoutes.js";
import courseRoutes from "./src/routes/courseRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import enrollmentRoutes from "./src/routes/enrollmentRoutes.js";


app.get("/", (req, res) => {
  res.render("index", { user: req.session.user });
});

app.use("/", authRoutes);
app.use("/courses", courseRoutes);
app.use("/", enrollmentRoutes);
app.use("/", adminRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(
    `🚀 Servidor escuchando en http://localhost:${PORT} (env: ${process.env.NODE_ENV || "development"})`
  )
);
