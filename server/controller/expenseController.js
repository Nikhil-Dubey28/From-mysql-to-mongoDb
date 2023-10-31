const sequelize = require('../database/configDatabase')
const Expense = require('../model/Expense')
const User = require('../model/User')
const AWS = require('aws-sdk')

const mongoose = require('mongoose')





const createExpense = async(req,res) => {

    // const t = await sequelize.transaction()

    // const session = await mongoose.startSession()
    // session.startTransaction()
    try {
        const {amount,description,category,date} = req.body  

        const newExpense = new Expense({amount,description,category,date, userId: req.userId})
        await newExpense.save()


        const user = await User.findById(req.userId)

        const updateTotalExpense = user.totalexpenses + parseInt(amount)
        // await user.update({totalexpenses: updateTotalExpense},{t})
        user.totalexpenses = updateTotalExpense;

        await user.save()
      // await  session.commitTransaction()
        res.status(201).json(newExpense)
     }catch(err) {
        // await session.abortTransaction()
        console.log(err)
        res.status(500).json({message:'internal server error'})
     }
}

const getExpense = async (req, res) => {
    try {
    
      const expenses = await Expense.find({ userId: req.userId })
        .sort({ date: 'ASC' })
        .exec();
  
      res.status(200).json(expenses);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'internal server error' });
    }
  };
  

  const getExpenseById = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find the expense by ID and userId
      const expense = await Expense.findOne({ _id: id, userId: req.userId }).exec();
  
      if (!expense) {
        return res.status(404).json({ message: 'Expense not found' });
      }
  
      res.status(200).json(expense);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  


const uploadToS3 = async (data,filename) => {
const BUCKET_NAME = process.env.BUCKET_NAME
const IAM_USER_KEY = process.env.IAM_USER_KEY
const IAM_USER_SECRET = process.env.IAM_USER_SECRET

let s3Bucket = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET,
    Bucket: BUCKET_NAME
})


      var params = {
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL: 'public-read'
      }

      return new Promise((resolve, reject) => {
        
          s3Bucket.upload(params , (err,s3response) => {
            if(err) {
                console.log('something went wrong', err)
                reject(err)
            }else{
                console.log('success',s3response)
                resolve(s3response.Location)
            }
          })
      })



}

const downloadExpense = async(req,res) => {
    try {
        
    const expenses = await Expense.findAll({where: {userId: req.userId},
    attributes: ['date','amount','description','category']
    })
    console.log(expenses)
    const stringifiedExpenses = JSON.stringify(expenses);

    const userId = req.userId

    const filename = `Expenses${userId}/${new Date()}.txt`;
    const fileURL = await uploadToS3(stringifiedExpenses,filename)


    

    res.status(200).json({fileURL,success:true})

}catch(err) {
    res.status(500).json({fileURL: '', success:false, err:err})
}
    
}


const paginatedExpense = async(req,res) => {
    try {
        const expenses = await Expense.find( {userId: req.userId} ).sort({createdAt : -1})
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)
        const startIndex = (page-1)*limit
        const lastIndex = (page)*limit

        const results ={}
        results.totalExpenses = expenses.length;

        results.pageCount =Math.ceil(expenses.length/limit)

        if(lastIndex<expenses.length){
            results.next= {
                page:page + 1,
                
            }
        }
        if(startIndex > 0){

            results.prev={
                page: page -1,
            }
        }

        results.result = expenses.slice(startIndex,lastIndex)


        res.status(200).json(results)
    } catch (err) {
        console.log(err)
        res.status(500).json({message: 'internal server error'})
    }
}

const deleteExpense = async(req,res) => {
    try {
        const {id} =req.params
        // const validObjectId = new mongoose.Types.ObjectId(id);
      

        const deletedExpense = await Expense.findOne({_id: id, userId: req.userId})

        if (!deletedExpense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        const deletedAmount = deletedExpense.amount
        await Expense.deleteOne({_id: id,userId:req.userId})

        const user = await User.findOne({_id: req.userId})

        const updatedTotalExpenses = user.totalexpenses - deletedAmount
        // await user.update({totalexpenses : updatedTotalExpenses})
        user.totalexpenses = updatedTotalExpenses;

        await user.save()
        res.status(204).end()
    }catch(err){
        console.log(err)
        res.status(500).json({message: 'internal server error'})
    }
}

const editExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, description, category,date } = req.body;
    
        const expense = await Expense.findOne({_id: id, userId: req.userId});

        const user = await User.findOne({_id:req.userId})
        const updatedTotalExpenses = user.totalexpenses - expense.amount + Number(amount)
        user.totalexpenses = updatedTotalExpenses;
 
    await user.save()
    
        if (!expense) {
          return res.status(404).json({ message: 'expense not found' });
        }

        
    
       
              expense.category =  category,
              expense.description =  description,
              expense.amount =  amount,
              expense.date =  date
            
      await expense.save()

        //   await User.update(
        //     {
        //       totalexpenses: req.user.totalexpenses - expense.amount + Number(amount),
        //     },
        //     { where: { id: req.userId } }
        //   );
        // const user = await User.findOne({_id:req.userId})
        // const updatedTotalExpenses = user.totalexpenses - expense.amount + Number(amount)
        // user.totalexpenses = updatedTotalExpenses;
        // await user.save()
        // await user.update({totalexpenses: updatedTotalExpenses})
        res.status(200).json(expense);
      } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
      }
};

module.exports = {
    createExpense,
    getExpense,
    deleteExpense,
    paginatedExpense,
    editExpense,
    getExpenseById,
    downloadExpense
}


 