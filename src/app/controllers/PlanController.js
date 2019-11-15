import Plan from "../models/Plan"
import User from "../models/User"
import * as Yup from "yup"

class PlanController{
    
    async show(req, res){

        //verificando se usuário é adm
        const user = await User.findOne({where: {id: req.userId, admin: true}})

        if(!user){
            return res.status(401).json({error: "User not admin"})
        }

        const plans = await Plan.findAll()

        const plansDestruct = []
        plans.forEach(({id, title, duration, price}) => 
            plansDestruct.push({id, title, duration, price}
        ))
        
        return res.json(plansDestruct)
    }

    async index(req, res){
        //verificando se usuário é adm
        const user = await User.findOne({where: {id: req.userId, admin: true}})

        if(!user){
            return res.status(401).json({error: "User not admin"})
        }
        const {id} = req.params

        const plan = await Plan.findByPk(id)

        if(!plan){
            return res.status(401).json({error: "Plan not found"})
        }

        const {title, duration, price} = plan
        return res.json({id, title, duration, price})
    }

    async store(req, res){
        //validação das informações necessárias para criar plano
        const schema = Yup.object().shape({
            title: Yup.string().required(),
            duration: Yup.number().required(),
            price: Yup.number().required()
        })

        if(!(await schema.isValid(req.body))){
            return res.status(401).json({error: "Validations Fail"})
        }

        const user = await User.findOne({where: {id: req.userId, admin: true}})

        if(!user){
            return res.status(401).json({error: "User not admin"})
        }

        const {title, duration, price} = await Plan.create(req.body)

        return res.json({title, duration, price})
    }

    async update(req, res){

        //verificando se usuário é adm
        const user = await User.findOne({where: {id: req.userId, admin: true}})

        if(!user){
            return res.status(401).json({error: "User not admin"})
        }
        
        const {id} = req.params

        const plan = await Plan.findByPk(id)

        if(!plan){
            return res.status(401).json({error: "Plan not found"})
        }

        const {title, duration, price} = await plan.update(req.body)

        return res.json({id, title, duration, price})
    }

    async delete(req, res){
        const {id} = req.params
        //verificando se usuário é adm
        const user = await User.findOne({where: {id: req.userId, admin: true}})

        if(!user){
            return res.status(401).json({error: "User not admin"})
        }

        //verificando se plano existe
        const plan = await Plan.findByPk(id)

        if(!plan){
            return res.status(401).json({error: "Plan not found"})
        }

        await Plan.destroy({where: {id}})

        return res.send()
    }
}

export default new PlanController()