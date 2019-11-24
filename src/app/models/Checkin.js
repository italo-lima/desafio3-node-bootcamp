import  {Model} from "sequelize"

class Checkin extends Model {
    static init(sequelize){
        super.init({}, {sequelize})

        return this
    }

    static associate(models){
        this.belongsTo(models.User, {foreignKey: 'student_id'})
    }
}

export default Checkin