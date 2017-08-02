import Sequelize from 'sequelize';
import { sequelize } from './db';

export const SpecializationSelector = sequelize.define('specialization_selector', {
    rate: {
        type: Sequelize.STRING,
        allowNull: true
    }
});