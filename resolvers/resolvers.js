import md5 from 'md5';
import jwt from 'jsonwebtoken';
import { find, groupBy } from 'lodash';

function flatData(obj, key) {
  let inside = obj.dataValues[key].dataValues;

  for (let i in inside) {
    if (!obj.dataValues.hasOwnProperty(i))
      obj[i] = inside[i]

  }

  return obj;
}

function resolveUserPermissions(models, id) {
  return models.sequelize.query(`
      SELECT  permissions.id, permissions.route, permissions.name, max(permission_group_selectors.permissionLevel) as permissionLevel
      FROM permission_group_selectors 
      left join permissions on permission_group_selectors.permissionId = permissions.id 
      WHERE permissionGroupId IN 
      (SELECT permission_groups.id from user_group_selectors 
      LEFT join permission_groups on permission_groups.id = user_group_selectors.permissionGroupId
      LEFT join users on users.id = user_group_selectors.userId
      WHERE users.id = ${id}
      )
      GROUP by  permissions.id
  `);
}

export const resolvers = {
  Query: {
    //System Users & permission
    user: (_, { id }, models) => {
      return models.user.findById(id, {
        include: { model: models.userType, as: 'userType' },
        attributes: ['userType.tableName', 'id'],
        raw: true
      }).then((userType) => {
        return models[userType.tableName]
          .find({ where: { userID: userType.id }, include: models.user })
          .then((all) => {
            console.log(all);
            if (all) {
              let data = flatData(all, 'user');
              data.userType = userType.tableName;
              return data;
            }
          });
      });
    },

    users: (_, $, models) => {
      return models.user.findAll({
        include: { model: models.userType, as: 'userType' },
        raw: true
      }).then((users) => {
        return users.map(user => {
          user.userType = user['userType.tableName'];
          user.userId = user.id;
          return user;
        });
      });
    },

    parent: (_, { id }, models) => {
      return models.parent
        .findById(id, { include: models.user })
        .then((all) => {
          if (all)
            return flatData(all, 'user')
        });
    },

    parents: (_, $, models) => {
      return models.parent
        .findAll({ include: models.user })
        .then((all) => {
          if (all)
            return all.map((a) => {
              return flatData(a, 'user')
            });
        });
    },

    student: (_, { id }, models) => {
      return models.student
        .findById(id, { include: models.user })
        .then((all) => {
          if (all)
            return flatData(all, 'user')
        });
    },

    students: (_, $, models) => {
      return models.student
        .findAll({ include: models.user })
        .then((all) => {
          if (all)
            return all.map((a) => {
              return flatData(a, 'user')
            });
        });
    },

    staff: (_, { id }, models) => {
      return models.staff
        .findById(id, { include: models.user })
        .then((all) => {
          if (all)
            return flatData(all, 'user')
        });
    },

    staffs: (_, $, models) => {
      return models.staff
        .findAll({ include: models.user })
        .then((all) => {
          if (all)
            return all.map((a) => {
              return flatData(a, 'user')
            });
        });

    },

    permissions: (_, $, models) => {
      return models.permission.findAll();
    },

    permissionGroup: (_, { id }, models) => {
      return models.permissionGroup.findById(id);
    },

    permissionGroups: (_, $, models) => {
      return models.permissionGroup.findAll();
    },

    //System levels & subjects
    levels: (_, args, models) => {
      return models.level.findAll({ order: ['priority'] });
    },

    level: (_, args, models) => {
      return models.level.findById(args.id,
        { include: { model: models.student, include: models.user } })
        .then(data => {
          data.students = data.students.map(student => {
            return flatData(student, 'user');
          });

          return data;
        });
    },

    classes: (_, args, models) => {
      return models.class.findAll();
    },

    class: (_, args, models) => {
      return models.class.findById(args.id,
        { include: { model: models.student, include: models.user } })
        .then(data => {
          data.students = data.students.map(student => {
            return flatData(student, 'user');
          });

          return data;
        });
    },

    subjects: (_, args, models) => {
      return models.subject.findAll();
    },

    subject: (_, args, models) => {
      return models.subject.findById(args.id);
    },

    absenceReasons: (_, args, models) => {
      return models.absenceReason.findAll();
    }
  },

  //System Users & permissions
  Student: {
    parent: (student, _, models) => {
      return student
        .getParent({ include: models.user })
        .then((all) => {
          if (all)
            return flatData(all, 'user')
        });
    },

    permissionGroups: (student, _, models) => {
      return student.user.getPermissions();
    },

    class: (student) => {
      return student.getClasses().then((classes) => classes[0]);
    },

    permissions: (student, _, models) => {
      return resolveUserPermissions(models, student.userId).then(data => {
        return data[0];
      });
    }
  },

  Parent: {
    children: (parent, _, models) => {
      return parent
        .getStudents({ include: models.user })
        .then((all) => {
          if (all)
            return all.map(a => {
              return flatData(a, 'user');
            });
        });
    },

    permissionGroups: (parent, _, models) => {
      return parent.user.getPermissions();
    },

    permissions: (parent, _, models) => {
      return resolveUserPermissions(models, parent.userId).then(data => {
        return data[0];
      });
    }
  },

  Staff: {
    permissionGroups: (staff, _, models) => {
      return staff.user.getPermissions();
    },

    permissions: (staff, _, models) => {
      return resolveUserPermissions(models, staff.userId).then(data => {
        return data[0];
      });
    },

    timeTable: (staff, _, models) => {
      return staff.getTimeTableElements({
        include: [models.subject, models.class],
        order: ['dayNum', 'timeStart']
      })
        .then((timeTableElements) => {
          let days = groupBy(timeTableElements, 'dayNum');
          let dayTimeTable = [];
          for (let i in days) {
            dayTimeTable[parseInt(i)] = days[i];
          }
          return dayTimeTable;
        });
    },

    subjects: (staff, _, models) => {
      return staff.getSubjects();
    }

  },

  PermissionGroup: {
    permissions: (permissionGroup, _, models) => {
      return permissionGroup.getPermissions({ raw: true })
        .then((permissions) => {
          return permissions.map(permission => {
            permission.permissionLevel = permission['permission_group_selector.permissionLevel']
            return permission
          });
        });
    },

    users: (permissionGroup, _, models) => {
      return permissionGroup.getUsers().then((users) => {
        return users.map(user => {
          return models.userType.findAll().then(types => {
            user.userType = find(types, { id: user.userTypeId }).tableName;
            return user;
          });

        });
      });
    }
  },

  User: {
    __resolveType(obj, context, info) {
      return obj.userType.replace(obj.userType[0], obj.userType[0].toUpperCase());
    }
  },

  //System levels & subjects
  Level: {
    subjects: (level) => {
      return level.getSubjects();
    },

    classes: (level) => {
      return level.getClasses();
    }
  },

  Class: {
    level: (Class) => {
      return Class.getLevel();
    },

    timeTable: (Class, _, models) => {
      return Class.getTimeTableElements({
        include: [models.subject, { model: models.staff, include: models.user }],
        order: ['dayNum', 'timeStart']
      })
        .then((timeTableElements) => {
          timeTableElements.map(timeTableElement => {
            timeTableElement.teacher = flatData(timeTableElement.staff, 'user');
            delete timeTableElement.staff
          });

          let days = groupBy(timeTableElements, 'dayNum');
          let dayTimeTable = [];

          for (let i in days) {
            dayTimeTable[parseInt(i)] = days[i];
          }
          console.log(dayTimeTable);
          return dayTimeTable;
        });
    }

  },

  Subject: {
    level: (subject) => {
      return subject.getLevel();
    },

    staff: (subject, _, models) => {
      return models.subject.findById(subject.id,
        {
          include: {
            model: models.staff, include: models.user
          }
        }).then(subject => {
          subject.staffs.map(staff => {
            staff = flatData(staff, 'user');
          });

          return subject.staffs;
        });
    }
  },

  Mutation: {
    //System Users & permissions
    login: (_, args, models) => {
      return models.user.find({
        where: {
          email: args.email,
          password: md5(args.password)
        },
        include: { model: models.userType, as: 'userType' },
        attributes: ['userType.tableName', 'id'],
        raw: true
      }).then((userType) => {
        return models[userType.tableName]
          .find({ where: { userID: userType.id }, include: models.user })
          .then((all) => {
            if (all) {
              let data = flatData(all, 'user');
              data[userType.tableName] = true;
              data.userType = userType.tableName;
              return resolveUserPermissions(models, data.userId).then((routes) => {
                data.routes = routes[0];
                let token = jwt.sign({
                  data: {
                    name: data.name,
                    email: data.email,
                    userType: data.userType,
                    userId: data.userId,
                    routes: data.routes
                  }
                }, md5('secret'), { expiresIn: '1y' });

                return token;
              })

            }
          })
      })
    },

    createParent: (_, args, models) => {
      return models.userType
        .find({
          where: { tableName: 'parent' },
          attributes: ['id'],
          raw: true
        })
        .then((id) => {
          let user = args.user;
          user.parent = args.parent;
          user.userTypeId = id.id;
          user.password = md5(user.password);
          return models.user.create(user, { include: models.parent }).then((user) => {
            let parent = user.parent;
            parent.dataValues.user = user;
            parent.userId = user.id;
            return flatData(parent, 'user');
          });
        });
    },

    createStudent: (_, args, models) => {
      return models.userType
        .find({
          where: { tableName: 'student' },
          attributes: ['id'],
          raw: true
        })
        .then((id) => {
          let user = args.user;
          user.student = args.student
          user.userTypeId = id.id;
          user.password = md5(user.password);
          return models.user.create(user, { include: models.student }).then((user) => {
            let student = user.student;
            student.dataValues.user = user;
            student.userId = user.id;
            return flatData(student, 'user');
          });
        });
    },

    createStaff: (_, args, models) => {
      return models.userType
        .find({
          where: { tableName: 'staff' },
          attributes: ['id'],
          raw: true
        })
        .then((id) => {
          let user = args.user;
          user.staff = args.staff
          user.userTypeId = id.id;
          user.password = md5(user.password);
          return models.user.create(user, { include: models.staff }).then((user) => {
            let staff = user.staff;
            staff.dataValues.user = user;
            staff.userId = user.id;
            return flatData(staff, 'user');
          });
        });
    },

    updateParent: (_, args, models) => {

      return models.parent.findById(args.id, { include: models.user })
        .then((user) => {
          if (user) {
            return user
              .updateAttributes(args.parent)
              .then((user) => {
                if (user && args.user)
                  return user.user.updateAttributes(args.user);
              });
          }

        });
    },

    updateStudent: (_, args, models) => {

      return models.student.findById(args.id, { include: models.user })
        .then((user) => {
          if (user) {
            return user
              .updateAttributes(args.student)
              .then((user) => {
                if (user && args.user)
                  return user.user.updateAttributes(args.user);
              });
          }

        });
    },

    updateStaff: (_, args, models) => {

      return models.staff.findById(args.id, { include: models.user })
        .then((user) => {
          if (user) {
            return user
              .updateAttributes(args.staff)
              .then((user) => {
                if (user && args.user)
                  return user.user.updateAttributes(args.user);
              });
          }

        });
    },

    deleteUser: (_, args, models) => {
      return models.user.destroy({ where: { id: args.userId } });
    },

    createPermissionGroup: (_, args, models) => {
      return models.permissionGroup.create(args);
    },

    updatePermissionGroup: (_, args, models) => {
      return models.permissionGroup.update(args, { where: { id: args.id } });
    },

    deletePermissionGroup: (_, args, models) => {
      return models.permissionGroup.destroy({ where: { id: args.id } });
    },

    appendPermissionToGroup: (_, args, models) => {
      return models.permissionGroupSelector.create(args);
    },

    updatePermissionOfGroup: (_, args, models) => {
      return models.permissionGroupSelector
        .update(
        args, {
          where:
          { permissionGroupId: args.permissionGroupId, permissionId: args.permissionId }
        }
        );
    },

    deletePermissionOfGroup: (_, args, models) => {
      return models.permissionGroupSelector.destroy({
        where: { permissionGroupId: args.permissionGroupId, permissionId: args.permissionId }
      });
    },

    addUserToPermissionGroup: (_, args, models) => {
      return models.userGroupSelector.create(args);
    },

    deleteUserFromPermissionGroup: (_, args, models) => {
      return models.userGroupSelector
        .destroy({ where: { userId: args.userId, permissionGroupId: args.permissionGroupId } });
    },

    //System levels & subjects
    createLevel: (_, args, models) => {
      return models.level.create(args.level);
    },

    updateLevel: (_, args, models) => {
      return models.level.update(args.level, { where: { id: args.id } });
    },

    deleteLevel: (_, args, models) => {
      return models.level.destroy({ where: { id: args.id } });
    },

    createClass: (_, args, models) => {
      return models.class.create(args.class);
    },

    updateClass: (_, args, models) => {
      return models.class.update(args.class, { where: { id: args.id } });
    },

    deleteClass: (_, args, models) => {
      return models.class.destroy({ where: { id: args.id } });
    },

    createSubject: (_, args, models) => {
      return models.subject.create(args.subject);
    },

    updateSubject: (_, args, models) => {
      return models.subject.update(args.subject, { where: { id: args.id } });
    },

    deleteSubject: (_, args, models) => {
      return models.subject.destroy({ where: { id: args.id } });
    },

    appendStudentsToClass: (_, args, models) => {

      let data = args.studentsId.map((studentId) => {
        return { studentId, classId: args.classId };
      });

      return models.classStudentSelector.bulkCreate(data);
    },

    updateStudentClass: (_, args, models) => {
      return models.classStudentSelector.update(args, { where: { studentId: args.studentId } });
    },

    updateTimeTable: (_, args, models) => {
      return models.classSubjectStaffSelector.destroy({ where: { classId: args.classId } }).then(() => {
        let data = args.subjectStaff.map((subjectStaff) => {
          if (new Date(subjectStaff.timeStart).getTime() > new Date(subjectStaff.timeEnd).getTime())
            throw new Error("start time must be smaller than end time");

          return {
            subjectId: subjectStaff.subjectId,
            staffId: subjectStaff.staffId,
            classId: args.classId,
            timeStart: subjectStaff.timeStart,
            timeEnd: subjectStaff.timeEnd,
            day: subjectStaff.day,
          };
        });

        return models.classSubjectStaffSelector.bulkCreate(data);
      })

    },

    appendTeacherSpecialization: (_, args, models) => {
      return models.specializationSelector.create(args);
    },

    createAbsenceReason: (_, args, models) => {
      return models.absenceReason.create(args);
    }

  }
};
