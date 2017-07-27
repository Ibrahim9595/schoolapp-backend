import Sequelize from 'sequelize';
import { sequelize } from './db';

export const PermissionGroup = sequelize.define('permission_group', {
    id: {
        type: Sequelize.INTEGER,
        unique: true,
        primaryKey: true,
        autoIncrement: true
    },
    groupName: {
        type: Sequelize.STRING,
        unique: true
    },

    description: {
        type: Sequelize.TEXT,
        validate: {
            tooLarge(value) {
                if (value.length >= 100)
                    throw new Error('Description is too large');
            }
        }
    }
});

PermissionGroup.associate = (models) => {
    PermissionGroup.belongsToMany(models.user, { through: models.userGroupSelector });
    PermissionGroup.belongsToMany(models.permission, { through: models.permissionGroupSelector });
};