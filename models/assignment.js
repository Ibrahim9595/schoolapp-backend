import Sequelize from 'sequelize';
import { sequelize } from './db';

export const Assignment = sequelize.define('assignment', {
    description: {
        type: Sequelize.TEXT,
        allowNull: false
    },

    notes: {
        type: Sequelize.TEXT,
        allowNull: true
    },

    finalScore: {
        type: Sequelize.INTEGER,
        allowNull: false
    },

    dueDate: {
        type: Sequelize.DATE,
        allowNull: false
    }
});

Assignment.associate = (models) => {
    Assignment.hasMany(models.assignmentResult, {as: 'results'}, 
    {
        'constraints': true,
        'onUpdate': 'cascade',
        'onDelete': 'cascade',
    });
    Assignment.belongsTo(models.staff);
    Assignment.belongsTo(models.class);
    Assignment.belongsTo(models.subject);
    Assignment.belongsTo(models.assignmentType);
};