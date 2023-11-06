import jwt from "jsonwebtoken";
import customerModel from "../models/customers.js";

const checkCustomerAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!(authorization && authorization.startsWith("Bearer"))) {
    res
      .status(401)
      .send({ status: "failed", message: "Unauthorized customer" });
  } else {
    const token = await authorization.split(" ")[1];

    // verify token
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, customer) => {
      if (err) {
        return res
          .status(403)
          .send({ status: "failed", message: "Authentication refused" });
      }
      if (!(customer.type === "customer")) {
        return res
          .status(403)
          .send({ status: "failed", message: "Authentication refused" });
      }
      req.customer = await customerModel
        .findById(customer.customerID)
        .select("-password");
      if (!req.customer) {
        return res
          .status(403)
          .send({ status: "failed", message: "Unauthorized customer " });
      }
      next();
    });
  }
};

export default checkCustomerAuth;
