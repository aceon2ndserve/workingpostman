import { User } from '../../../models/User';

export const dataToDB = async function (address, city, postalCode) {
  const reqData = await User.create({ address, city, postalCode });
  await reqData.save();
};
