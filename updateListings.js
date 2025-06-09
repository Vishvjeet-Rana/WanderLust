// updateListings.js - Run this script once to fix existing listings
import Listing from "./model/listing.js";
import mbxGeocoding from "@mapbox/mapbox-sdk/services/geocoding.js";
import mongoose from "mongoose";

const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

async function updateListingsWithCoordinates() {
  try {
    // Connect to your database
    await mongoose.connect(process.env.ATLASDB_URL);
    console.log("Connected to database");

    // Find all listings with empty coordinates
    const listingsWithoutCoords = await Listing.find({
      $or: [
        { geometry: { $exists: false } },
        { "geometry.coordinates": { $size: 0 } },
        { "geometry.coordinates": { $exists: false } },
      ],
    });

    console.log(
      `Found ${listingsWithoutCoords.length} listings without coordinates`
    );

    for (let listing of listingsWithoutCoords) {
      try {
        console.log(
          `Updating listing: ${listing.title} in ${listing.location}`
        );

        let response = await geocodingClient
          .forwardGeocode({
            query: listing.location,
            limit: 1,
          })
          .send();

        let geoData = response.body.features[0];
        if (geoData) {
          listing.geometry = geoData.geometry;
          await listing.save();
          console.log(
            `✓ Updated ${listing.title} with coordinates: ${geoData.geometry.coordinates}`
          );
        } else {
          console.log(`✗ No coordinates found for ${listing.location}`);
        }

        // Add a small delay to avoid hitting rate limits
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        console.log(`Error updating ${listing.title}: ${error.message}`);
      }
    }

    console.log("Finished updating listings");
    process.exit(0);
  } catch (error) {
    console.error("Script error:", error);
    process.exit(1);
  }
}

updateListingsWithCoordinates();
