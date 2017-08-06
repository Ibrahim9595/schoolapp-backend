import Sequelize from 'sequelize';
import { sequelize } from './db';

export const User = sequelize.define('users', {
    id: {
        type: Sequelize.INTEGER,
        unique: true,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: Sequelize.STRING,
        validate: {
            is: /^[a-z0-9]{32}$/
        }
    }
});

User.associate = (models) => {

    User.belongsTo(models.userType, {as: 'userType'});

    User.hasOne(models.parent, {
        'constraints': true,
        'onUpdate': 'cascade',
        'onDelete': 'cascade'
    });

    User.hasOne(models.student, {
        'constraints': true,
        'onUpdate': 'cascade',
        'onDelete': 'cascade'
    });

    User.hasOne(models.staff, {
        'constraints': true,
        'onUpdate': 'cascade',
        'onDelete': 'cascade',
    });

    User.hasMany(models.messageBody, {foreignKey: 'senderId'});
    User.hasMany(models.messageStatus, {foreignKey: 'recieverId'});

    User.belongsToMany(models.permissionGroup, { through: models.userGroupSelector, as: 'permissions' });
};
