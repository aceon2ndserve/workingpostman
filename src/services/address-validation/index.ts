import fetch from "node-fetch";

export async function addressCallback(req:any,res:any) {
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
          let Arr3 = Array()
    finalData.results[0].address_components.filter((d: { long_name: any; }) => Arr1.push(d.long_name))
    finalData.results[0].address_components.filter((d: { types: any; }) => Arr2.push(d.types))
    finalData.results[0].address_components.filter((d: { short_name: any; }) => Arr3.push(d.short_name))

    // let newArr2:any[] = [].concat(...Arr2)
    const obj:any = {};
    Arr2.forEach((element, index) => {
    obj[element] = Arr1[index]
    });
    let specialArr = finalData.results[0].address_components
    const index = specialArr.findIndex((object: { types: string; }) => {
        return object.types[0] === 'country';
      });
      console.log(specialArr[index].short_name)
    obj['addressNumber'] = obj['street_number']
    obj['country'] = obj['country,political']
    obj['address'] = obj['route']
    obj['postalCode'] = obj['postal_code']
    obj['city'] = obj['locality,political']
    obj['region'] = obj['administrative_area_level_3,political']
    obj['region2'] = obj['administrative_area_level_1,political']
    obj['province'] = obj['administrative_area_level_2,political']
    obj['countryISO'] = specialArr[index].short_name
    const {addressNumber,country,address,postalCode,city,region,region2,province,countryISO} = obj
    const newObj = {
    addressNumber,country,address,postalCode,city,region,region2,province,countryISO
    }
res.json(newObj)
    // res.json(newObj)
    
    }
}