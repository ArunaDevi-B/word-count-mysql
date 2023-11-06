const {Sequelize, DataTypes} = require("sequelize");
const env = require('dotenv');
env.config();
let dbConfig = {
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
    multipleStatements: true,
    dialect: 'mysql'
};
const sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.user,
    dbConfig.password, {
        host: dbConfig.host,
        operatorsAliases: false,
        dialect: dbConfig.dialect,
    }
)
function connecDB() {
    sequelize.authenticate()
    .then(() => {
        console.log("DB Successfully Connected...");
    }).catch(error => {
        console.log("error" + error);
    })
    sequelize.sync({ force: false }).then(()=>{
        console.log("re-sync is done!");
    })
    
}
connecDB()
module.exports = sequelize;