import Sequelize from 'sequelize';
import { sequelize } from './db';

export const AbsenceReason = sequelize.define('absence_reason', {
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

AbsenceReason.associate = (models) => {
    // AbsenceReason.hasMany(models.absence);
};