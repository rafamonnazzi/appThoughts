const { Sequelize } = require("sequelize")
const sequelize = new Sequelize("THOUGHTS", "root", "123456",{
    host: "localhost",
    dialect:"mysql"
});

try {
    sequelize.authenticate()
    console.info("Conexão bem sucedida!")
}
catch (error)
{
    console.error("Não foi possível conectar ao banco de dados:", error)
}

module.exports = sequelize