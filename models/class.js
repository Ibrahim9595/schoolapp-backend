import Sequelize from 'sequelize';
import { sequelize } from './db';

export const Class = sequelize.define('class', {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    capacity: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    minGrade: {
        type: Sequelize.INTEGER,
        allowNull: true
    }
});

Class.associate = (models) => {
    Class.belongsToMany(models.student , { through: models.classStudentSelector});
    Class.hasMany(models.classSubjectStaffSelector, {as:'TimeTable'});
    models.classSubjectStaffSelector.belongsTo(Class);
    Class.belongsTo(models.level, {
        'constraints': true,
        'onUpdate': 'cascade',
        'onDelete': 'cascade',
    });
};