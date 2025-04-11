import Listing from "../model/listing.js";

export const index = async (req, res) => {
  let allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

export const newFormRoute = (req, res) => {
  // console.log(req.user);

  res.render("listings/createlist.ejs");
};

export const editRoute = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for doesn't exists !");
    return res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
};

export const updateRoute = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  req.flash("success", "Listing Updated Successfully!");
  res.redirect(`/listings/${id}`); // Fix template string syntax
};

export const deleteRoute = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted");
  res.redirect("/listings");
};

export const createNewList = async (req, res) => {
  let newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

export const showList = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for doesn't exists !");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing });
};
