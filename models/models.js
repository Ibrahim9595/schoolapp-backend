import { sequelize } from './db.js';

import { User } from './user';
import { UserType } from './userType';
import { UserGroupSelector } from './userGroupSelector';
import { PermissionGroup } from './permissionGroup';
import { PermissionGroupSelector } from './permissionGroupSelector';
import { Permission } from './permission';
import { Student } from './student'
import { Staff } from './staff';
import { Parent } from './parent';

export const models = {
    user: User,
    userType: UserType,
    userGroupSelector: UserGroupSelector,
    permissionGroup: PermissionGroup,
    permissionGroupSelector: PermissionGroupSelector,
    permission: Permission,
    student: Student,
    parent: Parent,
    staff: Staff, 
    sequelize: sequelize
};

// sequelize.sync()

for(let i in models) {
    if(!(i.match('Selector') || i == 'sequelize')){
        models[i].associate(models);
    }
}