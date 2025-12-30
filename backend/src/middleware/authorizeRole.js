// authorizeRole.js
module.exports = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Anda harus login" });
    }

    // cek apakah role sesuai
    if (req.user.role !== requiredRole) {
      return res.status(403).json({ message: "Akses ditolak, hanya admin yang bisa mengakses" });
    }

    next(); // lanjut ke controller
  };
};
