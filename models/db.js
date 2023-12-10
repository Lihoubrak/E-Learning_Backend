const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT
  }
);

const User = sequelize.define(
  'user',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: DataTypes.STRING,
    avatar: DataTypes.STRING,
    birthday: DataTypes.DATE,
    sex: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    facebookId: DataTypes.STRING,
    googleId: DataTypes.STRING,
    zaloId: DataTypes.STRING,
    city: DataTypes.STRING(255),
    district: DataTypes.STRING(255),
    class: DataTypes.STRING,
    school: DataTypes.STRING(255),
    workplace: DataTypes.STRING(255),
    subjectTaught: DataTypes.STRING(255),
    academicDegree: DataTypes.STRING(255),
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  { timestamps: false }
);

const Role = sequelize.define(
  'role',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    roleName: DataTypes.STRING
  },
  { timestamps: false }
);

const Course = sequelize.define(
  'course',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    courseName: DataTypes.STRING,
    coursePrice: DataTypes.FLOAT,
    courseImage: DataTypes.STRING,
    courseVideo: DataTypes.STRING,
    courseIntroduction: DataTypes.STRING(255),
    courseDescription: DataTypes.STRING(255),
    courseRequirement: DataTypes.STRING(255),
    courseAchievement: DataTypes.STRING(255),
    courseTarget: DataTypes.STRING(255),
    courseObjective: DataTypes.STRING(255),
    courseStructure: DataTypes.STRING(255),
    courseService: DataTypes.STRING(255),
    courseRegister: DataTypes.DATE,
    courseExpire: DataTypes.DATE,
    courseTotalRegister: DataTypes.STRING,
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    categorySecondId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  { timestamps: false }
);

const Lession = sequelize.define(
  'lession',
  {
    lessionTilte: DataTypes.STRING,
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  { timestamps: false }
);

const SubLession = sequelize.define(
  'subLession',
  {
    subLessionTitle: DataTypes.TEXT,
    subLessionVideo: DataTypes.TEXT,
    subLessionView: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    subLessionFile: DataTypes.STRING,
    subLessionFileExcercise: DataTypes.STRING,
    subLessionFree: DataTypes.BOOLEAN,
    lessionId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  { timestamps: false }
);

const Quiz = sequelize.define(
  'quiz',
  {
    quizName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    quizDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    quizDuration: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    subLessionId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  { timestamps: false }
);

const Question = sequelize.define(
  'question',
  {
    questionText: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    questionPoint: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    quizId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  { timestamps: false }
);

const QuestionOption = sequelize.define(
  'questionOption',
  {
    questionOptionText: DataTypes.STRING(255),
    isCorrect: DataTypes.BOOLEAN,
    questionId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  { timestamps: false }
);

const UserAnswer = sequelize.define(
  'userAnswer',
  {
    userResponse: DataTypes.STRING,
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    questionOptionId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  { timestamps: false }
);

const Category = sequelize.define(
  'category',
  {
    categoryName: DataTypes.STRING
  },
  { timestamps: false }
);

const CategoryFirst = sequelize.define(
  'categoryFirst',
  {
    categoryFirstName: DataTypes.STRING,
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  { timestamps: false }
);

const CategorySecond = sequelize.define(
  'categorySecond',
  {
    categorySecondName: DataTypes.STRING,
    categoryFirstId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  { timestamps: false }
);

const ReviewCourse = sequelize.define(
  'reviewCourse',
  {
    reviewCourseText: DataTypes.STRING(255),
    reviewCourseStar: DataTypes.INTEGER,
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  { timestamps: false }
);

const Enrollment = sequelize.define(
  'enrollment',
  {
    enrollmentDate: {
      type: DataTypes.DATE,
      defaultValue: sequelize.fn('now')
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  { timestamps: false }
);

const Comment = sequelize.define(
  'comment',
  {
    commentText: DataTypes.STRING,
    commentImage: DataTypes.STRING,
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    subLessionId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  { timestamps: false }
);

const Reply = sequelize.define(
  'reply',
  {
    replyText: DataTypes.STRING,
    replyImage: DataTypes.STRING,
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    commentId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    parentReplyId: {
      type: DataTypes.INTEGER,
      allowNull: true // Allow null for top-level replies
    }
  },
  { timestamps: false }
);

const Payment = sequelize.define(
  'payment',
  {
    paymentAmount: DataTypes.INTEGER,
    paymentDate: {
      type: DataTypes.DATE,
      defaultValue: sequelize.fn('now')
    },
    paymentMethod: DataTypes.STRING
  },
  { timestamps: false }
);

Category.hasMany(CategoryFirst);
CategoryFirst.belongsTo(Category);

CategoryFirst.hasMany(CategorySecond);
CategorySecond.belongsTo(CategoryFirst);

User.hasMany(Course);
Course.belongsTo(User);

Role.hasMany(User);
User.belongsTo(Role);
CategorySecond.hasMany(Course);
Course.belongsTo(CategorySecond);
Course.hasMany(Lession);
Lession.belongsTo(Course);

Lession.hasMany(SubLession);
SubLession.belongsTo(Lession);

User.hasMany(Enrollment);
Enrollment.belongsTo(User);

Course.hasMany(Enrollment);
Enrollment.belongsTo(Course);

ReviewCourse.belongsTo(Course);
Course.hasMany(ReviewCourse);

ReviewCourse.belongsTo(User);
User.hasMany(ReviewCourse);

SubLession.hasMany(Quiz);
Quiz.belongsTo(SubLession);

Quiz.hasMany(Question);
Question.belongsTo(Quiz);

Question.hasMany(QuestionOption);
QuestionOption.belongsTo(Question);

User.hasMany(UserAnswer);
UserAnswer.belongsTo(User);

QuestionOption.hasMany(UserAnswer);
UserAnswer.belongsTo(QuestionOption);

User.hasMany(Comment);
Comment.belongsTo(User);

User.hasMany(Reply);
Reply.belongsTo(User);

SubLession.hasMany(Comment);
Comment.belongsTo(SubLession);

Comment.hasMany(Reply);
Reply.belongsTo(Comment);

// Define associations
Reply.hasMany(Reply, {
  foreignKey: 'parentReplyId',
  as: 'childReplies' // Alias for the association
});

Reply.belongsTo(Reply, {
  foreignKey: 'parentReplyId',
  as: 'parentReply' // Alias for the association
});
User.hasMany(Payment);
Payment.belongsTo(User);
module.exports = {
  sequelize,
  User,
  Role,
  Course,
  Lession,
  SubLession,
  Quiz,
  Question,
  QuestionOption,
  UserAnswer,
  Category,
  CategoryFirst,
  CategorySecond,
  ReviewCourse,
  Enrollment,
  Comment,
  Reply,
  Payment
};
