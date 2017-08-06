import Sequelize from 'sequelize';
import { sequelize } from './db';

export const MessageStatus = sequelize.define('message_status', {
    isRead: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
});

MessageStatus.associate = (models) => {
    MessageStatus.belongsTo(models.messageBody);
    MessageStatus.belongsTo(models.user, { foreignKey: 'recieverId',  as: 'reciever'});
};