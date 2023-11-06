// name,email,password,phoneNo,localAddress,city,district,state,pinCode,photoURL,profession
import serviceProviderModel from "../models/serviceProviders.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import transporter from "../config/emailConfig.js";
import dotenv from "dotenv";

dotenv.config();
const resetLink = `http://localhost:3000/api/serviceProvider/reset/`;
class serviceProviderController {
  static serviceProviderRegistration = async (req, res) => {
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
        profession,
      } = req.body;
      const serviceProvider = await serviceProviderModel.findOne({
        email: email,
      });
      if (serviceProvider) {
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
          photoURL &&
          profession
        )
      ) {
        res.send({
          status: "failed",
          message: "All fields are required...",
        });
      } else {
        const salt = await bcrypt.genSalt(12);
        const hashPassword = await bcrypt.hash(password, salt);

        const newServiceProvider = new serviceProviderModel({
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
          profession: profession,
        });
        await newServiceProvider.save();

        // JWT create
        const saved_serviceProvider = await serviceProviderModel.findOne({
          email: email,
        });
        const token = jwt.sign(
          {
            serviceProviderID: saved_serviceProvider._id,
            type: "serviceProvider",
          },
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
  static serviceProviderLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      const serviceProvider = await serviceProviderModel.findOne({
        email: email,
      });
      if (!serviceProvider) {
        res.status(400).send({
          status: "failed",
          message: "You are not register serviceProvider..",
        });
      } else if (!(email && password)) {
        res.send({ status: "failed", message: "All fields are required" });
      } else {
        const ismatch = await bcrypt.compare(
          password,
          serviceProvider.password
        );
        if (!ismatch) {
          res.status(400).send({
            status: "failed",
            message: "Email or Password is invalid",
          });
        } else {
          // JWT create
          const token = jwt.sign(
            { serviceProviderID: serviceProvider._id, type: "serviceProvider" },
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
  static updateServiceProvider = async (req, res) => {
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
        profession,
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
        const serviceProvider = await serviceProviderModel.findOne({
          email: email,
        });
        if (serviceProvider) {
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
      if (!(typeof profession == "undefined" || profession)) {
        return res.send({
          status: "failed",
          message: "profession field not to be null ....",
        });
      }
      await serviceProviderModel.findByIdAndUpdate(req.serviceProvider._id, {
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
          profession: profession,
        },
      });
      res.send({
        status: "success",
        message: "serviceProvider updated successfully...",
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        status: "failed",
        message: "Unable to update serviceProvider...",
      });
    }
  };
  static profileServiceProvider = async (req, res) => {
    try {
      res.send({ serviceProvider: req.serviceProvider });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        status: "failed",
        message: "Unable to get logged serviceProvider profile...",
      });
    }
  };
  static sendServiceProviderPasswordResetEmail = async (req, res) => {
    try {
      const { email } = req.body;
      const serviceProvider = await serviceProviderModel.findOne({
        email: email,
      });
      if (!email) {
        res.send({ status: "failed", message: "email field is required..." });
      } else if (!serviceProvider) {
        res.send({ status: "failed", message: "email doesnt exists" });
      } else {
        const secret = serviceProvider._id + process.env.JWT_SECRET_KEY;
        const token = jwt.sign(
          { serviceProviderID: serviceProvider._id },
          secret,
          {
            expiresIn: "15m",
          }
        );
        const link = `${resetLink}?id=${serviceProvider._id}&token=${token}`;

        // sent email
        const info = transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: serviceProvider.email,
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
        message: "Unable to send serviceProvider password reset email...",
      });
    }
  };
  static serviceProviderPasswordReset = async (req, res) => {
    try {
      const { password } = req.body;
      const { id, token } = req.params;
      const serviceProvider = await serviceProviderModel.findById(id);
      const secret = serviceProvider._id + process.env.JWT_SECRET_KEY;
      jwt.verify(token, secret);
      if (!password) {
        res.send({ status: "failed", message: "Password field is required" });
      } else {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        await serviceProviderModel.findByIdAndUpdate(serviceProvider._id, {
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
  static deleteServiceProvider = async (req, res) => {
    try {
      const serviceProvider = req.serviceProvider;

      await serviceProviderModel.findByIdAndDelete(serviceProvider._id);
      res.send({
        status: "success",
        message: "Delete serviceProvider successfully...",
      });
    } catch (error) {
      console.log(error);
      res.send({
        status: "failed",
        message: "Unable to delete serviceProvider....",
      });
    }
  };
}

export default serviceProviderController;
