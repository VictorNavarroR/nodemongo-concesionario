const mongoose = require('mongoose');
const Coche = require('./Coche');

const Schema = mongoose.Schema;

const clienteSchema = new Schema({
    nombre: { type: String, required:true }, 
    apellido: { type: String }, 
    edad: { type: Number, required:true },
    coches: [{ type: mongoose.Types.ObjectId, ref: Coche}]
    },
    {
        timestamps: true
});

const Cliente = mongoose.model('clientes', clienteSchema)

module.exports = Cliente