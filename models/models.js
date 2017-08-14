import { sequelize } from './db.js';

import { User } from './user';
import { UserType } from './userType';
import { UserGroupSelector } from './userGroupSelector';
import { PermissionGroup } from './permissionGroup';
import { PermissionGroupSelector } from './permissionGroupSelector';
import { Permission } from './permission';
import { Student } from './student'
import { Staff } from './staff';
import { StaffType } from './staffType';
import { Parent } from './parent';
import { Class } from './class';
import { ClassStudentSelector } from './classStudentSelector';
import { Subject } from './subject';
import { Level } from './level';
import { ClassSubjectStaffSelector } from './classSubjectStaffSelector';
import { AbsenceReason } from './absenceReason';
import { AbsenceDay } from './absenceDay';
import { AssignmentType } from './assignmentType';
import { Assignment } from './assignment';
import { AssignmentResult } from './assignmentResult';
import { MessageStatus } from './messageStatus';
import { MessageBody } from './messageBody';
import { SpecializationSelector } from './specializationSelector';

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
    staffType: StaffType, 
    class: Class,
    classStudentSelector: ClassStudentSelector,
    classSubjectStaffSelector: ClassSubjectStaffSelector,
    subject: Subject,
    level: Level,
    specializationSelector: SpecializationSelector,
    absenceReason: AbsenceReason,
    absenceDay: AbsenceDay,
    assignmentType: AssignmentType,
    assignment: Assignment,
    assignmentResult: AssignmentResult,
    messageBody: MessageBody,
    messageStatus: MessageStatus,
    sequelize: sequelize
}

// console.log(models);

for(let i in models) {
    if(!(i.match('Selector') || i == 'sequelize')){
        models[i].associate(models);  
    }
}

// sequelize.sync({force: true})