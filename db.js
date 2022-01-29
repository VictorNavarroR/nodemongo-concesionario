//conexion con mongodb
const mongoose = require('mongoose')

const user = 'admin'
const pass = 'admin'

const DB_URL = `mongodb+srv://${user}:${pass}@upgrade-nov-2021.yor7b.mongodb.net/Consecionario?retryWrites=true&w=majority`

const connectDB = () => mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology:true
});


module.exports = { connectDB };
