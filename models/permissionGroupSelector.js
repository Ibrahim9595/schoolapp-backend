import Sequelize from 'sequelize';
import { sequelize } from './db';

export const PermissionGroupSelector = sequelize.define('permission_group_selector', { 
    permissionLevel: {
        type: Sequelize.BOOLEAN
    }
});    