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
    },
    img: {
        type: Sequelize.STRING
    },
    gender: {
        type: Sequelize.STRING
    }
});

//Intstance Level Method
User.prototype.getSentMessages = function(models) {
    return this.getMessageBodies({
        include: {
            model: models.messageStatus,
            include: {model: models.user, as: 'reciever'}
        }
    }).then(user => {
        return user;
    });
}

User.prototype.getRecievedMessages = function(models) {
    return this.getMessageStatus({
        include: {
            model: models.messageBody,
            include: {model: models.user, as: 'sender'}
        }
    }).then(user => {
        return user;
    });
}

//Class level method
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

    User.hasMany(models.messageBody, {foreignKey: 'senderId', as: 'messageBodies'});
    User.hasMany(models.messageStatus, {foreignKey: 'recieverId',  as: 'messageStatus'});

    User.belongsToMany(models.permissionGroup, { through: models.userGroupSelector, as: 'permissions' });
};
