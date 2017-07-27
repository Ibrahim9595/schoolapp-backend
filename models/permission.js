import Sequelize from 'sequelize';
import { sequelize } from './db';

export const Permission = sequelize.define('permission', {
    id: {
        type: Sequelize.INTEGER,
        unique: true,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        unique: true
    },

    route: {
        type: Sequelize.STRING,
        unique: true
    }
});


Permission.associate = (models) => {
    Permission.belongsToMany(models.permissionGroup, { through: models.permissionGroupSelector });
};
