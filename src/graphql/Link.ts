import {
  extendType,
  objectType,
  stringArg,
  nonNull,
  intArg,
  idArg,
} from "nexus";

export const Link = objectType({
  name: "Link",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("description");
    t.nonNull.string("url");
    t.field("postedBy", {
      // 1
      type: "User",
      resolve(parent, args, context) {
        // 2
        return context.prisma.link
          .findUnique({ where: { id: parent.id } })
          .postedBy();
      },
    });
    t.nonNull.list.nonNull.field("voters", {
      type: "User",
      resolve(parent, args, context) {
        return context.prisma.link
          .findUnique({ where: { id: parent.id } })
          .voters();
      },
    });
  },
});

export const LinkQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("feed", {
      type: "Link",
      resolve(parent, args, context) {
        return context.prisma.link.findMany(); // 1
      },
    });
  },
});

export const LinkMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("post", {
      type: "Link",
      args: {
        description: nonNull(stringArg()),
        url: nonNull(stringArg()),
      },
      resolve(parent, args, context) {
        const { userId } = context;
        if (!userId) throw new Error("Cannot post without logging in");
        const newLink = context.prisma.link.create({
          data: {
            description: args.description,
            url: args.url,
            postedBy: { connect: { id: userId } },
          },
        });
        return newLink;
      },
    });
  },
});

export const LinkQueryByID = extendType({
  type: "Query",
  definition(t) {
    t.field("link", {
      type: "Link",
      args: {
        id: nonNull(idArg()),
      },

      resolve(parent, args, context, info) {
        const queryId = context.prisma.link.findUnique({
          where: {
            id: Number(args.id),
          },
        });

        if (!queryId) {
          throw new Error(`Link with ID ${args.id} not found`);
        }
        console.log(`Retrieving link with ID ${args.id}`);
        return queryId;
      },
    });
  },
});

export const LinkMutation2 = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("updateLinK", {
      type: "Link",
      args: {
        id: nonNull(idArg()),
        url: stringArg(),
        description: stringArg(),
      },
      resolve(parents, args, context, info) {
        const { id, description, url } = args;

        const updatedLink = context.prisma.link.update({
          where: {
            id: Number(id),
          },
          data: {
            description:
              description !== undefined && description !== null
                ? description
                : "",
            url: url !== undefined && url !== null ? url : "",
          },
        });
        return updatedLink;
      },
    });
  },
});

// export const DeleteLink = extendType({
//   type: "Mutation",
//   definition(t) {
//     t.nonNull.field("deleteLink", {
//       type: "Link",
//       args: {
//         id: nonNull(idArg()),
//       },
//       resolve(parent, args, context, info) {
//         const { id } = args;
//         const index = links.findIndex((el) => el.id === id);
//         const deletedElement = links[index];
//         if (index === -1) throw new Error(`No index of the specific id`);
//         links = links.filter((el) => el.id !== id);
//         return deletedElement;
//       },
//     });
//   },
// });
