const {Sequelize, DataTypes} = require("sequelize");

let dbConfig = {
    host: "localhost",
    user: "root",
    password:"",
    database:"webscraperdb",
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