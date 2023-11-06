import express from "express";
import customerController from "../controllers/customer";
import checkCustomerAuth from "../middlewares/customer-auth.js";

const customerRoutes = express.Router();

// route level middleware
customerRoutes.use("/updateCustomer", checkCustomerAuth);
customerRoutes.use("/profileCustomer", checkCustomerAuth);
customerRoutes.use("/deleteCustomer", checkCustomerAuth);

// Public routes
customerRoutes.post("/register", customerController.customerRegistration);
customerRoutes.post("/login", customerController.customerLogin);
customerRoutes.post(
  "/sentResetPasswordEmail",
  customerController.sendCustomerPasswordResetEmail
);
customerRoutes.patch(
  "/resetPassword/:id/:token",
  customerController.customerPasswordReset
);

// protected routes
customerRoutes.delete("/deleteCustomer", customerController.deleteCustomer);
customerRoutes.patch("/updateCustomer", customerController.updateCustomer);
customerRoutes.get("/profileCustomer", customerController.profileCustomer);

// export
export default customerRoutes;
