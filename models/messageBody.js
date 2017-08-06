import Sequelize from 'sequelize';
import { sequelize } from './db';

export const MessageBody = sequelize.define('message_body', {
    body: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

MessageBody.associate = (models) => {
    MessageBody.hasMany(models.messageStatus, {
        'constraints': true,
        'onUpdate': 'cascade',
        'onDelete': 'cascade',
    });
    MessageBody.belongsTo(models.user, { foreignKey: 'senderId', as: 'sender' });
};