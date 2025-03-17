import express, {Request, Response} from "express";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import userRepository from "../repositories/user.repository.js";

dotenv.config();

const router = express.Router();


router.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }
    
    // Check if user already exists
    const existingUser = await userRepository.getUserByEmail(email);
    if (existingUser) {
      res.status(409).json({ error: "User with this email already exists" });
      return;
    }
    
    const passwordHash = await bcrypt.hash(password, 10);
    
    const user = await userRepository.createUser(email, passwordHash);
    
    res.status(201).json({ 
      message: "User registered successfully",
      user: { email: user.email }
    });
  } 
  catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password , rememberMe} = req.body;
    

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const user = await userRepository.getUserByEmail(email);
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    
    res.status(200).json({
      message: "Login successful",
      user: { email: user.email }
    });
    req.session.user = { email: user.email } ;
    req.session.save((err)=>{});
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/logout", function (req, res, next) {
  req.session.user = null;
  req.session.save(function (err) {
    if (err) next(err);

    req.session.regenerate(function (err) {
      if (err) next(err);
    });

    res.status(200).json(({message: "Logged out"}));
  });
});

router.delete("/", async function (req, res, next) {
   if (!req.session.user) {
     //Session Invalid
     res.status(401).json({ error: "Unauthorized" });
     return;
   }

  try {
    const isDeleted = await userRepository.getUserByEmail(req.session.user.email);
    req.session.user = null;
    req.session.save(function (err) {
      if (err) next(err);

      req.session.regenerate(function (err) {
        if (err) next(err);
      });
    });
    res.status(200).json({ message: "Logged out" });
  }
  catch (error){
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });    
  }
});


router.get("/validate-session", async (req: Request, res: Response) => {
  if (!req.session.user) {
    //Session Invalid
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  res.status(200).json({
    valid: true,
  });

});

export default router;