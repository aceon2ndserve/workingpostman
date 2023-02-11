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

  const addressComponents: {
    long_name: string;
    short_name: string;
    types: string[];
  }[] = data.results?.[0]?.address_components;

  if (!addressComponents) {
    throw new Error('Address components seem to be empty');
  }

  const addressComponentMap: any = addressComponents.reduce((prevValue, currentValue) => {
    const newValue = { ...prevValue, [`${currentValue.types[0]}`]: currentValue.short_name };
    return newValue;
  }, {});

  return {
    raw: addressComponents,
    formatted_raw: addressComponentMap,
    formatted: {
      street_number: addressComponentMap.street_number,
      street: addressComponentMap.route,
      city: addressComponentMap.locality,
      postal_code: addressComponentMap.postal_code,
      country_code: addressComponentMap.country,
    },
  };
}
