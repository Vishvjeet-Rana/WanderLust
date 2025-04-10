import mongoose from "mongoose";
import data from "./data.js";
import Listing from "../model/listing.js";

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initDB = async () => {
  await Listing.deleteMany({});
  let updatedData = data.map((obj) => ({
    ...obj,
    owner: "67f7c3f2f2ce8b381babcb9c",
  }));
  await Listing.insertMany(updatedData);
  console.log("data was initialized successfully");
};

initDB();
