import Sequelize from 'sequelize';
import { sequelize } from './db';

export const Staff = sequelize.define('staff', {
    id: {
        type: Sequelize.INTEGER,
        unique: true,
        primaryKey: true,
        autoIncrement: true
    },
    job: {
        type: Sequelize.STRING
    }
});

Staff.associate = (models) => {
    Staff.belongsTo(models.user);
};