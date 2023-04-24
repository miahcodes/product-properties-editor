// pages/api/products/[handle].js

import { getProductByHandle } from '../../../lib/products';

export default async function handler(req, res) {
  const { handle } = req.query;

  try {
    const product = await getProductByHandle(handle);

    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: 'Product not found.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while fetching the product.' });
  }
}
