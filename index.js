const express = require('express');
const { sequelize } = require('./models/db');
const app = express();
const cors = require('cors');
const port = 3000;
const userRouter = require('./routes/user');
const courseRouter = require('./routes/course');
const lessionRouter = require('./routes/lession');
const subLessionRouter = require('./routes/subLession');
const quizRouter = require('./routes/quiz');
const questionRouter = require('./routes/question');
const questionOptionRouter = require('./routes/questionOption');
const userAnswerRouter = require('./routes/userAnswer');
const reviewCourseRouter = require('./routes/reviewCourse');
const enrollmentRouter = require('./routes/enrollment');
const commentRouter = require('./routes/comment');
const replyRouter = require('./routes/reply');
const categoryRouter = require('./routes/category');
const paymentRouter = require('./routes/payment');
app.use(express.json());
app.use(cors());
app.use(express.static('public'));
app.use('/api/users', userRouter);
app.use('/api/courses', courseRouter);
app.use('/api/lessions', lessionRouter);
app.use('/api/sublessions', subLessionRouter);
app.use('/api/quizs', quizRouter);
app.use('/api/questions', questionRouter);
app.use('/api/questionoptions', questionOptionRouter);
app.use('/api/useranswers', userAnswerRouter);
app.use('/api/reviewcourses', reviewCourseRouter);
app.use('/api/enrollments', enrollmentRouter);
app.use('/api/comments', commentRouter);
app.use('/api/replys', replyRouter);
app.use('/api/categorys', categoryRouter);
app.use('/api/payments', paymentRouter);
sequelize
  .sync()
  .then(() => {
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Error syncing Sequelize:', error);
  });
