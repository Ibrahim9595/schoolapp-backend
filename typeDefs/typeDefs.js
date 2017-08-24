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
    job: String
    staffTypeId: Int!
  }

  #input for general user_add

  input UserInputAdd {
    id: Int
    name: String!
    email: String!
    password: String!
    img: String
    gender: String!
  }
  
  #input for general user_update
  input UserInputUpdate {
    id: Int
    name: String
    email: String
    password: String
    img: String
    gender: String!
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
    dayNum: Int!
  }

  input AbsentStudent { 
    studentId: Int!
    absenceReasonId: Int
    notes: String
  }

  input AssignmentResultInput {
    assignmentId: Int!
    studentId: Int!
    score: Int!
    notes: String
  }

  # this schema allows the following mutation:
  type Mutation {
    createParent(user:UserInputAdd!, parent: ParentInput!): Parent!
    createStudent(user:UserInputAdd!, student: StudentInput!): Student!
    createStaff(user:UserInputAdd!, staff: StaffInput!): Staff!
    updateParent(id: Int!, user: UserInputUpdate!, parent: ParentInput!): Boolean!
    updateStudent(id: Int!, user: UserInputUpdate!, student: StudentInput): Boolean!
    updateStaff(id: Int!, user: UserInputUpdate!, staff: StaffInput!): Boolean!
    createStaffType(type: String!): StaffType!
    updateStaffType(id: Int!, type: String!): Boolean!
    addStaffToSubject(staffId: Int!, subjectId: Int!, rate: Int!): Boolean!
    updateStaffToSubject(staffId: Int!, subjectId: Int!, rate: Int!): Boolean!
    deleteStaffFromSubject(staffId: Int!, subjectId: Int!): Boolean!
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
    appendStudentsToClass(studentsId: [Int!]!, classId: Int!): Boolean!
    deleteStudentFromClass(studentId: Int!, classId: Int!): Boolean!
    updateTimeTable(classId: Int!, subjectStaff: [subjectStaffInput!]!): Boolean!
    appendTeacherSpecialization(staffId: Int!, subjectId: Int!, rate: String): Boolean!
    createAbsenceReason(name: String!, description: String!): AbsenceReason!
    createAssignmentType(name: String!, description: String!): AssignmentType!
    updateAssignmentType(id: Int!, name: String, description: String): Boolean!
    deleteAssignmentType(id: Int!): Boolean!
    appendAbsenceDay(
      date: String!
      classId: Int!, 
      subjectId: Int, 
      staffId: Int!,
      absentStudents: [AbsentStudent!]!
     ): Boolean!
    createAssignment(
      staffId: Int!,
      classId: Int!,
      subjectId: Int!,
      assignmentTypeId: Int!,
      description: String!,
      finalScore: Int!,
      dueDate: String!,
      notes: String
    ): Assignment!
    updateAssignment(
      id: Int!,
      classId: Int,
      staffId: Int,
      subjectId: Int,
      assignmentTypeId: Int,
      description: String,
      finalScore: Int,
      dueDate: String,
      notes: String
    ): Boolean!
    deleteAssignment(id: Int!): Boolean!
    createAssignmentResults(results: [AssignmentResultInput]!): Boolean!
    createMessage(senderId: Int!, recieverId: [Int!]!, body: String!): SentMessage!
    deleteSentMessage(id: Int!): Boolean!
    deleteRecievedMessage(id: Int!): Boolean!
    markMessageAsSeen(id: Int!): Boolean!
  }`;


//Base query

export const typeDefs = `

  interface User{
    id: Int!
    userId: Int!
    name: String!
    email: String!
    img: String
    gender: String!
    userTypeId: Int!
    userType: String
    permissionGroups: [PermissionGroup]
    permissions: [Permission]
    sentMessages: [SentMessage!]!
    recievedMessages: [RecievedMessage!]!
    count: Int
  }

  type Parent implements User {
    id: Int!
    userId: Int!
    name: String!
    email: String!
    img: String
    gender: String!
    userTypeId: Int!
    userType: String
    job: String!
    children: [Student]!
    permissionGroups: [PermissionGroup]
    permissions: [Permission]
    sentMessages: [SentMessage!]!
    recievedMessages: [RecievedMessage!]!
    count: Int
  }

  type Student implements User {
    id: Int!
    userId: Int!
    name: String!
    email: String!
    img: String
    gender: String!
    userTypeId: Int!
    userType: String
    parent: Parent
    permissionGroups: [PermissionGroup]
    permissions: [Permission]
    levelId: Int!
    level: Level
    class: Class
    sentMessages: [SentMessage!]!
    recievedMessages: [RecievedMessage!]!
    contactList: [User!]!
    count: Int
  }

  type Staff implements User {
    id: Int!
    userId: Int!
    name: String!
    email: String!
    img: String
    gender: String!
    userTypeId: Int!
    userType: String
    job: String
    permissionGroups: [PermissionGroup]
    permissions: [Permission]
    timeTable: [[StaffTimeTableElement!]!]!
    subjects: [Subject!]!
    classSubjects: [StaffClassSubject!]!
    sentMessages: [SentMessage!]!
    recievedMessages: [RecievedMessage!]!
    contactList: [User!]!
    rate: String
    staff_type: StaffType!
    count: Int
  }

  type Massenger {
    id: Int!
    userId: Int!
    name: String!
    email: String!
    count: Int
  }

  type Permission {
    id: Int!
    name: String!
    route: String!
    permissionLevel: Int
    count: Int
  }

  type PermissionGroup {
    id: Int!
    groupName: String!
    description: String!
    permissions: [Permission]
    users: [User]
    count: Int
  }

  #System levels & subjects 
  type Level{
    id: Int!
    name: String!
    priority: Int!
    subjects: [Subject]!
    classes: [Class]!
    students: [Student]
    count: Int
  }

  type Class { 
    id: Int!
    name: String!
    levelId: Int!
    capacity: Int!
    minGrade: Int
    level: Level
    students: [Student]
    timeTable: [ClassTimeTableElement!]!
    classSubjects: [ClassClassSubject!]!
    count: Int
  }

  type Subject {
    id: Int!
    name: String!
    details: String!
    syllabus: String!
    levelId: Int!
    level: Level
    staff: [Staff!]!
    count: Int
  }

  type ClassTimeTableElement {
    id: Int!
    staff: Staff!
    subject: Subject!
    timeStart: String!
    timeEnd: String!
    dayNum: Int!
    day: String!
    count: Int
  }

  type ClassClassSubject {
    staff: [Staff!]!
    subject: Subject!
    count: Int
  }

  type StaffClassSubject {
    id: Int!
    subjects: [Subject]!
    class: Class!
    count: Int
  }

  type StaffTimeTableElement {
    id: Int!
    class: Class!
    subject: Subject!
    timeStart: String!
    timeEnd: String!
    dayNum: Int!
    day: String!
    count: Int
  }

  type AbsenceReason {
    id: Int!
    name: String!
    description: String!
    count: Int
  }

  type AbsenceDay {
    date: String!
    staff: Staff!
    class: Class!
    subject: Subject!
    absenceReason: AbsenceReason! 
    student: Student
    notes: String
    count: Int
  }

  type AssignmentType{
    id: Int!
    name: String!
    description: String!
    count: Int
  }

  type Assignment {
    id: Int!
    staff: Staff!
    class: Class!
    subject: Subject!
    assignmentType: AssignmentType!
    description: String!
    finalScore: Int!
    dueDate: String!
    notes: String
    results(studentId: Int): [AssignmentResult!]!
    count: Int
  }

  type AssignmentResult {
    notes: String!
    score: Int!
    student: Student!
    count: Int
  }
  

  type SentMessage {
    id: Int!
    body: String!
    sender: Massenger!
    message_statuses: [RecievedMessage!]!
    count: Int
  }

  type RecievedMessage {
    reciever: Massenger!
    isRead: Boolean!
    message_body: SentMessage!
    count: Int
  }

  type StaffType {
    id: Int!
    type: String!
    staffs: [Staff!]
    count: Int
  }

  # the schema allows the following query:
  type Query {
    user(id: Int!): User
    users(limit: Int, offset: Int): [User]
    parent(id: Int!): Parent
    parents(limit: Int, offset: Int): [Parent]
    student(id: Int!): Student
    students(limit: Int, offset: Int): [Student]
    staff(id: Int!): Staff
    staffs(limit: Int, offset: Int): [Staff]
    staffTypes: [StaffType]!
    permissions: [Permission]
    permissionGroup(id: Int!): PermissionGroup
    permissionGroups(limit: Int, offset: Int): [PermissionGroup]
    #System levels & subjects
    levels: [Level!]!
    level(id: Int!): Level
    classes: [Class!]!
    class(id: Int!): Class
    subjects(limit: Int, offset: Int): [Subject!]!
    subject(id: Int!): Subject 
    absenceReasons: [AbsenceReason!]!
    absence(
      dateStart: String!, 
      dateEnd: String!, 
      classId: Int, 
      subjectId: Int, 
      staffId: Int,
      absenceReasonId: Int,  
      studentId: Int
    ): [AbsenceDay!]!
    assignmentTypes: [AssignmentType!]!
    assignments(
      classId: Int, 
      subjectId: Int, 
      staffId: Int,
      assignmentTypeId: Int,  
    ): [Assignment!]!
  }

`+ Mutation;
