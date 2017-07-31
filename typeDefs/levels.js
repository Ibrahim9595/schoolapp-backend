export const typeDefs = `
    type Query {
        levels: [Level!]!
        level(id: Int!): Level
        classes: [Class!]!
        class(id: Int!): Class
        subjects: [Subject!]!
        subject(id: Int!): Subject
    }

    type Level{
        id: Int!
        name: String!
        priority: Int!
        subjects: [Subject!]!
        classes: [Class!]!
    }

    type Class {
        id: Int!
        name: String!
        levelId: Int!
        capacity: Int!
        minGrade: Int
        level: Level
    }

    type Subject {
        id: Int!
        name: String!
        details: String!
        syllabus: String!
        levelId: Int!
        level: Level
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

    type Mutation { 
        createLevel(level: LevelInput!): Level!
        updateLevel(id: Int!, level: LevelInput!): Boolean!
        deleteLevel(id: Int!): Boolean!
        createClass(class: ClassInput!): Class!
        updateClass(id: Int!, class: ClassInput!): Boolean!
        deleteClass(id: Int!): Boolean!
        createSubject(subject: SubjectInput!): Subject!
        updateSubject(id: Int!, subject: SubjectInput!): Boolean!
        deleteSubject(id: Int!): Boolean!
    }
`;