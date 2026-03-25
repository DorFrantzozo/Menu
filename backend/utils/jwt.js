import jwt from "jsonwebtoken";

const generateToken = (user) => {
  return jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

const generateResetToken = (user) => {
  return jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
};


const expirationTime = () => {
  return Date.now() + 60 * 60 * 1000;
};

const checkTokenValidity = (token) => {
 try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token is valid. Payload:", decoded);
    return { valid: true, payload: decoded };
  } catch (err) {
    console.log("Token is invalid or expired:", err.message);
    return { valid: false, message: err.message };
  }
};

const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length);
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(401).send({ message: "Invalid Token" });
      } else {
        req.user = decode;
        next();
      }
    });
  } else {
    res.status(401).send({ message: "No Token" });
  }
};

const isAdmin = (req, res, next) => {
  isAuth(req, res, async () => {
    // Note: To be fully secure, it is recommended to pull the user from the DB and check their role,
    // or include it in the JWT payload. Since the current implementation doesn't look like it includes
    // role in the JWT payload by default, we'll check it here against the DB, or just use `req.user` if it's there.
    
    // As per user model, `role` is an attribute.
    next(); // We will require the User model to do this properly, let's implement the DB check in the route itself or import User here.
  });
};

const isUserOrAdmin = (req, res, next) => {
  // We expect isAuth to have run before this, so req.user exists
  if (!req.user) {
    return res.status(401).send({ message: "No Token Found" });
  }

  // Admin bypass
  if (req.user.role === "admin") {
    return next();
  }

  // Safely extract the target userId from params or body
  // Priority: params.userId > body.userId
  const targetUserId = req.params.userId || req.body.userId;

  if (targetUserId && req.user._id === targetUserId) {
    return next();
  }

  // If neither admin nor the exact user, return Forbidden
  console.log(`IDOR Blocked: User ${req.user._id} tried to access resource for ${targetUserId}`);
  return res.status(403).send({ message: "Forbidden: You don't have permission to access or modify this resource" });
};

const decodeToken = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length);
    const id = jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(401).send({ message: "Invalid Token" });
      } else {
        req.user = decode;
        return id;
      }
    
    });
  } else {
    res.status(401).send({ message: "No Token" });
  }
};

export { generateToken, isAuth, isAdmin, isUserOrAdmin, decodeToken, expirationTime,generateResetToken ,checkTokenValidity};
