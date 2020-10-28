const graphql = require('graphql');
const {
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
} = graphql;
// const _ = require('lodash');
const axios = require('axios');


// const users = [
//   {id: '33', firstName: 'Chelsea', age: 24},
//   {id: '2', firstName: 'Stephen', age: 30}
// ]

const CompanyType = new GraphQLObjectType({
  name: "Company",
  fields: () => ({
    id: { type: GraphQLString},
    name: { type: GraphQLString},
    description: { type: GraphQLString},
    users: { 
      type: new GraphQLList(UserType),
      resolve(parentValue, args) {
        return axios.get( `http://localhost:3000/companies/${parentValue.id}/users`)
        .then(res => res.data);
      }
    }
  })
});

const UserType = new GraphQLObjectType({
  name: "User", // A string of whatever you call this object type
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: { 
      type: CompanyType,
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
        .then(res => res.data)
      }
    }
  })
});


const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType', 
  fields: {
    user: {
      type: UserType,
      args: { id: {type: GraphQLString }}, //arguments required for the root query
      resolve(parentValue, args) {
        // if a promise is returned within resolve, GraphQL will wait for promise to resolve before sending data back to user
        return axios.get(`http://localhost:3000/users/${args.id}`)
        .then(res => res.data)
        .catch(err => "Error in the database" + err)
      }
    },
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLString}}, // Expected user input
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${args.id}`)
        .then(res => res.data);
      }
    }

  }
});

module.exports = new GraphQLSchema( {
  query: RootQuery
});