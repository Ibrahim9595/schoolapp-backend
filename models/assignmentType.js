import Sequelize from 'sequelize';
import { sequelize } from './db';

export const AssignmentType = sequelize.define('assignment_type', {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },

    description: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    }
});

AssignmentType.associate = (models) => {
    AssignmentType.hasMany(models.assignment);
};