import Sequelize, { Model } from "sequelize"
import Plan from "../models/Plan"
import {addMonths} from "date-fns"

class Registration extends Model {
    static init(sequelize){
        super.init(
            {
                student_id: Sequelize.INTEGER, 
                start_date: Sequelize.DATE,
                end_date: Sequelize.DATE,
                price: Sequelize.FLOAT        
            },
            {
                sequelize
            }
        )

        this.addHook('beforeSave', async(registration) => {
            const {duration, price} = await Plan.findByPk(registration.plan_id)
            registration.price = duration * price
            registration.end_date = addMonths(registration.start_date, duration)
        })

        return this
    }

    /*fazendo relacionamento da nova coluna (plan_id) com a tabela registrations, fazendo isso pq a 
    coluna foi adiciona via migrations */
    /*quando fk inserida diretamente no ato da criação da tabela, n precisa disso, basta jogar no init */
    static associate(models){
    this.belongsTo(models.Plan, {foreignKey: 'plan_id'/*, as: 'plan' <-apelido*/})
    }

}

export default Registration