const express = require('express')
const cochesRouter = require('./router/coches.router')
const clientesRouter = require('./router/clientes.router')
const empleadosRouter = require('./router/empleados.router')
const db = require('./db')

const PORT = 3000

const server = express()

//express body parsser middlewares
server.use(express.json())
server.use(express.urlencoded({ extended: false })) // false usa querystring, true usa qs que es mas pesada

//Ruta de asterisco debe ser siempre la ultima permite manejar las paginas no encontradas

//aplica metodo get
server.get('/', (req, res) => {
    res.status(200).send('Server Up and Running')
});

//if parameter /coches use coches router
server.use('/coches', cochesRouter)
server.use('/clientes', clientesRouter)
server.use('/empleados', empleadosRouter)

//use coge lo que venga no importa el metodo
server.use('*', (req, res, next) => {
    const error = new Error('Ruta no encontrada')
    error.status = 404
    return next(error)  //pasa al manejador de errores
});

//manejador de errores
server.use((err, _req, res, _next) => {
    return res
            .status(err.satus || 500)
            .json(err.message || 'Error Inesperado del servidor')
});

//conectamos a BBDD y luego lanzamos server
db.connectDB().then( ()=> {
    console.log('Conectado a base de datos mongo')
    server.listen(PORT, () => {
        console.log(`Iniciado server en puerto ${PORT}`)
    })
}).catch( (e) => {
    console.log(`Ha habido un error de conexion con BBDD: ${e}`)
})

