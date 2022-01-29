const mongoose = require('mongoose');
const Cliente = require('./Cliente');

const Schema = mongoose.Schema;

const empleadoSchema = new Schema({
    nombre: { type: String, required:true }, 
    apellido: { type: String, required:true},
    dni:{ type: String }, 
    clientes:  [{ type: mongoose.Types.ObjectId, ref: Cliente}], 
    },
    {
        timestamps: true
});

const Empleado = mongoose.model('empleados', empleadoSchema)

module.exports = Empleado