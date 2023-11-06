import jwt from "jsonwebtoken";

const checkBookingLogAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!(authorization && authorization.startsWith("Bearer"))) {
    res
      .status(401)
      .send({ status: "failed", message: "Unauthorized bookingLog" });
  } else {
    const token = await authorization.split(" ")[1];

    // verify token
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, bookingLog) => {
      if (err) {
        return res
          .status(403)
          .send({ status: "failed", message: "Authentication refused" });
      }

      req.bookingLog = bookingLog;
      if (!req.bookingLog) {
        return res.status(403).send({
          status: "failed",
          message: "Unauthorized bookingLog ",
        });
      }
      next();
    });
  }
};

export default checkBookingLogAuth;
