import jwt from "jsonwebtoken";

const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      role: user.role,
      isPaid: user.isPaid,
      subscriptionStatus: user.subscriptionStatus,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    },
  );
};

const generateResetToken = (user) => {
  return jwt.sign({_id: user._id}, process.env.JWT_SECRET, {
    expiresIn: "30m",
  });
};

const expirationTime = () => {
  return Date.now() + 60 * 60 * 1000;
};

const checkTokenValidity = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token is valid. Payload:", decoded);
    return {valid: true, payload: decoded};
  } catch (err) {
    console.log("Token is invalid or expired:", err.message);
    return {valid: false, message: err.message};
  }
};

const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization && authorization.startsWith("Bearer ")) {
    // בדיקה בטוחה יותר
    const token = authorization.slice(7, authorization.length);
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        return res.status(401).send({message: "Token Expired or Invalid"});
      } else {
        req.user = decode;
        next();
      }
    });
  } else {
    res.status(401).send({message: "No Token Provided"});
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).send({message: "Access Denied"});
  }
};

const isUserOrAdmin = (req, res, next) => {
  // We expect isAuth to have run before this, so req.user exists
  if (!req.user) {
    return res.status(401).send({message: "No Token Found"});
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
  console.log(
    `IDOR Blocked: User ${req.user._id} tried to access resource for ${targetUserId}`,
  );
  return res.status(403).send({
    message:
      "Forbidden: You don't have permission to access or modify this resource",
  });
};

const decodeToken = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length);
    const id = jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(401).send({message: "Invalid Token"});
      } else {
        req.user = decode;
        return id;
      }
    });
  } else {
    res.status(401).send({message: "No Token"});
  }
};

export {
  generateToken,
  isAuth,
  isAdmin,
  isUserOrAdmin,
  decodeToken,
  expirationTime,
  generateResetToken,
  checkTokenValidity,
};
