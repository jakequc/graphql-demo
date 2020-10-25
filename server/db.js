var express = require('express');
var {
  buildSchema
} = require('graphql');
const {
  graphqlHTTP
} = require('express-graphql');
const mysql = require('mysql')
var pool = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'test'
})

pool.connect((err) => {
  if (err) {
    console.log('error connecting: ' + err.stack);
    return;
  }
  console.log('connection is successful...');
})

// pool.query('SELECT 1 + 1 AS solution', (err,results, fields) =>{
// if(err) throw error;
// console.log('1+1=', results[0].solution)
// })

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
    deleteAccount(id: ID!):Boolean
    updateAccount(id: ID!, inputArg:AccountInput):Account
  }

  type Query {
    accounts: [Account]
  }
`)

// 定义查询对应的处理器
const root = {
  accounts() {
    return new Promise((resolve, reject) => {
      pool.query('select name, age, sex, department from account', (err, results, fields) => {
        if (err) {
          return console.log('err:', err.message)
        }
        const arr = [];
        for (let i = 0; i < results.length; i++) {
          arr.push({
            name: results[i].name,
            sex: results[i].sex,
            age: results[i].age,
            department: results[i].department
          })
        }
        resolve(arr)
      })
    })
  },

  createAccount({
    inputArg
  }) {
    const data = {
      name: inputArg.name,
      sex: inputArg.sex,
      age: inputArg.age,
      department: inputArg.department
    }

    return new Promise((resolve, reject) => {
      pool.query('insert into account set ?', data, (err) => {
        if (err) {
          console.log('出错了', err.message);
          return;
        }
        // else 返回新的结果
        resolve(data);
      })
    })
  },

  updateAccount({
    id,
    inputArg
  }) {
    const data = inputArg;
    return new Promise((resolve, reject) => {
      pool.query('update from account set ? where name = ?', [data, id], (err) => {
        if (err) {
          console.log('出错了', err.message);
          return;
        }
      })
      // else 返回新的结果
      resolve(data);
    })
  },
  deleteAccount({id}){
    return new Promise((resolve, reject) => {
      pool.query('delete from account where name = ?', [id],(err)=>{
        if(err){
          console.log('出错了', err.message)
          reject(err.message)
          return ;
        }else{
          resolve(true) // 删除成功
        }
      })
    })
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
     # 这里边是修改后返回给前端的数据键名,可以执写返回值类型的一部分键名
     name
     age
     sex
     department
   }
 }

  query {
    # 查询其名字 {要查询的字段1，要查询的字段2....}
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