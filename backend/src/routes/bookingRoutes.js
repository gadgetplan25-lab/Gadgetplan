const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const { verifyToken } = require("../middleware/authMiddleware");
// CSRF Protection removed
router.use(verifyToken);

router.post("/", bookingController.createBooking);
router.get("/getBookings", bookingController.getUserBookings);
router.get("/detail/:id", bookingController.getUserBookingDetail); // New route
router.delete("/:id", bookingController.deleteBooking);
router.put("/:id/status/booking", bookingController.updateBookingStatus);
router.put("/:id/status/payment", bookingController.updatePaymentStatus);
router.get("/slots/:date/:technicianId", bookingController.getBookingSlots);
router.get("/by-date/:date", bookingController.getBookingByDate);


module.exports = router;