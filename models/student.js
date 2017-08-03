import Sequelize from 'sequelize';
import { sequelize } from './db';

export const Student = sequelize.define('student', {
    id: {
        type: Sequelize.INTEGER,
        unique: true,
        primaryKey: true,
        autoIncrement: true
    }
});

Student.associate = (models) => {
    Student.hasMany(models.absenceDay);
    Student.belongsTo(models.user);
    Student.belongsTo(models.parent);
    Student.belongsToMany(models.class, { through: models.classStudentSelector });
};