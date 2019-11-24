import Sequelize, {Model} from "sequelize"

class HelpOrders extends Model{
    static init(sequelize){
        super.init({
            question: Sequelize.STRING
        },
        {
            sequelize
        })
        return this
    }

    static associate(models){
        this.belongsTo(models.User, {foreignKey: 'student_id'})
    }
}

export default HelpOrders