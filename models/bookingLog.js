import mongoose from "mongoose";

// Defination of schema
const bookingLogSchema = new mongoose.Schema({
  ratingValue: { type: Number, required: true },
  typeWork: { type: String, required: true, trim: true },
  workDescription: { type: String, required: true, trim: true },
  serviceProviderId: { type: String, required: true, trim: true },
  serviceProviderName: { type: String, required: true, trim: true },
  customerID: { type: String, required: true, trim: true },
  customerName: { type: String, required: true, trim: true },
  cost: { type: Number, required: true, trim: true },
  date: { type: Date, default: Date.now },
  status: { type: String, required: true, trim: true },
  paymentStatus: { type: String, required: true, trim: true },
});

// Model
const bookingLogModel = mongoose.model("bookingLog", bookingLogSchema);

// export
export default bookingLogModel;
