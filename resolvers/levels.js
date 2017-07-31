export const resolvers = {
    Query: {
        levels: (_, args, models) => {
            return models.level.findAll();
        },

        level: (_, args, models) => {
            return models.level.findById(args.id);
        },

        classes: (_, args, models) => {
            return models.class.findAll();
        },

        class: (_, args, models) => {
            return models.class.findById(args.id);
        },

        subjects: (_, args, models) => {
            return models.subject.findAll();
        },

        subject: (_, args, models) => {
            return models.subject.findById(args.id);
        }
    },

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
        }
    },

    Subject: {
        level: (subject) => {
            return subject.getLevel();
        }
    },


    Mutation: {
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
        }
    }
};