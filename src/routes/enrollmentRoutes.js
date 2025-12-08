import express from "express";
import { enrollInCourse, viewEnrollments } from "../controllers/enrollmentController.js";
const router = express.Router();

// Inscribirse en un curso (solo estudiantes)
router.post("/enroll/:id", enrollInCourse);

// Ver inscripciones (solo profesores)
router.get("/enrollments", viewEnrollments);

export default router;
