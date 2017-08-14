import Sequelize from 'sequelize';
import { sequelize } from './db';

export const StaffType = sequelize.define('staff_type', {
    id: {
        type: Sequelize.INTEGER,
        unique: true,
        primaryKey: true,
        autoIncrement: true
    },
    type: {
        type: Sequelize.STRING,
        unique: true
    }
});

StaffType.associate = (models) => {
    StaffType.hasMany(models.staff, {
        'constraints': true,
        'onUpdate': 'cascade',
        'onDelete': 'cascade',
    });
};