// const Sequelize = require('sequelize')
// const sequelize = require('../database/configDatabase')
// const Expense = require('./Expense')


// const User = sequelize.define('user',{
//     id : {
//         type: Sequelize.INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//     },
//     name : {
//         type: Sequelize.STRING,
//         allowNull: false,
//     },
//     email: {
//         type: Sequelize.STRING,
//         allowNull: false,
//     },
//     password: {
//         type: Sequelize.STRING,
//     allowNull: false,
//     },
//     ispremiumuser: {
//         type: Sequelize.BOOLEAN,
//         allowNull:false
//     },
//     totalexpenses: {
//         type: Sequelize.INTEGER,
//         defaultValue: 0,
//     }
// })

// // // Define association with Expense model
// // User.hasMany(Expense, { foreignKey: 'userId' });

// module.exports = User


const mongoose = require('mongoose')

const userSchema = new mongoose.Schema( {
    name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
      },
      ispremiumuser: {
        type: Boolean,
        default: false,
      },
      totalexpenses: {
        type: Number,
        default: 0,
      },
})


const User = mongoose.model('User', userSchema)

module.exports = User;
