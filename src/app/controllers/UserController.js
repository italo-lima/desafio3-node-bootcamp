import User from "../models/User"
import * as Yup from "yup"

class UserController{

    async show(req, res){
        //listando tds os usuários
        const users = await User.findAll()

        const usersDestruct = []
        users.forEach(({name, email, admin}) => usersDestruct.push({name, email, admin}))
        
        return res.json(usersDestruct)
    }

    async index(req, res){
        const {id} = req.params
        
        //listando apenas 1 usuário
        //const {name, email, admin} = await User.findOne({where: {id}})
        const {name, email, admin} = await User.findByPk(id)

        return res.json({name, email, admin})
    }

    async store(req, res){

        //validação dos campos necessários para cadastro
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            password: Yup.string().required().min(6),
        })

        if(!(await schema.isValid(req.body))){
            return res.status(401).json({error: "Validations Fail"})
        }

        //verificando se usuário já existe
        const userExists = await User.findOne({where: {email: req.body.email}})

        if(userExists){
           return res.status(401).json({error: "User already exists"})
        }

        const {id, name, email, admin} = await User.create(req.body)

        return res.json({id, name, email, admin})
    }

    async update(req, res){

         //validação dos campos necessários para atualizar
        const schema = Yup.object().shape({
            name: Yup.string(),
            email: Yup.string().email(),
            oldPassword: Yup.string().min(6),
            //field refere-se ao password
            password: Yup.string().min(6).when('oldPassword', (oldPassword, field) => 
                oldPassword ? field.required() : field
            ),
            //Yup.ref -> garante que confirmPassword sejá igual ao password
            confirmPassword: Yup.string().when('password', (password, field) => 
                password ? field.required().oneOf([Yup.ref('password')]) : field
            )
        })

        if(!(await schema.isValid(req.body))){
            return res.status(401).json({error: "Validations Fail"})
        }

        const {email, oldPassword} = req.body

        //buscando usuário
        const user = await User.findByPk(req.userId)

        //se email cadastrado for diferente do digitado, então quer alterar email
        if(user.email !== email){
            const userExists = await User.findOne({where: {email}})

            if(userExists){
               return res.status(401).json({error: "User already exists"})
            }
        }

        //para atualizar senha, oldpassword deve ser igual ao password cadastrado
        if(oldPassword && !(await user.passwordValidate(oldPassword))){
            return res.status(401).json({error: "Password does not match"})
        }

        const {id, name, admin} = await user.update(req.body)


        return res.json({id,name, email, admin })
    }

    async delete(req, res){

        const id = req.userId
        await User.destroy({where: {id}})

        return res.send()
    }
}

export default new UserController()