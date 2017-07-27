let Mutation = `
  union UserType = Parent | Student | Staff

  #input type definion for parent
  input ParentInput {
    job: String!
  }

  #input type definion for parent
  input StudentInput {
    parentId: Int
  }

  #input type definion for parent
  input StaffInput {
    job: String!
  }

  #input for general user_add

  input UserInputAdd {
    id: Int
    name: String!
    email: String!
    password: String!
  }
  
  #input for general user_update
  input UserInputUpdate {
    id: Int
    name: String
    email: String
    password: String
  }

  # this schema allows the following mutation:
  type Mutation {
    createParent(user:UserInputAdd!, parent: ParentInput!): Boolean!
    createStudent(user:UserInputAdd!, student: StudentInput): Boolean!
    createStaff(user:UserInputAdd!, staff: StaffInput!): Boolean!
    updateParent(id: Int!, user: UserInputUpdate!, parent: ParentInput!): Boolean!
    updateStudent(id: Int!, user: UserInputUpdate!, student: StudentInput): Boolean!
    updateStaff(id: Int!, user: UserInputUpdate!, staff: StaffInput!): Boolean!
    deleteUser(userId: Int!): Boolean
    createPermissionGroup(groupName: String!, description: String!): PermissionGroup!
    updatePermissionGroup(id: Int!, groupName: String, description: String): Boolean!
    deletePermissionGroup(id: Int!): Boolean!
    appendPermissionToGroup(permissionGroupId:Int!, permissionId: Int!, permissionLevel: Int!): Boolean!
    updatePermissionOfGroup(permissionGroupId:Int!, permissionId:Int!, permissionLevel: Int!): Boolean!
    deletePermissionOfGroup(permissionGroupId:Int!, permissionId:Int!): Boolean!
    addUserToPermissionGroup(userId: Int!, permissionGroupId: Int!): Boolean!
    deleteUserFromPermissionGroup(userId: Int!, permissionGroupId: Int!): Boolean!
    login(email: String!, password: String) : String!
  }
  `;


//Base query

export const typeDefs = `

  type GenericUser{
    id: Int!
    name: String!
    email: String!
    userTypeId: Int!
    userType: String!
  }

  type Parent {
    id: Int!
    userId: Int!
    name: String!
    email: String!
    job: String!
    children: [Student]!
    permissionGroups: [PermissionGroup]
    permissions: [Permission]
  }

  type Student {
    id: Int!
    userId: Int!
    name: String!
    email: String!
    parent: Parent!
    permissionGroups: [PermissionGroup]
    permissions: [Permission]
  }

  type Staff {
    id: Int!
    userId: Int!
    name: String!
    email: String!
    job: String!
    permissionGroups: [PermissionGroup]
    permissions: [Permission]
  }

  type Permission {
    id: Int!
    name: String!
    route: String!
    permissionLevel: Int
  }

  type PermissionGroup {
    id: Int!
    groupName: String!
    description: String!
    permissions: [Permission]
    users: [GenericUser]
  }

  # the schema allows the following query:
  type Query {
    parent(id: Int!): Parent
    parents: [Parent]
    student(id: Int!): Student
    students: [Student]
    staff(id: Int!): Staff
    staffs: [Staff]
    permissions: [Permission]
    permissionGroup(id: Int!): PermissionGroup
    permissionGroups: [PermissionGroup]
  }

`+Mutation;
