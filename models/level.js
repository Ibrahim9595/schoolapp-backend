import Sequelize from 'sequelize';
import { sequelize } from './db';

export const Level = sequelize.define('level', {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    priority: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true
    },
});

Level.associate = (models) => {
    Level.hasMany(models.class, {
        'constraints': true,
        'onUpdate': 'cascade',
        'onDelete': 'cascade',
    });

    Level.hasMany(models.subject, {
        'constraints': true,
        'onUpdate': 'cascade',
        'onDelete': 'cascade',
    });

    Level.hasMany(models.student);
};