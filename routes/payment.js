const express = require('express');
const { Payment, Enrollment } = require('../models/db');
const { checkRole } = require('../middleware/authenticateToken');
const stripe = require('stripe')(
  'sk_test_51MsVL5FC5YM2xOXYYLRCwi8nWA85GbGJCtfzVe7k25dNrHpkB4AKsS9Wx5PaUOndwxX4GenTXo3906Wo7JCWjj2w00lBzUVp0S'
);

const router = express.Router();
// const nodemailer = require('nodemailer');
// // Configure email settings (replace with your actual email credentials)
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'leeminhou79@@gmail.com',
//     pass: 'iccy ppvo zolr dbtb'
//   }
// });
router.post('/create', checkRole('student'), async (req, res) => {
  try {
    const courses = req.body.courses;
    const userId = req.user.id;
    const lineItems = courses.map((course) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: course.courseName,
          images: [course.courseImage]
        },
        unit_amount: course.coursePrice * 100
      },
      quantity: 1
    }));

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: 'payment',
      locale: 'vi',
      success_url: 'https://example.com/success',
      cancel_url: 'https://example.com/cancel'
    });

    res.json({ id: session.id });
    // **Save courses to database after successful payment**
    await Promise.all(
      courses.map(async (course) => {
        try {
          const newCourse = new Enrollment({
            userId,
            courseId: course.id
          });
          await newCourse.save();
        } catch (error) {
          console.error('Error saving course to database:', error);
        }
      })
    );
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Function to send success email
// async function sendSuccessEmail(user) {
//   try {
//     await transporter.sendMail({
//       from: 'leeminhou79@@gmail.com',
//       to: 'dcan38802@gmail.com',
//       subject: 'Checkout Successful!',
//       text: 'Your payment has been processed successfully! Thank you for your purchase.',
//       html: '<p>Your payment has been processed successfully!</p><p>Thank you for your purchase.</p>'
//     });
//     console.log('Success email sent to:', user.email);
//   } catch (error) {
//     console.error('Error sending email:', error);
//   }
// }

module.exports = router;
