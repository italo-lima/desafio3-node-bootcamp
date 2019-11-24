import Checkin from "../models/Checkin"
import User from "../models/User"
import {Op} from "sequelize"
import {startOfWeek, endOfWeek} from "date-fns"

class CheckinController{

    async index(req, res){
        const {id} = req.params
      
        const user = await User.findOne({where: {id}})
      
        if(!user){
            return res.status(401).json({error: "User not admin"})
        }

        const {count} = await Checkin.findAndCountAll({where: {student_id: id}})
        
        return res.json(count)
    }

    async store(req, res){
        const {id} = req.params
      
        const user = await User.findOne({where: {id}})
      
        if(!user){
            return res.status(401).json({error: "User not found"})
        }

        const dateToday = new Date()
        const {count} = await Checkin.findAndCountAll({where: {
            student_id: id, 
            createdAt: {
                [Op.between]: [startOfWeek(dateToday), endOfWeek(dateToday)]
            }
           }})
           
        if(count >= 5){
            return res.status(401).json({error: "User max checkin"})
        }

        const checkin = await Checkin.create({student_id:id})

        return res.json(checkin)
    }
}

export default new CheckinController()