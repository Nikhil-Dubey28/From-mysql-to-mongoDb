// const Sequelize = require('sequelize')
// const sequelize = require('../database/configDatabase')
// const User = require('./User')


// const Order = sequelize.define('order',{
//     id : {
//         type: Sequelize.INTEGER,
//         primaryKey: true,
//         allowNull: false,
//         autoIncrement: true,
//     },
//     orderid : {
//         type: Sequelize.STRING,
       
//     },
//     paymentid: {
//         type: Sequelize.STRING,
//     },
//     signatureid : {
//         type: Sequelize.STRING,
//     },
//     status: {
//         type: Sequelize.STRING,
        
//     },

   
    
// })

// // // Define association with User model
// // Expense.belongsTo(User, { foreignKey: 'userId' });

// module.exports = Order

const mongoose = require('mongoose') 

const orderSchema = new mongoose.Schema( {
    paymentid: {
        type: String,

    },
    orderid: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,

    },
    signatureid : {
        type: String,
    },
    userId : {
        type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    }
})


const Order = mongoose.model('Order', orderSchema)

module.exports = Order