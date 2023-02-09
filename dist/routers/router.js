import { Router } from "express";
import fetch from "node-fetch";
export const router = Router();
router.post("/", async (req, res) => {
    const address = req.body.address;
    const city = req.body.city;
    const postalCode = req.body.postalCode;
    const data = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}+${city}+${postalCode}&key=${process.env.GOOGLE_API}`);
    if (!data.ok) {
        /* Handle */
    }
    // If you care about a response:
    if (data.body !== null) {
        // body is ReadableStream<Uint8Array>
        // parse as needed, e.g. reading directly, or
        // and further:
        // const finalData = await data.json().then((data) => console.log(data));
        const finalData = await data.json();
        if (finalData.status === "ZERO_RESULTS" ||
            finalData.results[0].geometry.location_type === "APPROXIMATE" ||
            finalData.results[0].address_components[0].types[0] !== "street_number") {
            res.send("please enter a valid address");
            return;
        }
        const result = { addressLine: finalData.results[0].address_components[1].long_name, addressNumber: finalData.results[0].address_components[0].long_name, postalCode: finalData.results[0].address_components[5].long_name, city: finalData.results[0].address_components[2].long_name, region: finalData.results[0].address_components[3].long_name, country: finalData.results[0].address_components[4].long_name };
        res.json(result);
    }
});
