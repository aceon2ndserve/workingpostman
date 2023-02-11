import axios from 'axios';

export async function addressValidate(address: string, city: string, postalCode: string) {
  const axiosResponse = await axios(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${address}+${city}+${postalCode}&key=${process.env.GOOGLE_API}`,
  );

  const { data } = axiosResponse;

  if (axiosResponse.status !== 200) {
    throw new Error('Something went wrong, try again.');
  }

  if (
    data.status === 'ZERO_RESULTS' ||
    data.results[0].geometry.location_type === 'APPROXIMATE' ||
    data.results[0].address_components[0].types[0] !== 'street_number'
  ) {
    throw new Error('Please enter a valid address');
  }

  let Arr1 = Array();
  let Arr2 = Array();

  data.results[0].address_components.filter((d: { long_name: any }) => Arr1.push(d.long_name));
  data.results[0].address_components.filter((d: { types: any }) => Arr2.push(d.types));

  const obj: any = {};

  Arr2.forEach((element, index) => {
    obj[element] = Arr1[index];
  });

  let countryISOArray = data.results[0].address_components;

  const index = countryISOArray.findIndex((object: { types: string }) => {
    return object.types[0] === 'country';
  });

  const newObj = {
    addressNumber: obj['street_number'],
    country: obj['country,political'],
    address: obj['route'],
    postalCode: obj['postal_code'],
    city: obj['locality,political'],
    region: obj['administrative_area_level_3,political'],
    region2: obj['administrative_area_level_1,political'],
    province: obj['administrative_area_level_2,political'],
    countryISO: countryISOArray[index].short_name,
  };

  return newObj;
}
