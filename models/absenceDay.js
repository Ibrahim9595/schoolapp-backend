import Sequelize from 'sequelize';
import { sequelize } from './db';

export const AbsenceDay = sequelize.define('absence_day', {
    date: {
        type: Sequelize.DATEONLY,
        allowNull: false
    },

    notes: {
        type: Sequelize.TEXT,
        allowNull: true
    }
});

AbsenceDay.associate = (models) => {
    AbsenceDay.belongsTo(models.absenceReason, {
        'constraints': true,
        'onUpdate': 'cascade',
        'onDelete': 'cascade'
    });
    AbsenceDay.belongsTo(models.student, {
        'constraints': true,
        'onUpdate': 'cascade',
        'onDelete': 'cascade'
    });
    AbsenceDay.belongsTo(models.staff, {
        'constraints': true,
        'onUpdate': 'cascade',
        'onDelete': 'cascade'
    });
    AbsenceDay.belongsTo(models.class, {
        'constraints': true,
        'onUpdate': 'cascade',
        'onDelete': 'cascade'
    });
    AbsenceDay.belongsTo(models.subject, {
        'constraints': true,
        'onUpdate': 'cascade',
        'onDelete': 'cascade'
    });
}