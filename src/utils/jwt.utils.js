import jwt from "jsonwebtoken";

const generateToken = (user) => {
  const payload = {
    user: {
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      age: user.age,
      role: user.role,
    },
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h" });
};

export default generateToken;
