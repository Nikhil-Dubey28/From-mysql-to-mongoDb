// const Sequelize = require('sequelize')
// const sequelize = require('../database/configDatabase')

// const Forgotpassword = sequelize.define('forgotpassword', {
//     id: {
//         type: Sequelize.UUID,
//         allowNull: false,
//         primaryKey: true
//     },
//     active: Sequelize.BOOLEAN,
//     expiresby: Sequelize.DATE
// })

// module.exports = Forgotpassword;

const mongoose = require('mongoose')

const forgotpasswordSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
      },
      isActive: {
        type: Boolean,
        required: true,
        default: true,
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
})


const Forgotpassword = mongoose.model('forgotpassword', forgotpasswordSchema)


module.exports = Forgotpassword