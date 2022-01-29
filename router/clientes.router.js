const express = require('express')
const db = require('../db')
const Cliente = require('../models/Cliente')


//create client route
const clientesRouter = express.Router()

//rutas

//listar clientes
clientesRouter.get('/', (req, res, next) => {

    Cliente.find().populate('coches')
        .then( clientes => {
            return res.status(200).json(clientes);
        })
        .catch( err => {
            const error = new Error(err)
            error.status = 500
            return next(error)
        })

})  

//obtener cliente por id
clientesRouter.get('/:id', (req, res) => {
    
    const id = req.params.id

    return Cliente.findById(id).populate('coches')
                .then( cliente => {
                    if(!cliente) {
                        const error = new Error('cliente no encontrado')
                        error.status = 404
                        return next(error)
                    }
                    return res.status(200).json(cliente);
                })
                .catch( err => {
                    const error = new Error(err)
                    error.status = 500
                    return next(error)
                })
})

//insertar cliente
clientesRouter.post('/', (req, res, next) => {

    const nuevoCliente = new Cliente({
        nombre: req.body.nombre,
        edad: req.body.edad,
        appellido: req.body.appellido,
        coches: []
    })

    return nuevoCliente.save()
            .then( () => {
                return res.status(201).json(nuevoCliente)
            })
            .catch( err => {
                const error = new Error(err)
                error.status = 500
                return next(error)
            })


    
})

//actualizar cliente
clientesRouter.put('/:id', (req, res) => {
    const id = req.params.id
    
    const clienteEditado = new Cliente(req.body)

    clienteEditado._id = id //reasignamos el id para sobreescribir el documento en la DB

    return cliente.findByIdAndUpdate(id, clienteEditado, { new: true })
                    .then( clienteActualizado => {
                        return res.status(200).json(clienteActualizado)
                    })
                    .catch( err => {
                        const error = new Error(`cliente no editado ${err}`)
                        error.status = 405;
                        return next(error);
                })
})

//agregar coches a clientes
clientesRouter.put('/:id/coches', (req, res) => {
    const id = req.params.id
    const idCocheAAgrear = req.body.cocheId;

    return Cliente.findByIdAndUpdate( 
        id, 
        {$push: {coches: idCocheAAgrear}} ,
        { new: true }
    )
    .then( clienteActualizado => {
        return res.status(200).json(clienteActualizado)
    })
    .catch( err => {
        const error = new Error('cliente no encontrado')
        error.status = 405;
        return next(error);
    })
})

//eliminar clientes
clientesRouter.delete('/', (req, res) => {
    const id = req.params.id
    Cliente.findByIdAndDelete(id)
        .then( () => {
            return res.status(200).json(`El cliente con id ${id} ha sido eliminado`)
        })
        .catch( err => {
            const error = new Error('cliente no encontrado')
            error.status = 405;
            return next(error);
        })
})

module.exports = clientesRouter;