import express from "express";
import bookingController from "../controllers/bookingController.js";
import checkBookingLogAuth from "../middlewares/bookingLog-auth.js";
import checkCustomerAuth from "../middlewares/customer-auth.js";

const bookingRoutes = express.Router();

// route level middleware
bookingRoutes.use("/bookAppointment", checkCustomerAuth);
bookingRoutes.use("/update", checkBookingLogAuth);
bookingRoutes.use("/delete", checkCustomerAuth);
bookingRoutes.use("/filter", checkBookingLogAuth);

// protected routes
bookingRoutes.post("/bookAppointment", bookingController.bookAppointment);
bookingRoutes.patch("/update", bookingController.update);
bookingRoutes.delete("/delete", bookingController.delete);
bookingRoutes.get("/filter", bookingController.filter);

// export
export default bookingRoutes;
