//ferramenta de fila
//classe de fila
import Bee from "bee-queue"
import RegistrationMail from "../app/jobs/RegistrationMail"
import redisConfig from "../config/redis"

const jobs = [RegistrationMail]

class Queue {
    constructor(){
        this.queues={}

        this.init()
    }

    //inicia o job e cria instância com redis
    init(){
        jobs.forEach(({key, handle}) => {
            this.queues[key] = {
                bee: new Bee(key, {
                    redis: redisConfig,
                }),
                handle
            }
        })
    }

    //adiciona job na fila
    add(queue, job){
        return this.queues[queue].bee.createJob(job).save()
    }

    //processando as filas
    processQueue(){
        jobs.forEach(job => {
            const {bee, handle} = this.queues[job.key]

            bee.process(handle)
        })
    }
}

export default new Queue()