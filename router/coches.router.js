const express = require('express');
const db = require('../db');
const Coche = require('../models/Coche')

//create a new express router
const cochesRouter = express.Router();


const coches = [
    { id: 1, marca: "toyota", modelo: "corolla", anoFabricacion: 1986 },
    { id: 2, marca: "ford", modelo: "focus", anoFabricacion: 2000 },
    { id: 3, marca: "Opel", modelo: "corsa", anoFabricacion: 2010 },
    { id: 4, marca: "Opel", modelo: "Safira", anoFabricacion: 2010 },
    { id: 5, marca: "Ford", modelo: "Fiesta", anoFabricacion: 2004 },
    { id: 6, marca: "Fiat", modelo: "Punto", anoFabricacion: 2006 },
    { id: 7, marca: "Toyota", modelo: "Yaris", anoFabricacion: 2011 }
  ];

//GET /coches/ ---> /coches
cochesRouter.get('/', (req, res) => {

    let filtro = {}
    if(req.query.marca) {
        filtro = {...filtro, marca: req.query.marca}
    }
    if(req.query.modelo) {
        filtro = {...filtro, modelo: req.query.modelo}
    }

    //TODO crear filtros anteriores a posteriores y luego el doble ananteriores a y posteriores a
    
    Coche.find(filtro)
        .then( coches => {
            return res.status(200).json(coches);
        })
        .catch( err => {
            const error = new Error(err)
            error.status = 500
            return next(error)
        })

});



// GET /coches/1
cochesRouter.get('/:id', (req, res) => {

    const id = req.params.id

    return Coche.findById(id)
                .then( coche => {
                    if(!coche) {
                        const error = new Error('coche no encontrado')
                        error.status = 404
                        return next(error)
                    }
                    return res.status(200).json(coche);
                })
                .catch( err => {
                    const error = new Error(err)
                    error.status = 500
                    return next(error)
                })

});

//insertar coche
cochesRouter.post('/', (req, res, next) => {

    const newCoche = new Coche(req.body)

    return newCoche.save()
            .then( () => {
                return res.status(201).json(newCoche)
            })        
            .catch( err => {
                const error = new Error(`Coche no guardado ${err}`)
                error.status = 405;
                return next(error);
        })

});

//actualizar coche
cochesRouter.put('/:id', (req, res, next) => {

    const id = req.params.id
    
    const cocheEditado = new Coche(req.body)

    cocheEditado._id = id //reasignamos el id para sobreescribir el documento en la DB

    return Coche.findByIdAndUpdate(id, cocheEditado, { new: true })
                    .then( cocheActualizado => {
                        return res.status(200).json(cocheActualizado)
                    })
                    .catch( err => {
                        const error = new Error(`Coche no editado ${err}`)
                        error.status = 405;
                        return next(error);
                })

});

//eliminar coche
cochesRouter.delete('/:id', (req, res, next) => {

    const id = req.params.id
    Coche.findByIdAndDelete(id)
        .then( () => {
            return res.status(200).json(`El coche con id ${id} ha sido eliminado`)
        })
        .catch( err => {
            const error = new Error('Coche no encontrado')
            error.status = 405;
            return next(error);
        })

    
});

module.exports = cochesRouter;