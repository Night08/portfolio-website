import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

// Define an interface for the JWT payload
interface CustomJwtPayload extends JwtPayload {
  user: {
    id: string; //  id is a string
  };
}

// Define an interface for the request to add the user property
interface AuthenticatedRequest extends Request {
  user?: {
    id: string; // Ensure this matches the structure used in JWT payload
    name?: string;
    email?: string;
    password?: string;
    role?: string;
    canCollaborate?: boolean;
  };
}

// let JWT_SECRET = process.env.JWT_SECRET_KEY;

let JWT_SECRET = "temporary secret key"; // will be kept in env variable

const fetchUser = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("authorization");

  if (!token) {
    return res
      .status(401)
      .send({ error: "Please authenticate using a valid token" });
  }

  try {
    const data = jwt.verify(token, JWT_SECRET) as CustomJwtPayload;
    req.user = data.user;
    next();
  } catch (err) {
    res.status(401).send({ error: "Please authenticate using a valid token" });
  }
};
export default fetchUser;
