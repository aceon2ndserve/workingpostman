import { addressValidate } from '../services/address-validation';

export async function addressController(req: any, res: any) {
  //
  const address = req.body.address;
  const city = req.body.city;
  const postalCode = req.body.postalCode;
  try {
    const validationObject = await addressValidate(address, city, postalCode);
    return res.json(validationObject);
  } catch (error) {
    return res.status(500).json({ error: (error as any).message });
  }
}
