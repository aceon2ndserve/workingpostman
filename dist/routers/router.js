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
        // const findAddress = finalData.results[0].address_components.types.find((data: { types: string; }) => {data.types = 'route', data.types = 'locality',data.types = 'street_number',data.types = 'country',data.types = 'postal_code'} )
        // const findCity = finalData.results[0].address_components.find((data: { types: string; }) => data.types = 'locality' )
        // const findNumber = finalData.results[0].address_components.find((data: { types: string; }) => data.types = 'street_number' )
        // const findCountry = finalData.results[0].address_components.find((data: { types: string; }) => data.types = 'country' )
        // const findPostalCode = finalData.results[0].address_components.find((data: { types: string; }) => data.types = 'postal_code' )
        // const result = {addressLine: findAddress.long_name,addressNumber:findNumber.long_name,postalCode:findPostalCode.long_name,city:findCity.long_name,country: findCountry.long_name}
        let Arr1 = Array();
        let Arr2 = Array();
        const testJson = finalData.results[0].address_components.filter((d) => Arr1.push(d.long_name));
        const testJson2 = finalData.results[0].address_components.filter((d) => Arr2.push(d.types));
        // let newArr2:any[] = [].concat(...Arr2)
        const obj = {};
        Arr2.forEach((element, index) => {
            obj[element] = Arr1[index];
        });
        obj['addressNumber'] = obj['street_number'];
        obj['country'] = obj['country,political'];
        obj['address'] = obj['route'];
        obj['postalCode'] = obj['postal_code'];
        obj['city'] = obj['locality,political'];
        obj['region'] = obj['administrative_area_level_3,political'];
        obj['region2'] = obj['administrative_area_level_1,political'];
        obj['province'] = obj['administrative_area_level_2,political'];
        delete obj['street_number'];
        delete obj['country,political'];
        delete obj['route'];
        delete obj['postal_code'];
        delete obj['locality,political'];
        delete obj['administrative_area_level_3,political'];
        delete obj['administrative_area_level_1,political'];
        delete obj['administrative_area_level_2,political'];
        res.json(obj);
    }
});
