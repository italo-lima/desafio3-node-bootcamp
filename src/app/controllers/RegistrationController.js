import Registration from "../models/Registration"
import User from "../models/User"
import Plan from "../models/Plan"
import {format, parseISO, addDays} from "date-fns"
import pt from "date-fns/locale/pt"

import Notification from "../schema/Notification" //usa mongo

//usando fila
import RegistrationMail from "../jobs/RegistrationMail"
import Queue from "../../lib/Queue"

//sem fila
import Mail from "../../lib/Mail"


import * as Yup from "yup"

class RegistrationController{

    async show(req, res){
        //paginação 
        const {page= 1} = req.query

        const user = await User.findOne({where: {id: req.userId, admin: true}})

        if(!user){
            return res.status(401).json({error: "User not admin"})
        }

        const registrations = await Registration.findAll({
            order:['created_at'], //ordenação
            limit: 2,//limitando o tamanho por página
            offset: (page - 1)*2, //cálculo para paginação
            attributes: ['student_id', 'start_date', 'end_date', 'price'], //informações do registro
            //mostrar informações do plano (só funciona se fizer via associate)
            include: [
                {
                model: Plan,
                attributes: ['title', 'duration', 'price']
                //include:[{}] se tivesse fk em plan, continuaria assim para pegar as informações
            }
        ]
        })

        return res.json(registrations)
    }

    async index(req, res){
        //verificando se usuário existe
        const user = await User.findOne({where: {id: req.userId, admin: true}})

        if(!user){
            return res.status(401).json({error: "User not admin"})
        }

        const {id} = req.params

        //buscando registro
        const registration = await Registration.findByPk(id)

        if(!registration){
            return res.status(401).json({error: "Registration not found"})
        }

        return res.json(registration)
    }

    async store(req, res){

        //validação das informações necessárias para criar um registro
        const schema = Yup.object().shape({
            student_id: Yup.number().required(),
            plan_id: Yup.number().required(),
            start_date: Yup.date().required()
        })

        if(!(await schema.isValid(req.body))){
            return res.status(401).json({error: "Validations Fail"})
        }

        //verificando se usuário é adm
        const user = await User.findOne({where: {id: req.userId, admin: true}})

        if(!user){
            return res.status(401).json({error: "User not admin"})
        }

        const student = await User.findByPk(req.body.student_id)

        if(!student){
            return res.status(401).json({error: "User not found"})
        }

        //buscando plano
        const plan = await Plan.findOne({where: {id: req.body.plan_id}})

        if(!plan){
            return res.status(401).json({error: "Plan not found"})
        }
        
        const registration = await Registration.create(req.body)

        /*
        *  Notify email  
        */

        const formatedDateInitial = format(parseISO(req.body.start_date), 
            "dd 'de' MMMM' de 'yyyy'",
            {locale: pt}
            )
        const formatedDateEnd = format(addDays(registration.end_date, 1), 
            "dd 'de' MMMM' de 'yyyy'",
            {locale: pt}
            )

       /* Para envio sem usar fila */
        await Mail.sendMail({
            to: `${student.name} <${student.email}>`,
            subject: "Inscrição na Gympoint",
            template: "registration", //template hbs
            context: {
                student: student.name,
                formatedDateInitial,
                formatedDateEnd,
                price: registration.price
            }
        }) 

        /* Para envio usando fila 
        await Queue.job(RegistrationMail.key, {
            name: student.name, 
            formatedDateInitial, 
            formatedDateEnd,
            price:registration.price
        }) */

        return res.json(registration)
    }
    
    async update(req, res){
        const user = await User.findOne({where: {id: req.userId, admin: true}})

        if(!user){
            return res.status(401).json({error: "User not admin"})
        }

        const {id} = req.params

        const registration = await Registration.findByPk(id)

        if(!registration){
            return res.status(401).json({error: "Registration not found"})
        }

        const newRegistration = await registration.update(req.body)

        return res.json(newRegistration)
    }

    async delete(req, res){
        const {id} = req.params

        const user = await User.findOne({where: {id: req.userId, admin: true}})

        if(!user){
            return res.status(401).json({error: "User not admin"})
        }

        const registration = await Registration.findByPk(id)

        if(!registration){
            return res.status(401).json({error: "Plan not found"})
        }

        await Registration.destroy({where: {id}})

        return res.send()
    }
}

export default new RegistrationController()