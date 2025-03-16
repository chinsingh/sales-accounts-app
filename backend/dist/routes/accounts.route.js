import sfAccounts from "../services/sf-accounts.service";
import express from "express";
const router = express.Router();
router.get("/", async (req, res) => {
    if (!req.session.user) { //Session Invalid
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    res.status(200).json(await sfAccounts.get(limit, offset));
});
router.get("/count", async (req, res) => {
    if (!req.session.user) {
        //Session Invalid
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    res.status(200).json({ count: await sfAccounts.count() });
});
export default router;
//# sourceMappingURL=accounts.route.js.map