import Sequelize from 'sequelize';
import { sequelize } from './db';
import { uniqBy } from 'lodash';
import { flatData } from '../helpers/helperMethods'

export const Staff = sequelize.define('staff', {
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
Staff.prototype.getContactList = function(models) {
    return this.getTimeTableElements({
        include: {
            model: models.class, 
            include: {
                model: models.student,
                include: models.user
            }
        } 
    }).then((allData => {
        let contactList = [];
        allData = uniqBy(allData, 'class.id');
        allData.map(data => {
             data.class.students.map(student => {
                 student.userType = 'student';
                contactList.push(flatData(student, 'user'));
             });
        });
        
        return models.staff.findAll({
            include: models.user, 
            where: {userId: {$ne: this.userId}}
        }).then(staffs => {
            staffs.map(staff => {
                staff.userType = 'staff';
                contactList.push(flatData(staff, 'user'));
            });
            
            return contactList;
        })

    }).bind(this))
}

//Class Method
Staff.associate = (models) => {
    Staff.belongsTo(models.user);
    Staff.belongsToMany(models.subject, { through: models.specializationSelector });
    Staff.hasMany(models.classSubjectStaffSelector, {as: "timeTableElements"});
    Staff.belongsTo(models.staffType, {as: 'staffType'});
    models.classSubjectStaffSelector.belongsTo(Staff);
};