import express from "express";
const router = express.Router();
router.get("/", async (req, res) => {
    res.status(200).json("It works!");
});
export default router;
//# sourceMappingURL=test.route.js.map