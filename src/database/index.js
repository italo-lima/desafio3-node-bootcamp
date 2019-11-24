import Sequelize from "sequelize"
import mongoose from "mongoose"

import dataBaseConfig from "../config/database"

import User from "../app/models/User"
import Plan from "../app/models/Plan"
import Registration from "../app/models/Registration"
import Checkin from "../app/models/Checkin"
import HelpOrders from "../app/models/HelpOrders"

//Array de models para ser carregado
const models = [User, Plan, Registration, Checkin, HelpOrders]

//conexão com o banco e carregar os models 
class DataBase{
    constructor(){
        this.init()
        this.mongo()
    }

    init(){
        this.connection = new Sequelize(dataBaseConfig)
        models.map(model => model.init(this.connection))
        models.map(model => model.associate && model.associate(this.connection.models))   
    }

    mongo(){
        this.mongoConnection = mongoose.connect(
            'mongodb://172.17.0.3:27017/gympoint',     
            {useNewUrlParser: true, useFindAndModify: true }
        )
    }
}


export default new DataBase()