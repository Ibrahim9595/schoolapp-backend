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
    AbsenceDay.belongsTo(models.absenceReason);
    AbsenceDay.belongsTo(models.student);
    AbsenceDay.belongsTo(models.staff);
    AbsenceDay.belongsTo(models.class);
    AbsenceDay.belongsTo(models.subject);
}