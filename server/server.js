// const express = require('express');
// const {
//   ApolloServer,
//   gql
// } = require('apollo-server-express');
// const typeDefs = gql `
//   type Query {
//     hello: String
//   }
// `;
// const resolvers = {
//   Query: {
//     hello: () => 'Hello world!',
//   },
// };
// const server = new ApolloServer({
//   typeDefs,
//   resolvers
// });
// const app = express();
// server.applyMiddleware({
//   app
// });
// app.listen({
//     port: 4000
//   }, () =>
//   console.log('Now browse to http://localhost:4000' + server.graphqlPath)
// );



var express = require('express');
var {
  buildSchema
} = require('graphql');
const {
  graphqlHTTP
} = require('express-graphql');

// 构建schema，schema用来 【定义查询和类型】
var schema = buildSchema(`
  type Person {
    name: String,
    age: Int,
    department: String
  }

  type Query{
    hello: String,
    name: String, 
    age: Int,
    person: Person
  }
`)

/**
 hello方法， 返回的类型为String，
 前端写query{hello} 就会返回hello对应的结果
 */

// 定义查询所对应的的resolver，也就是 【查询对应的处理器】
var root = {
  // 键值对的形式，返回的类型和Schema里边定义的一样
  person: () => {
    return {
      name: 'person',
      age: 23,
      department: '全栈开发道路'
    }
  },
  hello: () => {
    return 'Hello world'
  },
  name: () => {
    return 'jake'
  },
  age: () => {
    return 23
  }
}

var app = express();
// 把/graphql交给graphqlHTTP处理
app.use('/graphql', graphqlHTTP({
  schema, // 
  rootValue: root,
  graphiql: true // 开发时启动调试
}));

// 公开文件夹，供用户访问对应的静态文件
app.use(express.static('public'))
app.listen(4001, () => {
  console.log('localhost:4001 ok');
})