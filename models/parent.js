import Sequelize from 'sequelize';
import { sequelize } from './db';

export const Parent = sequelize.define('parent', {
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
//Instance Method


//Class Method
Parent.associate = (models) => {
    Parent.belongsTo(models.user);
    Parent.hasMany(models.student, {
        'constraints': true,
        'onUpdate': 'cascade',
        'onDelete': 'cascade',
    });
};