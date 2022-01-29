const express = require('express')
const db = require('../db')
const Empleado = require('../models/Empleado')

//create empleado router
const empleadosRouter = express.Router()

//rutas

//Listar empleados
empleadosRouter.get('/', (req, res, next) => {

    Empleado.find().populate('clientes')
        .then( empleados => {
            return res.status(200).json(empleados);
        })
        .catch( err => {
            const error = new Error(err)
            error.status = 500
            return next(error)
        })

})  

//Obterner empleado por su id
empleadosRouter.get('/:id', (req, res) => {
    
    const id = req.params.id

    return Empleado.findById(id).populate('clientes')
                .then( empleado => {
                    if(!empleado) {
                        const error = new Error('empleado no encontrado')
                        error.status = 404
                        return next(error)
                    }
                    return res.status(200).json(empleado);
                })
                .catch( err => {
                    const error = new Error(err)
                    error.status = 500
                    return next(error)
                })
})

//insertar empleado
empleadosRouter.post('/', (req, res, next) => {

    const nuevoEmpleado = new Empleado({
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        dni: req.body.dni,
        clientes: []
    })

    return nuevoEmpleado.save()
            .then( () => {
                return res.status(201).json(nuevoEmpleado)
            })
            .catch( err => {
                const error = new Error(err)
                error.status = 500
                return next(error)
            })


    
})

//actualizar empleado
empleadosRouter.put('/:id', (req, res) => {
    const id = req.params.id
    
    const empleadoEditado = new Empleado({
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        dni: req.body.dni
    })

    empleadoEditado._id = id //reasignamos el id para sobreescribir el documento en la DB

    return Empleado.findByIdAndUpdate(id, {
         $set: { name: req.body.nombre },
         $set: { apellido: req.body.apellido },
         $set: { dni: req.body.dni },        
    }, 
    { new: true })
                    .then( empleadoActualizado => {
                        return res.status(200).json(empleadoActualizado)
                    })
                    .catch( err => {
                        const error = new Error(`cliente no editado ${err}`)
                        error.status = 405;
                        return next(error);
                })
})

//agregar clientes a empleados
empleadosRouter.put('/:id/clientes', (req, res) => {
    const id = req.params.id
    const idClienteAAgrear = req.body.clienteId;

    return Empleado.findByIdAndUpdate( 
        id, 
        {$push: {clientes: idClienteAAgrear}} ,
        { new: true }
    )
    .then( empleadoActualizado => {
        return res.status(200).json(empleadoActualizado)
    })
    .catch( err => {
        const error = new Error('empleado no encontrado')
        error.status = 405;
        return next(error);
    })
})

//eliminar empleado
empleadosRouter.delete('/:id', (req, res) => {
    const id = req.params.id
    Empleado.findByIdAndDelete(id)
        .then( () => {
            return res.status(200).json(`El empleado con id ${id} ha sido eliminado`)
        })
        .catch( err => {
            const error = new Error('cliente no encontrado')
            error.status = 405;
            return next(error);
        })
})


module.exports = empleadosRouter;