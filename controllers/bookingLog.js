import bookingLogModel from "../models/bookingLog.js";
import serviceProviderModel from "../models/serviceProvider.js";
// ratingValue,typeWork,workDescription,serviceProviderId,serviceProviderName,customerID,customerName,cost,date,status,paymentStatus
class bookingLogController {
  static bookAppointment = async (req, res) => {
    try {
      var {
        // ratingValue,
        // typeWork,
        workDescription,
        serviceProviderId,
        // serviceProviderName,
        // customerID,
        // customerName,
        // cost,
        date,
        // status,
      } = req.body;
      const serviceProvider = await serviceProviderModel.findById(
        serviceProviderId
      );
      if (!serviceProvider) {
        return res.status(400).send({
          status: "failed",
          message: "serviceProvider id is invalid",
        });
      }
      if (!workDescription) {
        res.send({
          status: "failed",
          message: "work description field is required...",
        });
      }
      if (date) {
        date = new Date(date);
      } else {
        date = new Date();
      }
      const newBookingLog = new bookingLogModel({
        ratingValue: 0,
        typeWork: serviceProvider.profession,
        workDescription: workDescription,
        serviceProviderId: serviceProviderId,
        serviceProviderName: serviceProvider.name,
        customerID: req.customer._id,
        customerName: req.customer.name,
        cost: -1,
        date: date,
        status: registered,
      });
      await newBookingLog.save();
      res.send({
        status: "Success",
        message: "book appointment successfully...",
      });
    } catch (error) {
      console.log(error);
      res.send({ status: "failed", message: "Unable to book appointment...." });
    }
  };
  static update = async (req, res) => {
    try {
    } catch (error) {
      console.log(error);
      res.send({
        status: "failed",
        message: "Unable to update appointment....",
      });
    }
  };
  static delete = async (req, res) => {
    try {
    } catch (error) {
      console.log(error);
      res.send({
        status: "failed",
        message: "Unable to delete appointment....",
      });
    }
  };
  static filter = async (req, res) => {
    try {
    } catch (error) {
      console.log(error);
      res.send({
        status: "failed",
        message: "Unable to get filter appointment....",
      });
    }
  };
}
export default bookingLogController;
