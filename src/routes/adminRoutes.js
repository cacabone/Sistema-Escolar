import express from "express";
import { showAdminPanel, deleteUser, deleteCourse, showEditUser, updateUser } from "../controllers/adminController.js";

const router = express.Router();

router.get("/", (req, res) => res.redirect("/admin"));
router.get("/admin", showAdminPanel);
router.post("/admin/delete-user/:id", deleteUser);
router.post("/admin/delete-course/:id", deleteCourse);

// Edit user (form)
router.get("/admin/user/:id/edit", showEditUser);
router.post("/admin/user/:id/edit", updateUser);

export default router;
