import express from "express"
import routes  from './routes'

import './database' 

class App {
    constructor(){
        this.server = express()
        this.middlewares()
        this.routes()
    }

    //Para aplicação conseguir mandar e receber json
    middlewares(){
        this.server.use(express.json());
    }

    // Instânciado a rotas
    routes(){
        this.server.use(routes)
    }
}

//Exportando apenas a variável server
export default new App().server