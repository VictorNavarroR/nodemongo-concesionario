const mongoose = require('mongoose')
const db = require('../db')

const Coche = require('../models/Coche')

const coches = [
    { marca: "toyota", modelo: "corolla", annoFabricacion: 1986 },
    { marca: "ford", modelo: "focus", annoFabricacion: 2000 },
    { marca: "Opel", modelo: "corsa", annoFabricacion: 2010 },
    { marca: "Opel", modelo: "Safira", annoFabricacion: 2010 },
    { marca: "Ford", modelo: "Fiesta", annoFabricacion: 2004 },
    { marca: "Fiat", modelo: "Punto", annoFabricacion: 2006 },
    { marca: "Toyota", modelo: "Yaris", annoFabricacion: 2011 }
  ]

const cochesDocuments = coches.map(coche => new Coche(coche))

db.connectDB()
  //ver si hay coches y eliminarlos
    .then( async () => {
        const todosLosCoches = await Coche.find();
        if(todosLosCoches.length > 0) {
            await Coche.collection.drop();
        }
    })
    .catch(err => console.error(`Error eliminando documentos de la db: ${err}`))
    //añadir documentos de coches a la BBDD
    .then( async () => {
        await Coche.insertMany(cochesDocuments)
    })
    .catch(err => console.error(`Error creando documentos de la db: ${err}`))
    //cerramos conexion
    .finally( () => mongoose.disconnect())