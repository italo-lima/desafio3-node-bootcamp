import Mail from "../../lib/Mail"

class RegistrationMail{
    //chave que identifica o nome do job
    get key(){
        return 'RegistrationMail'
    }

    //função para executar o job
    async handle({data}){
        
        const {name, formatedDateInitial, formatedDateEnd, price} = data

        await Mail.sendMail({
            to: `${student.name} <${student.email}>`,
            subject: "Inscrição na Gympoint",
            template: "registration", //template hbs
            context: {
                student: name,
                formatedDateInitial,
                formatedDateEnd,
                price
            }
        })
    }
}

export default RegistrationMail