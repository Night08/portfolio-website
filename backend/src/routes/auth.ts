import express, { Request, Response } from "express";
import User from "../models/User";
import { body, validationResult } from "express-validator";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import fetchUser from "../middlewares/fetchUser";

const router = express.Router();

// let JWT_SECRET = process.env.JWT_SECRET_KEY; // will be kept in env variable
let JWT_SECRET = "temporary secret key";

// ROUTE 1: Create a user using: POST "api/auth/createuser" - No login required
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name (min length: 3)").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must have minimum of 8 characters").isLength({
      min: 8,
    }),
  ],
  async (req: Request, res: Response) => {
    let success = false;
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ success, errors: result.array() });
    }

    try {
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
        return res
          .status(400)
          .json({
            success,
            error: "Sorry, a user with this email already exists",
          });
      }

      const salt = await bcryptjs.genSalt(10);
      const securePass = await bcryptjs.hash(req.body.password, salt);

      const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: securePass,
      });

      const data = { user: { id: user.id } };
      const authtoken = jwt.sign(data, JWT_SECRET);

      success = true;
      res.json({ success, authtoken });
    } catch (err) {
      res.status(500).send("Internal server error");
    }
  }
);

// ROUTE 2: Authenticate a user using: POST "api/auth/login" - No login required
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req: Request, res: Response) => {
    let success = false;
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ success, errors: result.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({
            success,
            error: "Please try to login with correct credentials",
          });
      }

      const passwordCompare = await bcryptjs.compare(password, user.password);
      if (!passwordCompare) {
        return res
          .status(400)
          .json({
            success,
            error: "Please try to login with correct credentials",
          });
      }

      const data = { user: { id: user.id } };
      const authtoken = jwt.sign(data, JWT_SECRET);

      success = true;
      res.json({ success, authtoken });
    } catch (err) {
      res.status(500).send("Internal server error");
    }
  }
);

// ROUTE 3: Get logged-in user details using: POST "api/auth/getuser" - Login required
router.get(
  "/getuser",
  fetchUser,
  async (req: Request & { user?: { id: string } }, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(400).json({ error: "User ID not found" });
      }
      const user = await User.findById(userId).select("-password");
      res.json(user);
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal server error");
    }
  }
);

router.get("/getAllUsers", async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error");
  }
});

router.put("/updateuser/:id", async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { role, canCollaborate, requestedToCollaborate } = req.body;

    // Find the user by ID and update the specified fields
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          role,
          canCollaborate,
          requestedToCollaborate,
        },
      },
      { new: true, runValidators: true } // Return the updated document and run validators
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

export default router;
