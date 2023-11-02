const uuid = require('uuid')
const Sib = require('sib-api-v3-sdk')

const User = require('../models/User')

const bcrypt = require('bcrypt')

const Forgotpassword = require('../models/Forgotpassword')
const config = require('dotenv').config
config({ path: './config/config.env' })



const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body

        const user = await User.findOne({ email: email });
        if (user) {
            const id = uuid.v4();
            // user.createForgotpassword({ id , active: true })
            //     .catch(err => {
            //         throw new Error(err)
            //     })

            const newForgotpassword = new Forgotpassword({
                id,
                active: true,
                userId: user._id
            })

            await newForgotpassword.save()
            const client = Sib.ApiClient.instance
            const apiKey = client.authentications['api-key']
            apiKey.apiKey = process.env.SIB_API_KEY

            const tranEmailApi = new Sib.TransactionalEmailsApi()

            const sender = {
                email: 'justmailnikhil3@gmail.com'
            }
            const receivers = [
                {
                    email: email
                }
            ]
            tranEmailApi.sendTransacEmail({
                sender,
                to: receivers,
                subject: 'Reset Password Link',
                htmlContent: `
                <p>Here is the link to reset your password:</p>
                <a href="http://localhost:3000/api/password/resetpassword/${id}">Reset password</a>`,
            })
                .then((response) => {
                    console.log(response)
                    return res.status(202).json({ message: 'Link to reset password sent to your mail ', success: true })

                }).catch((err) => {
                    console.log(err)
                })
        } else {
            throw new Error('User does not exist')
        }
    } catch (err) {
        console.error(err)
        return res.json({ message: err, sucess: false });
    }
}


const resetPassword = async (req, res) => {
    try {
        const { id } = req.params
        const forgotpasswordrequest = await Forgotpassword.findOne({ _id: id })

        if (forgotpasswordrequest) {
            await forgotpasswordrequest.updateOne({ _id: id }, { active: false })

            res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>

                                    <form action="/api/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`);


        }
    } catch (err) {
        console.log(err)
        res.status(500).send('Internal server error')
    }
    res.end()
}



const updatePassword = async (req, res) => {
    try {
        const { newpassword } = req.query
        const { resetpasswordid } = req.params

        const resetpasswordrequest = await Forgotpassword.findOne({ _id: resetpasswordid })
        if (!resetpasswordrequest) {
            return res.status(404).json({ error: 'Reset password request not found', success: false });
        }

        const user = await User.findOne({ _id: resetpasswordrequest.userId })
        if (!user) {
            return res.status(404).json({ error: 'No user exists', success: false });
        }
        const saltRounds = 10
        const salt = await bcrypt.genSalt(saltRounds)
        const hash = await bcrypt.hash(newpassword, salt)

        await user.updateOne({ _id: user._id }, { password: hash })

        res.status(201).json({ message: 'password successfully updated' })



    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'internal server error' })
    }
}




module.exports = {
    forgotPassword,
    resetPassword,
    updatePassword
}