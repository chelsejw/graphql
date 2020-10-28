const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema } = graphql;

const users = [
  {id: '33', firstName: 'Chelsea', age: 24},
  {id: '2', firstName: 'Stephen', age: 30}
]


const UserType = new GraphQLObjectType({
  name: "User", // A string of whatever you call this object type
  fields: {
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
  },
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType', 
  fields: {
    user: {
      type: UserType, // reference the 
      args: { id: {type: GraphQLString }}, //arguments required for the root query

      resolve(parentValue, args) {
        return _.find(users, {id: args.id });
      }
    }

  }
});

module.exports = new GraphQLSchema( {
  query: RootQuery
});