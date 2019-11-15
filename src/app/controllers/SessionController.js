import User from "../models/User"
import jwt from "jsonwebtoken"
import authConfig from "../../config/auth"
import * as Yup from "yup"

class SessionController{
    async store(req, res){

        const schema = Yup.object().shape({
            email: Yup.string().email().required(),
            password: Yup.string().required(),
        })

        if(!(await schema.isValid(req.body))){
            return res.status(401).json({error: "Validations Fail"})
        }


        const {email, password} = req.body

        const user = await User.findOne({where: {email}})

        if(!user){
            return res.status(401).json({error: "User not found"})
        }

        if(!(await user.passwordValidate(password))){
            return res.status(401).json({error: "Password does not match"})
        }

        const {id, name} = user
        return res.json({
            user: {
                id, name, email
            },
            //primeiro param -> informação adicional para o hash (usa id para poder pegar usar depois)
            //segund param -> texto único da aplicação (usa https://www.md5online.org/ para gerar o texto crptografado)
            //terceiro param -> configuração do jwt (tempo de expiração, por exemplo)
            token: jwt.sign({id}, authConfig.secret, {
                expiresIn: authConfig.expiresIn
            })
        })
    }
}

export default new SessionController()