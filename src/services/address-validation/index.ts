import axios from 'axios';

export async function addressCallback(req: any, res: any) {
  const address = req.body.address;
  const city = req.body.city;
  const postalCode = req.body.postalCode;
  const axiosResponse = await axios(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${address}+${city}+${postalCode}&key=${process.env.GOOGLE_API}`
  );

  const { data } = axiosResponse;

  if (axiosResponse.status !== 200) {
    /* Handle */
    throw new Error("Something went wrong, try again.");
  }
  if (data.body !== null) {
    const finalData: any = await data.json();
    if (
      finalData.status === "ZERO_RESULTS" ||
      finalData.results[0].geometry.location_type === "APPROXIMATE" ||
      finalData.results[0].address_components[0].types[0] !== "street_number"
    ) {
      res.send("please enter a valid address");
      return;
    }

    let Arr1 = Array();
    let Arr2 = Array();
    finalData.results[0].address_components.filter((d: { long_name: any }) =>
      Arr1.push(d.long_name)
    );
    finalData.results[0].address_components.filter((d: { types: any }) =>
      Arr2.push(d.types)
    );
   
    const obj: any = {};
    Arr2.forEach((element, index) => {
      obj[element] = Arr1[index];
    });
    let countryISOArray = finalData.results[0].address_components;
    const index = countryISOArray.findIndex((object: { types: string }) => {
      return object.types[0] === "country";
    });
      const newObj = {
      addressNumber: obj["street_number"],
      country: obj["country,political"],
      address: obj["route"],
      postalCode: obj["postal_code"],
      city: obj["locality,political"],
      region: obj["administrative_area_level_3,political"],
      region2: obj["administrative_area_level_1,political"],
      province: obj["administrative_area_level_2,political"],
      countryISO: countryISOArray[index].short_name,
    };
    res.json(newObj);
  }
}
