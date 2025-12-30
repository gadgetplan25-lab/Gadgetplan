const User = require("../models/user");
const OTP = require("../models/otp");
const Device = require("../models/device");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { sendEmail } = require("../utils/sendEmail");
const { generateTokens, generateCsrfToken } = require("../utils/tokenUtils");

// ======================================================
// 🔥 COOKIE CONFIG — NGROK + PRODUCTION COMPATIBLE
// ======================================================
const getCookieOptions = (req) => {
  const isNgrok = process.env.USE_NGROK === "true";
  const isProduction = process.env.NODE_ENV === "production";

  // Dynamic secure check: 
  // 1. Production always secure
  // 2. Req is secure (https)
  // 3. X-Forwarded-Proto is https (behind proxy/ngrok)
  const isSecure = isProduction || req.secure || req.headers["x-forwarded-proto"] === "https";

  return {
    httpOnly: true,
    secure: isSecure,
    sameSite: isSecure ? "none" : "lax",
  };
};

const getCsrfCookieOptions = (req) => {
  const opts = getCookieOptions(req);
  return {
    ...opts,
    httpOnly: false, // CSRF token must be readable by client
  };
};



exports.refreshToken = (req, res) => {
  try {
    const user = req.user;
    const { accessToken, refreshToken } = generateTokens(user);

    // access token
    res.cookie("token", accessToken, {
      ...getCookieOptions(req),
      maxAge: 15 * 60 * 1000,
    });

    // refresh token
    res.cookie("refreshToken", refreshToken, {
      ...getCookieOptions(req),
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // new CSRF token
    const csrfToken = generateCsrfToken();
    res.cookie("csrfToken", csrfToken, {
      ...getCsrfCookieOptions(req),
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ message: "Token refreshed", csrfToken });
  } catch (err) {
    console.error("Refresh error", err);
    res.status(500).json({ message: "Server error" });
  }
};

// helper buat deviceId
const getDeviceId = (req) => req.headers["user-agent"] + "_" + req.ip;

// ======================================================
// REGISTER
// ======================================================
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: "Email sudah terdaftar" });

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      city_id: req.body.city_id,
      postal_code: req.body.postal_code,
      isVerified: false,
    });

    // create OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    await OTP.create({
      userId: newUser.id,
      code: otpCode,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      type: "register",
    });

    // Try to send email with retry
    let emailSent = false;
    try {
      await sendEmail(
        email,
        "Kode OTP Verifikasi",
        null,
        `Halo ${newUser.name},\n\nKode OTP Anda: ${otpCode}\nBerlaku 5 menit.`
      );
      emailSent = true;
    } catch (emailError) {
      console.error("Email failed during registration:", emailError.message);
      // Continue registration process even if email fails
    }

    res.status(201).json({
      message: emailSent
        ? "User berhasil didaftarkan, silakan verifikasi OTP"
        : "User berhasil didaftarkan. Email gagal terkirim, silakan gunakan tombol 'Kirim Ulang OTP'",
      userId: newUser.id,
      emailSent
    });
  } catch (err) {
    console.error("Register error", err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const deviceId = getDeviceId(req);

    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.status(400).json({ message: "Email tidak ditemukan" });

    if (!user.isVerified)
      return res.status(403).json({ message: "Akun belum diverifikasi OTP" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Password salah" });

    // cek device
    let device = await Device.findOne({ where: { userId: user.id, deviceId } });
    const now = new Date();

    if (!device) {
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

      await OTP.create({
        userId: user.id,
        code: otpCode,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        type: "login",
      });

      // Try to send login OTP with retry
      let emailSent = false;
      try {
        await sendEmail(
          email,
          "Kode OTP Verifikasi Login",
          null,
          `Halo ${user.name},\n\nKode OTP Login Anda: ${otpCode}.`
        );
        emailSent = true;
      } catch (emailError) {
        console.error("Login OTP email failed:", emailError.message);
      }

      return res.status(403).json({
        message: emailSent
          ? "Device baru, OTP dikirim"
          : "Device baru. Email OTP gagal terkirim, silakan coba lagi atau hubungi admin",
        userId: user.id,
        emailSent
      });
    }

    // device old
    const diffDays = Math.floor((now - device.lastUsed) / (1000 * 60 * 60 * 24));
    if (diffDays > 7) {
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

      await OTP.create({
        userId: user.id,
        code: otpCode,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        type: "login",
      });

      // Try to send OTP for old device with retry
      let emailSent = false;
      try {
        await sendEmail(
          email,
          "Kode OTP Verifikasi Login",
          null,
          `Halo ${user.name},\n\nDevice Anda belum login selama >7 hari. Kode OTP Login: ${otpCode}.`
        );
        emailSent = true;
      } catch (emailError) {
        console.error("Old device OTP email failed:", emailError.message);
      }

      return res.status(403).json({
        message: emailSent
          ? "Device lama (>7 hari), OTP dikirim"
          : "Device lama (>7 hari). Email OTP gagal terkirim, silakan coba lagi",
        userId: user.id,
        emailSent
      });
    }

    device.lastUsed = now;
    await device.save();

    // create tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // set cookies (perbaikan dynamic options)
    const dynamicCookieOptions = getCookieOptions(req);
    const dynamicCsrfOptions = getCsrfCookieOptions(req);

    res.cookie("token", accessToken, {
      ...dynamicCookieOptions,
      maxAge: 60 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      ...dynamicCookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // csrf
    const csrfToken = generateCsrfToken();
    res.cookie("csrfToken", csrfToken, {
      ...dynamicCsrfOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "Login berhasil",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      csrfToken,
    });
  } catch (err) {
    console.error("Login error", err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

exports.resendOtp = async (req, res) => {
  try {
    const { userId, type } = req.body;

    if (!userId || !type)
      return res.status(400).json({ message: "userId dan type diperlukan" });

    const user = await User.findByPk(userId);
    if (!user)
      return res.status(404).json({ message: "User tidak ditemukan" });

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    await OTP.destroy({ where: { userId: user.id, type } });

    await OTP.create({
      userId: user.id,
      code: otpCode,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      type,
    });

    await sendEmail(
      user.email,
      "Kode OTP Baru",
      `Halo ${user.name},\n\nOTP baru Anda: ${otpCode}`
    );

    res.json({ message: "OTP baru dikirim ke email" });
  } catch (err) {
    console.error("resendOtp error", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.resendLoginOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const deviceId = getDeviceId(req);

    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.status(404).json({ message: "User tidak ditemukan" });

    if (!user.isVerified)
      return res.status(403).json({ message: "Akun belum diverifikasi" });

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    await OTP.destroy({ where: { userId: user.id, type: "login" } });

    await OTP.create({
      userId: user.id,
      code: otpCode,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      type: "login",
    });

    await sendEmail(
      user.email,
      "Kode OTP Login",
      `Halo ${user.name},\n\nKode OTP login Anda: ${otpCode}`
    );

    res.json({ message: "OTP login baru dikirim", userId: user.id });
  } catch (err) {
    console.error("resendLoginOtp error", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.logout = (req, res) => {
  // Clear all auth cookies with multiple options to ensure removal
  const cookieNames = ["token", "refreshToken", "csrfToken"];

  cookieNames.forEach(name => {
    // Clear with dynamic options
    const opts = name === "csrfToken" ? getCsrfCookieOptions(req) : getCookieOptions(req);
    res.clearCookie(name, opts);

    // Force clear with fallback options
    res.clearCookie(name, { path: "/" });
    res.clearCookie(name, { path: "/", secure: false, sameSite: "lax" });
    res.clearCookie(name, { path: "/", secure: true, sameSite: "none" });
  });

  console.log("🚪 User logged out, all cookies force-cleared");
  res.json({ message: "Logout berhasil" });
};

exports.checkEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.status(404).json({ message: "Email tidak ditemukan" });

    if (!user.isVerified)
      return res.status(403).json({ message: "Akun belum diverifikasi" });

    res.json({ message: "Email valid", email: user.email });
  } catch (err) {
    console.error("checkEmail error", err);
    res.status(500).json({ message: "Server error" });
  }
};
