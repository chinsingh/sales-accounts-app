import sfAccounts from "../services/sf-accounts.service";
import express, {Request, Response} from "express";
import userRepository from "../repositories/user.repository";


const router = express.Router();

router.get("/", async (req:Request, res:Response) => {
    if (!req.session.user) { //Session Invalid
        res.status(401).json({ error: "Unauthorized" });
        return; 
    }

    const limit:number = parseInt(req.query.limit as string) || 100; 
    const offset:number = parseInt(req.query.offset as string) || 0; 

    res.status(200).json(await sfAccounts.get(limit, offset));
});

router.get("/count", async (req: Request, res: Response) => {
  if (!req.session.user) {
    //Session Invalid
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  res.status(200).json({count: await sfAccounts.count()});
});

export default router;