import Sequelize from 'sequelize';
import { sequelize } from './db';

export const Subject = sequelize.define('subject', {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    details: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    syllabus: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

Subject.associate = (models) => {
    Subject.hasMany(models.classSubjectStaffSelector, {as:'timeTable'});
    Subject.belongsToMany(models.staff, { through: models.specializationSelector });
    models.classSubjectStaffSelector.belongsTo(Subject);
    Subject.belongsTo(models.level);
}