import mongoose from "mongoose";
import data from "./data.js";
import Listing from "../model/listing.js";

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initDB = async () => {
  await Listing.deleteMany({});
  await Listing.insertMany(data);
  console.log("data was initialized successfully");
};

initDB();
