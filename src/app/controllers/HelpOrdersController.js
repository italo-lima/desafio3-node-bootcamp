import User from "../models/User"
import HelpOrders from "../models/HelpOrders"
import * as Yup from "yup"
import Mail from "../../lib/Mail"

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

    async update(req, res){
        /*const schema = Yup.object().shape({
            answer: Yup.string().required()
        })

        if(!(await schema.isValid(req.body))){
            return res.status(401).json({error: "Validations Fail"})
        } */

        const {id} = req.params
        const question = await HelpOrders.findOne({
            where:{id, answer:null},
            attributes:['id','student_id','question','answer','answer_at','created_at','updated_at']
        })
        
        if(!question){
            return res.status(401).json({error: "question not found"})
        }

        const student = await User.findOne({where:{id: question.student_id}})
        
        const {answer} = req.body
        const newQuestion = await question.update(req.body)

        await Mail.sendMail({
            to: `${student.name} <${student.email}>`,
            subject: "Resposta ao pedido de Auxílio na Gympoint",
            template: "answer", //template hbs
            context: {
                student: student.name,
                question: question.question,
                answer
            }
        }) 

        return res.json(newQuestion)
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