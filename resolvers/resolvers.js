import md5 from 'md5';
import jwt from 'jsonwebtoken';
import { find } from 'lodash';

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
    }

  },

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
            user.userType = find(types, {id: user.userTypeId}).tableName;
            return user;
          });

        });
      });
    }
  },

  UserType: {
    __resolveType(obj, context, info) {
      if (obj.parent)
        return 'Parent'
      else if (obj.staff)
        return 'Staff'
      else if (obj.student)
        return 'Student'
    }
  },

  Mutation: {
    login: (_, args, models) => {
      return models.user.find({
        where: {
          email: args.email,
          password: md5(args.password)
        },
        include: models.userType,
        attributes: ['user_type.tableName', 'id'],
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
          return models.user.create(user, { include: models.parent });
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
          return models.user.create(user, { include: models.student })
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
          return models.user.create(user, { include: models.staff })
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
    }

  }
};
