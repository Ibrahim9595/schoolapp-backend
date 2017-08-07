import Sequelize from 'sequelize';
import { sequelize } from './db';
import { uniqBy } from 'lodash';
import { flatData } from '../helpers/helperMethods'

export const Student = sequelize.define('student', {
    id: {
        type: Sequelize.INTEGER,
        unique: true,
        primaryKey: true,
        autoIncrement: true
    }
});
//Instance Method
Student.prototype.getContactList = function (models) {
    return models.class.findAll({
        include: [
            { model: models.student, where: { id: this.id } },
            {
                model: models.classSubjectStaffSelector,
                as: 'timeTableElements',
                include: { model: models.staff, include: models.user }
            }
        ]
    }).then(allData => {
        let contactList = [];

        allData.map(data => {    
            let timeTableElements = uniqBy(data.timeTableElements, 'staff.id');
            timeTableElements.map(timeTableElement => {
                timeTableElement.staff.userType = 'staff';
                contactList.push(flatData(timeTableElement.staff, 'user'));
            });
        });
        
        return contactList;
    });
}

//Class Method
Student.associate = (models) => {
    Student.hasMany(models.absenceDay);
    Student.hasMany(models.assignmentResult);
    Student.belongsTo(models.user);
    Student.belongsTo(models.parent);
    Student.belongsToMany(models.class, { through: models.classStudentSelector });
};