const {Sequelize} = require('sequelize')

const sequelize = new Sequelize('THOUGHTS', 'root', 'M@g062421',{
    host: 'localhost',
    dialect:'mysql'
});

try {
    sequelize.authenticate()
    console.info('Conectado ao serviço de dados.')
} catch (error) {
    console.error('Não conectamos ao serviço de dados => ', error)
}

module.exports = sequelize