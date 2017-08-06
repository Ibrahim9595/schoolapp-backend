import Sequelize from 'sequelize';
import { sequelize } from './db';

export const AssignmentResult = sequelize.define('assignment_result', {
    score: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    notes: {
        type: Sequelize.TEXT,
        allowNull: true
    }
});

AssignmentResult.associate = (models) => {
    AssignmentResult.belongsTo(models.assignment);
    AssignmentResult.belongsTo(models.student);
};