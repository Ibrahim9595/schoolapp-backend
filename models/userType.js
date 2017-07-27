import Sequelize from 'sequelize';
import { sequelize } from './db';

export const UserType = sequelize.define('user_type', {
    id: {
        type: Sequelize.INTEGER,
        unique: true,
        primaryKey: true,
        autoIncrement: true
    },
    tableName: {
        type: Sequelize.STRING,
        unique: true
    }
});

UserType.associate = (models) => {
    UserType.hasMany(models.user, {
        'constraints': true,
        'onUpdate': 'cascade',
        'onDelete': 'cascade',
    });
};