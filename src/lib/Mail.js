import nodemailer from "nodemailer"
import mailConfig from "../config/mail"

import {resolve} from "path"

import exhbs from "express-handlebars"
import nodemailerhbs from "nodemailer-express-handlebars"

//Classe para envio de e-mail
class Mail{
    constructor(){
        const {host, port, secure, auth} = mailConfig

        this.transporter = nodemailer.createTransport({
            host,
            port,
            secure,
            auth: auth.user ? auth : null
        })

        //Chamada da função
        this.configureTemplate()
    }

    //template do e-mail usando handlebars
    configureTemplate(){
        const viewPath = resolve(__dirname, "..", "..","src", 'app', 'views', 'emails')

        //alterando compile para reconhecer o hbs
        this.transporter.use('compile', nodemailerhbs({
            viewEngine: exhbs.create({
                layoutsDir: resolve(viewPath, 'layouts'),
                partialsDir: resolve(viewPath, 'partials'),
                defaultLayout: 'default',
                extname: '.hbs'
            }),
            viewPath,
            extName: '.hbs'
        }))
    }

    //Função responsável por enviar e-mail
    sendMail(message){
        return this.transporter.sendMail({
            ...mailConfig.default,
            ...message
        })
    }
}

export default new Mail()