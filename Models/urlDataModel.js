const { Model, DataTypes } = require('sequelize');
const sequelize = require('../Config/db-config');


class WebLinkModel extends Model { }
     WebLinkModel.init({
    url_id: {
       type: DataTypes.INTEGER,
       primaryKey: true,
       autoIncrement: true
    },
    domain_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    word_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    favourite: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    'web-links': {
        type: DataTypes.STRING,
    },
    'media-links': {
        type: DataTypes.STRING
    }
},{ 
    sequelize, 
    modelName: 'webscrapdata',
    tableName: 'webscrapdata',
 })

 module.exports = WebLinkModel;