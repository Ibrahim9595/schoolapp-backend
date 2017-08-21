import Sequelize from 'sequelize';
import { sequelize } from './db';

export const ClassSubjectStaffSelector = sequelize.define('class_subject_staff_selector', {
    day: {
        type: Sequelize.STRING,
        allowNull: false
    },
    dayNum: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    timeStart: {
        type: Sequelize.TIME,
        allowNull: false,
        unique: true
    },
    timeEnd: {
        type: Sequelize.TIME,
        allowNull: false,
        unique: true
    }
});

