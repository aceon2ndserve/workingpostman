import { addressValidate } from '../services/address-validation';

export async function addressController(req: any, res: any) {
  const { address, city, postalCode } = req.body;

  try {
    const validationObject = await addressValidate(address, city, postalCode);
    return res.json(validationObject);
  } catch (error) {
    return res.status(500).json({ error: (error as any).message });
  }
}
