const { Webhook } = require('svix');
const User = require('../models/userModel');

const postWebhook = async(req, res) => {
  try {
    const payloadString = req.body.toString();
    const svixHeaders = req.headers;

    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET_KEY);
    const evt = wh.verify(payloadString, svixHeaders);

    const id  = evt.data;
    console.log(id)

    const eventType = evt.type;

    if (eventType === 'user.created') {

      const user = new User({
        clerkUserId: id,
      });

      await user.save();
      console.log('User is created');
    } else if (eventType === 'user.updated') {
      const clerkUserId = id;

      // Update the user in MongoDB based on Clerk User ID
      const updatedUser = await User.findOneAndUpdate(
        { clerkUserId },
        { new: true }
      );

      if (!updatedUser) {
        console.log(`User with Clerk User ID ${clerkUserId} not found in the database`);
      } else {
        console.log('User is updated');
      }
    } else if (eventType === 'user.deleted') {
      const clerkUserId = id;

      // Find and delete the user from MongoDB based on Clerk User ID
      const deletedUser = await User.findOneAndDelete({ clerkUserId });

      if (!deletedUser) {
        console.log(`User with Clerk User ID ${clerkUserId} not found in the database`);
      } else {
        console.log('User is deleted');
      }
    }

    res.status(200).json({
      success: true,
      message: 'Webhook received',
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

module.exports = {
  postWebhook
}