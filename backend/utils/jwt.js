import jwt from "jsonwebtoken";

const generateToken = (user) => {
  return jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
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

export { generateToken, isAuth, decodeToken, expirationTime,generateResetToken ,checkTokenValidity};
