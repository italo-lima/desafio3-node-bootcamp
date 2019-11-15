import Sequelize, { Model } from "sequelize"
import bcrypt from "bcryptjs"

class User extends Model {
    static init(sequelize){
        //são as colunas preenchidas pelos usuários (exemplo, pk n entra)
        super.init(
            {
            name: Sequelize.STRING,
            email: Sequelize.STRING,
            password: Sequelize.VIRTUAL,  //existe apenas no código
            password_hash: Sequelize.STRING,
            admin: Sequelize.BOOLEAN,
            }, 
            {
                sequelize  //conexão que vem de database/index
            }
        )

        this.addHook('beforeSave', async (user) => {
            //password_hash só será gerado quando password for informado
            if(user.password){
                user.password_hash = await bcrypt.hash(user.password, 8)
            }
        })
        return this
        }

        passwordValidate(password){
            return bcrypt.compare(password, this.password_hash)
        }
    }

export default User