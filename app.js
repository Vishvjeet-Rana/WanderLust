import express from "express";
import mongoose from "mongoose";
import Listing from "./model/listing.js";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import engine from "ejs-mate";
const app = express();

// __filename and __dirname setup:
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", engine);
app.use(express.static(path.join(__dirname, "/public")));

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

// all listings
app.get("/listings", async (req, res) => {
  let allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
});

// edit route
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
});

// update route
app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
});

// delete route
app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);

  res.redirect("/listings");
});

// create new list
app.get("/listings/new", (req, res) => {
  res.render("listings/createlist.ejs");
});

app.post("/listings", async (req, res) => {
  let newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
});

// show an individual list
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
});

//testing things
// app.get("/testing", async (req, res) => {
//   const sampleTesting = new Listing({
//     title: "My new villa",
//     description: "Near beach",
//     price: 1200000,
//     location: "Near juhu beach, Mumbai",
//     country: "India",
//   });

//   await sampleTesting.save();
//   console.log("data added in DB"), res.send("successfully testing done");
// });

app.get("/", (req, res) => {
  res.send("hello this is root");
});

app.listen(8080, () => {
  console.log(`app listening at port 8080`);
});
