module.exports = {
    dialect: 'postgres',
    host: 'localhost',
    username: 'postgres',
    password: 'nodedesafio3',
    database: 'nodeDesafio3',
    define: {
        timestamps: true,
        underscored: true,   //formato caixa baixa e separado por _
        underscoredAll: true //para as colunas
    }
}