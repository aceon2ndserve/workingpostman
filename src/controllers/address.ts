import { addressValidate } from '../services/address-validation';
import { User } from '../app';

export async function addressController(req: any, res: any) {
  const { address, city, postalCode } = req.body;
  try {
    const reqData = await User.build({ address, city, postalCode });
    const validationObject = await addressValidate(address, city, postalCode);
    await reqData.save();
    return res.json(validationObject);
  } catch (error) {
    return res.status(500).json({ error: (error as any).message });
  }
}
