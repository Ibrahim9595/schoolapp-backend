import Sequelize from 'sequelize';
import { sequelize } from './db';

export const ClassSubjectStaffSelector = sequelize.define('class_subject_staff_selector', {
    day: {
        type: Sequelize.DATE,
        allowNull: false
    },
    timeStart: {
        type: Sequelize.DATE,
        allowNull: false
    },
    timeEnd: {
        type: Sequelize.DATE,
        allowNull: false
    }
});

