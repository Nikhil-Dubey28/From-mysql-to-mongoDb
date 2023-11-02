// const Sequelize = require('sequelize')
// const sequelize = require('../database/configDatabase')
// const User = require('./User')


// const Expense = sequelize.define('expense',{
//     id : {
//         type: Sequelize.INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//     },
//     date:{
//         type: Sequelize.STRING,
        
//     },
//     amount : {
//         type: Sequelize.STRING,
//         allowNull: false,
//     },
//     description: {
//         type: Sequelize.STRING,
//         allowNull: false,
//     },
//     category: {
//         type: Sequelize.STRING,
//     allowNull: false,
//     },
    
// })

// // // Define association with User model
// // Expense.belongsTo(User, { foreignKey: 'userId' });

// module.exports = Expense

const mongoose = require('mongoose')

const expenseSchema = new mongoose.Schema( {
    date :{
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      }
    },{

        timestamps: true,
    })


const Expense = mongoose.model('Expense',expenseSchema)

module.exports = Expense;



