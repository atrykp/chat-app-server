const mongoose = require("mongoose");
const connectDb = async () => {
  await mongoose.connect(
    process.env.MONGODB_LINK,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    },
    () => console.log("database connected...")
  );
};

module.exports = connectDb;
