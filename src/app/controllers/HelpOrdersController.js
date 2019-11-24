import User from "../models/User"
import HelpOrders from "../models/HelpOrders"
import * as Yup from "yup"

class HelpOrdersController{
    async store(req, res){
        const schema = Yup.object().shape({
            question: Yup.string().required()
        })

        if(!(await schema.isValid(req.body))){
            return res.status(401).json({error: "Validations Fail"})
        }
        const {id} = req.params
        const user = await User.findByPk(id)

        if(!user){
            return res.status(401).json({error: "User not found"})
        }
        const question = req.body.question
        await HelpOrders.create({student_id: id, question})

        return res.json({ok: true})
    }

    async index(req, res){
        const {id} = req.params
        const user = await User.findByPk(id)

        if(!user){
            return res.status(401).json({error: "User not found"})
        }

        const orders = await HelpOrders.findAll({where: {id}})

        return res.json(orders)

    }

    async show(req, res){
        const orders = await HelpOrders.findAll({
            where:{answer: null},
            attributes:['id', 'created_at', 'question', 'answer'],
            include:[{
                model: User,
                attributes:['id','name','admin']
            }]
        })

        return res.json(orders)
    }
}

export default new HelpOrdersController()