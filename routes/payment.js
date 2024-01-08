const express = require('express');
const { Payment, Enrollment, EnrollmentPayment } = require('../models/db');
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

    // Create line items for the Stripe session
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

    // Create a Stripe session
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: 'payment',
      locale: 'vi',
      success_url: 'https://example.com/success',
      cancel_url: 'https://example.com/cancel'
    });

    // Save payment information to the database
    const paymentAmount = courses.reduce(
      (total, course) => total + course.coursePrice,
      0
    );
    const payment = await Payment.create({
      paymentAmount,
      userId,
      stripeChargeId: session.id
    });

    // Save enrolled courses to the database
    await Promise.all(
      courses.map(async (course) => {
        try {
          const newEnrollment = new Enrollment({
            userId,
            courseId: course.id
          });
          const savedEnrollment = await newEnrollment.save();

          // Create enrollment payment record
          await EnrollmentPayment.create({
            enrollmentId: savedEnrollment.id,
            paymentId: payment.id,
            paymentType: 'stripe', // You can customize this based on your needs
            paymentStatus: 'completed', // Assuming the payment is successful
            paymentDate: new Date(),
            amount: course.coursePrice,
            currency: 'usd', // Set the currency based on your needs
            notes: 'Enrollment payment'
          });
        } catch (error) {
          console.error('Error saving course enrollment to database:', error);
        }
      })
    );

    // Respond with the Stripe session ID
    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Retrieve all payments for a specific user
router.get('/user', checkRole('student'), async (req, res) => {
  try {
    const userId = req.user.id;

    // Retrieve all payments associated with the user
    const userPayments = await Payment.findAll({
      where: { userId },
      include: [{ model: EnrollmentPayment, include: [Enrollment] }]
    });

    res.json(userPayments);
  } catch (error) {
    console.error('Error retrieving payments:', error);
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
