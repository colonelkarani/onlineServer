const mongoose = require('mongoose');

const connectDB = async ("mongodb://127.0.0.1:27017/schooldb") => {
  try {
    await mongoose.connect(DATABASE_URL);
    console.log("Database Connected ...");
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
