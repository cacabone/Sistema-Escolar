import express from "express";

const router = express.Router();

// Placeholder admin routes
router.get("/", (req, res) => {
	res.send("Admin index");
});

export default router;
