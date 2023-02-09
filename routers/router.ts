import { Router } from "express";
import fetch from "node-fetch";
export const router = Router();



router.post("/", async (req, res:any)=> {
  const address = req.body.address;
  const city = req.body.city;
  const postalCode = req.body.postalCode;
  const data = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${address}+${city}+${postalCode}&key=${process.env.GOOGLE_API}`
  );
  if (!data.ok) {
    /* Handle */
    throw new Error('Something went wrong, try again.')
  }
  if (data.body !== null) {

    const finalData:any = await data.json();
    if (
      finalData.status === "ZERO_RESULTS" ||
      finalData.results[0].geometry.location_type === "APPROXIMATE" ||
      finalData.results[0].address_components[0].types[0] !== "street_number"
    ) {
      res.send("please enter a valid address");
      return;
    }

        let Arr1 = Array()
        let Arr2 = Array()
finalData.results[0].address_components.filter((d: { long_name: any; }) => Arr1.push(d.long_name))
finalData.results[0].address_components.filter((d: { types: any; }) => Arr2.push(d.types))

// let newArr2:any[] = [].concat(...Arr2)
const obj:any = {};
Arr2.forEach((element, index) => {
  obj[element] = Arr1[index];
});
obj['addressNumber'] = obj['street_number']
obj['country'] = obj['country,political']
obj['address'] = obj['route']
obj['postalCode'] = obj['postal_code']
obj['city'] = obj['locality,political']
obj['region'] = obj['administrative_area_level_3,political']
obj['region2'] = obj['administrative_area_level_1,political']
obj['province'] = obj['administrative_area_level_2,political']
delete obj['street_number']
delete obj['country,political']
delete obj['route']
delete obj['postal_code']
delete obj['locality,political']
delete obj['administrative_area_level_3,political']
delete obj['administrative_area_level_1,political']
delete obj['administrative_area_level_2,political']
res.json(obj)
}});
