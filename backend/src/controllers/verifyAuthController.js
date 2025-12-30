const User = require("../models/user");
const OTP = require("../models/otp");
const Device = require("../models/device");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "1h";
const getDeviceId = (req) => req.headers["user-agent"] + "_" + req.ip;

exports.verifyRegisterOTP = async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "User tidak ditemukan" });
    }

    const otp = await OTP.findOne({ where: { userId: user.id, code } });

    if (!otp || otp.expiresAt < new Date()) {
      return res.status(400).json({ message: "OTP tidak valid atau sudah kadaluarsa" });
    }

    await User.update({ isVerified: true }, { where: { id: user.id } });
    await otp.destroy();

    return res.json({ success: true, message: "Verifikasi berhasil, silakan login" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};


exports.verifyLoginOTP = async (req, res) => {
  try {
    const { userId, code } = req.body;
    const deviceId = getDeviceId(req);

    const otp = await OTP.findOne({ where: { userId, code } });
    if (!otp || otp.expiresAt < new Date()) {
      return res.status(400).json({ message: "OTP tidak valid atau sudah kadaluarsa" });
    }

    const user = await User.findByPk(userId);

    // simpan device kalau baru
    let device = await Device.findOne({ where: { userId: user.id, deviceId } });
    if (!device) {
      device = await Device.create({ userId: user.id, deviceId, lastUsed: new Date() });
    } else {
      device.lastUsed = new Date();
      await device.save();
    }

    // hapus otp
    await otp.destroy();

    // generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.json({
      message: "Login berhasil setelah OTP",
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};