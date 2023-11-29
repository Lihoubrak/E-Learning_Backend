const express = require('express');
const { sequelize } = require('./models/db');
const app = express();
const cors = require('cors');
const port = 3000;
const userRouter = require('./routes/user');
const courseRouter = require('./routes/course');
app.use(express.json());
app.use(cors());
app.use('/api/user', userRouter);
app.use('/api/course', courseRouter);
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
