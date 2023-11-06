// name,email,password,phoneNo,localAddress,city,district,state,pinCode,photoURL
import customerModel from "../models/customers.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import transporter from "../config/emailConfig.js";
import dotenv from "dotenv";

dotenv.config();
const resetLink = `http://localhost:3000/api/customer/reset/`;
class customerController {
  static customerRegistration = async (req, res) => {
    try {
      const {
        name,
        email,
        password,
        phoneNo,
        localAddress,
        city,
        district,
        state,
        pinCode,
        photoURL,
      } = req.body;
      const customer = await customerModel.findOne({ email: email });
      if (customer) {
        res.send({ status: "failed", message: "Email already exists" });
      } else if (
        !(
          name &&
          email &&
          password &&
          phoneNo &&
          localAddress &&
          city &&
          district &&
          state &&
          pinCode &&
          photoURL
        )
      ) {
        res.send({
          status: "failed",
          message: "All fields are required...",
        });
      } else {
        const salt = await bcrypt.genSalt(12);
        const hashPassword = await bcrypt.hash(password, salt);

        const newCustomer = new customerModel({
          name: name,
          email: email,
          password: hashPassword,
          phoneNo: phoneNo,
          localAddress: localAddress,
          city: city,
          district: district,
          state: state,
          pinCode: pinCode,
          photoURL: photoURL,
        });
        await newCustomer.save();

        // JWT create
        const saved_customer = await customerModel.findOne({ email: email });
        const token = jwt.sign(
          { customerID: saved_customer._id, type: "customer" },
          process.env.JWT_SECRET_KEY,
          { expiresIn: "1d" }
        );
        res.status(201).send({
          status: "Success",
          message: "registeration sucessfully....",
          token: token,
        });
      }
    } catch (error) {
      console.log(error);
      res.send({ status: "failed", message: "Unable to register...." });
    }
  };
  static customerLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      const customer = await customerModel.findOne({ email: email });
      if (!customer) {
        res.status(400).send({
          status: "failed",
          message: "You are not register customer..",
        });
      } else if (!(email && password)) {
        res.send({ status: "failed", message: "All fields are required" });
      } else {
        const ismatch = await bcrypt.compare(password, customer.password);
        if (!ismatch) {
          res.status(400).send({
            status: "failed",
            message: "Email or Password is invalid",
          });
        } else {
          // JWT create
          const token = jwt.sign(
            { customerID: customer._id, type: "customer" },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1d" }
          );
          res.send({
            status: "success",
            message: "login successfully...",
            token: token,
          });
        }
      }
    } catch (error) {
      console.log(error);
      res.status(400).send({ status: "failed", message: "Unable to login..." });
    }
  };
  static updateCustomer = async (req, res) => {
    try {
      let {
        name,
        email,
        password,
        phoneNo,
        localAddress,
        city,
        district,
        state,
        pinCode,
        photoURL,
      } = req.body;

      if (!(typeof name == "undefined" || name)) {
        return res.send({
          status: "failed",
          message: "name field not to be null ....",
        });
      }
      if (!(typeof email == "undefined" || email)) {
        return res.send({
          status: "failed",
          message: "email field not to be null ....",
        });
      } else {
        const customer = await customerModel.findOne({ email: email });
        if (customer) {
          res.send({
            status: "failed",
            message: "Email already exists or you give same email id",
          });
        }
      }
      if (!(typeof password == "undefined" || password)) {
        return res.send({
          status: "failed",
          message: "password field not to be null ....",
        });
      } else {
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);
      }
      if (!(typeof phoneNo == "undefined" || phoneNo)) {
        return res.send({
          status: "failed",
          message: "phoneNo field not to be null ....",
        });
      }
      if (!(typeof localAddress == "undefined" || localAddress)) {
        return res.send({
          status: "failed",
          message: "localAddress field not to be null ....",
        });
      }
      if (!(typeof city == "undefined" || city)) {
        return res.send({
          status: "failed",
          message: "city field not to be null ....",
        });
      }
      if (!(typeof district == "undefined" || district)) {
        return res.send({
          status: "failed",
          message: "district field not to be null ....",
        });
      }
      if (!(typeof state == "undefined" || state)) {
        return res.send({
          status: "failed",
          message: "state field not to be null ....",
        });
      }
      if (!(typeof pinCode == "undefined" || pinCode)) {
        return res.send({
          status: "failed",
          message: "pinCode field not to be null ....",
        });
      }
      if (!(typeof photoURL == "undefined" || photoURL)) {
        return res.send({
          status: "failed",
          message: "photoURL field not to be null ....",
        });
      }

      await customerModel.findByIdAndUpdate(req.customer._id, {
        $set: {
          name: name,
          email: email,
          password: hashPassword,
          phoneNo: phoneNo,
          localAddress: localAddress,
          city: city,
          district: district,
          state: state,
          pinCode: pinCode,
          photoURL: photoURL,
        },
      });
      res.send({
        status: "success",
        message: "customer updated successfully...",
      });
    } catch (error) {
      console.log(error);
      res
        .status(400)
        .send({ status: "failed", message: "Unable to update customer..." });
    }
  };
  static profileCustomer = async (req, res) => {
    try {
      res.send({ customer: req.customer });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        status: "failed",
        message: "Unable to get logged customer profile...",
      });
    }
  };
  static sendCustomerPasswordResetEmail = async (req, res) => {
    try {
      const { email } = req.body;
      const customer = await customerModel.findOne({ email: email });
      if (!email) {
        res.send({ status: "failed", message: "email field is required..." });
      } else if (!customer) {
        res.send({ status: "failed", message: "email doesnt exists" });
      } else {
        const secret = customer._id + process.env.JWT_SECRET_KEY;
        const token = jwt.sign({ customerID: customer._id }, secret, {
          expiresIn: "15m",
        });
        const link = `${resetLink}?id=${customer._id}&token=${token}`;

        // sent email
        const info = transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: customer.email,
          subject: "API-Password Reset Link",
          html: `<a href=${link}>click here</a>to reset your password`,
        });
        res.send({
          status: "success",
          message: "password reset email is sent....please check email.. ",
          info: info,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(400).send({
        status: "failed",
        message: "Unable to send customer password reset email...",
      });
    }
  };
  static customerPasswordReset = async (req, res) => {
    try {
      const { password } = req.body;
      const { id, token } = req.params;
      const customer = await customerModel.findById(id);
      const secret = customer._id + process.env.JWT_SECRET_KEY;
      jwt.verify(token, secret);
      if (!password) {
        res.send({ status: "failed", message: "Password field is required" });
      } else {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        await customerModel.findByIdAndUpdate(customer._id, {
          $set: { password: hashPassword },
        });
        res.send({
          status: "success",
          message: "password reset successfully...",
        });
      }
    } catch (error) {
      console.log(error);
      res.send({ status: "failed", message: "Invalid token or id" });
    }
  };
  static deleteCustomer = async (req, res) => {
    try {
      const customer = req.customer;

      await customerModel.findByIdAndDelete(customer._id);
      res.send({
        status: "success",
        message: "Delete customer successfully...",
      });
    } catch (error) {
      console.log(error);
      res.send({ status: "failed", message: "Unable to delete customer...." });
    }
  };
}

export default customerController;
