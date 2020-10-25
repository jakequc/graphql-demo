var express = require('express');
var {
  buildSchema
} = require('graphql');
const {
  graphqlHTTP
} = require('express-graphql');

// 构建schema，schema用来 【定义查询和类型】，mutation
// # input声明的是输入类型
var schema = buildSchema(`
  input AccountInput {
    name: String
    age: Int
    sex: String
    department: String
  }

  type Account {
    name: String
    age: Int
    sex: String
    department: String
  }

  type Mutation {
    createAccount(inputArg: AccountInput):Account
    updateAccount(id: ID!, inputArg:AccountInput):Account
  }

  type Query {
    accounts: [Account]
  }
`)

const fakeDb = {

}

// 定义查询对应的处理器
const root = {
  accounts() {
    var arr = [];
    for(const key in fakeDb){
      arr.push(fakeDb[key])
    }
    return arr;
  },
  
  createAccount({
    inputArg
  }) {
    // 相当于数据库的保存
    fakeDb[inputArg.name] = inputArg;
    // 返回保存结果
    return fakeDb[inputArg.name]
  },
  updateAccount({
    id,
    inputArg
  }) {
    // 相当于更新数据库
    const newAccount = Object.assign({}, fakeDb[id], inputArg)
    fakeDb[id] = newAccount
    return newAccount;
  }
}


/**
前端修改数据和查询数据
  
 mutation {
 	createAccount(inputArg:{
     name: "jakequc", 
     age: 23, 
     sex: "boy",
     department:"YOOOK"
   }){
     name
     age
     sex
     department
   }
 }

  query {
    accounts {
      name,
      age,
      sex
    }
  }

 */

var app = express();
// 把/graphql交给graphqlHTTP处理
app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true // 开发时启动调试
}));

app.listen(3000, () => {
  console.log('localhost:3000 ok');
})