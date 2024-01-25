// pages/api/user.js

import connectDb from '../../utils/dbConnect';
import User from '../../models/User';

export default async (req, res) => {
  await connectDb();

  if (req.method === 'GET') {
    const users = await User.find({});
    res.status(200).json(users);
  } else if (req.method === 'POST') {
    const { name, email, password } = req.body;
    try {
      const user = await User.create({ name, email, password });
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(400).json({ message: 'Only GET and POST requests are allowed' });
  }
};