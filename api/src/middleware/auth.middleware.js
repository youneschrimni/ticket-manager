import jwt from "jsonwebtoken";

export default function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const [type, token] = header.split(" ");

  // 1) Vérifie présence du token
  if (type !== "Bearer" || !token) {
    return res.status(401).json({ message: "Missing token" });
  }

  try {
    // 2) Vérifie signature + expiration
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // 3) On stocke l'identité du user pour les routes suivantes
    req.user = { id: payload.sub, email: payload.email };

    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
