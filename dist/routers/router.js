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
        // console.log(finalData);
        res.json({ addressByUser: address, cityByUser: city, postalCodeByUser: postalCode, formattedAddress: finalData.results[0].formatted_address });
    }
});
