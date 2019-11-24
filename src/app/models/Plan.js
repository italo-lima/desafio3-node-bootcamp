import Sequelize, { Model } from "sequelize"

class Plan extends Model {
    static init(sequelize){
        //são as colunas preenchidas pelos usuários (exemplo, pk n entra)
        super.init(
            {
            title: Sequelize.STRING,
            duration: Sequelize.INTEGER,
            price: Sequelize.FLOAT
            }, 
            {
                sequelize  //conexão que vem de database/index
            }
        )
        return this

        }
    }

export default Plan
