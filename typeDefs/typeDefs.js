let Mutation = `
  union UserType = Parent | Student | Staff

  #input type definion for parent
  input ParentInput {
    job: String!
  }

  #input type definion for parent
  input StudentInput {
    parentId: Int
    levelId: Int!
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

  input LevelInput {
      id: Int
      name: String!
      priority: Int!
  }

  input ClassInput {
    id: Int
    name: String!
    levelId: Int!
    capacity: Int!
    minGrade: Int
  }

  input SubjectInput {
    id: Int
    name: String!
    details: String!
    syllabus: String!
    levelId: Int!
  }

  input subjectStaffInput {
    staffId: Int!
    subjectId: Int!
    timeStart: String!
    timeEnd: String!
    day: String!
  }

  # this schema allows the following mutation:
  type Mutation {
    createParent(user:UserInputAdd!, parent: ParentInput!): Parent!
    createStudent(user:UserInputAdd!, student: StudentInput): Student!
    createStaff(user:UserInputAdd!, staff: StaffInput!): Staff!
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
    
    #System levels & subject
    createLevel(level: LevelInput!): Level!
    updateLevel(id: Int!, level: LevelInput!): Boolean!
    deleteLevel(id: Int!): Boolean!
    createClass(class: ClassInput!): Class!
    updateClass(id: Int!, class: ClassInput!): Boolean!
    deleteClass(id: Int!): Boolean!
    createSubject(subject: SubjectInput!): Subject!
    updateSubject(id: Int!, subject: SubjectInput!): Boolean!
    deleteSubject(id: Int!): Boolean!
    appendStudentsToClass(studentsId: [Int]!, classId: Int!): Boolean!
    updateStudentClass(studentId: Int!, classId: Int!): Boolean!
    updateSubjectStaffToClass(classId: Int!, subjectStaff: [subjectStaffInput]!): Boolean!
  }`;


//Base query

export const typeDefs = `

  interface User{
    id: Int!
    userId: Int!
    name: String!
    email: String!
    userTypeId: Int!
    userType: String
    permissionGroups: [PermissionGroup]
    permissions: [Permission]
  }

  type Parent implements User {
    id: Int!
    userId: Int!
    name: String!
    email: String!
    userTypeId: Int!
    userType: String
    job: String!
    children: [Student]!
    permissionGroups: [PermissionGroup]
    permissions: [Permission]
  }

  type Student implements User {
    id: Int!
    userId: Int!
    name: String!
    email: String!
    userTypeId: Int!
    userType: String
    parent: Parent!
    permissionGroups: [PermissionGroup]
    permissions: [Permission]
    levelId: Int!
    class: Class!
  }

  type Staff implements User {
    id: Int!
    userId: Int!
    name: String!
    email: String!
    userTypeId: Int!
    userType: String
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
    users: [User]
  }

  #System levels & subjects 
  type Level{
    id: Int!
    name: String!
    priority: Int!
    subjects: [Subject]!
    classes: [Class]!
    students: [Student]
  }

  type Class {
    id: Int!
     name: String!
    levelId: Int!
    capacity: Int!
    minGrade: Int
    level: Level
    students: [Student]
  }

  type Subject {
    id: Int!
    name: String!
    details: String!
    syllabus: String!
    levelId: Int!
    level: Level
  }

  # the schema allows the following query:
  type Query {
    user(id: Int!): User
    users: [User]
    parent(id: Int!): Parent
    parents: [Parent]
    student(id: Int!): Student
    students: [Student]
    staff(id: Int!): Staff
    staffs: [Staff]
    permissions: [Permission]
    permissionGroup(id: Int!): PermissionGroup
    permissionGroups: [PermissionGroup]
    #System levels & subjects
    levels: [Level!]!
    level(id: Int!): Level
    classes: [Class!]!
    class(id: Int!): Class
    subjects: [Subject!]!
    subject(id: Int!): Subject 
  }

`+ Mutation;
