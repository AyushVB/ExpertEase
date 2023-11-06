import express from "express";
import serviceProviderController from "../controllers/serviceProvider.js";
import checkServiceProviderAuth from "../middlewares/serviceProvider-auth.js";

const serviceProviderRoutes = express.Router();

// route level middleware
serviceProviderRoutes.use("/updateServiceProvider", checkServiceProviderAuth);
serviceProviderRoutes.use("/profileServiceProvider", checkServiceProviderAuth);
serviceProviderRoutes.use("/deleteServiceProvider", checkServiceProviderAuth);

// Public routes
serviceProviderRoutes.post(
  "/register",
  serviceProviderController.serviceProviderRegistration
);
serviceProviderRoutes.post(
  "/login",
  serviceProviderController.serviceProviderLogin
);
serviceProviderRoutes.post(
  "/sentResetPasswordEmail",
  serviceProviderController.sendServiceProviderPasswordResetEmail
);
serviceProviderRoutes.patch(
  "/resetPassword/:id/:token",
  serviceProviderController.serviceProviderPasswordReset
);

// protected routes
serviceProviderRoutes.delete(
  "/deleteServiceProvider",
  serviceProviderController.deleteServiceProvider
);
serviceProviderRoutes.patch(
  "/updateServiceProvider",
  serviceProviderController.updateServiceProvider
);
serviceProviderRoutes.get(
  "/profileServiceProvider",
  serviceProviderController.profileServiceProvider
);

// export
export default serviceProviderRoutes;
