const mongoose = require('mongoose');
require("dotenv").config()

const connecttodb = async()=>
{
    try {
        await mongoose.connect(process.env.DB_URI ,{

        })
        console.log("connected to the database sucessfully ")
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = connecttodb;