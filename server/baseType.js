const express = require("express")
const {
  buildSchema
} = require("graphql")
const {
  graphqlHTTP
} = require("express-graphql");

// 定义schema， 查询和类型
const schema = buildSchema(`
  type Account {
    name:String,
    age: Int,
    sex: String,
    department: String,
    salary(city:String):Int
  }
  type Query {
    getClassMates(classNo: Int!): [String],
    name: String,
    account(username:String): Account
  }
`)


// 定义root， 定义查询对应的处理器
/**
 前端得到getClassMates的数据需要使用 
 {
  ...,
  getClassMates(classNo:1),
  ...
}

 */
const root = {
  getClassMates({
    classNo
  }) {
    const obj = {
      1: ["ZHANG2", "li4", "wang5"],
      2: ["keju", "jakequc", "okme"]
    }
    return obj[classNo]
  },
  /*  前端获取数据的时候
    query {
      account(username:"jakequc"){
        name,
        salary(city: "深圳")
      }
    }
  */
  account({username}){
    const name = username;
    const sex = "man";
    const age = 18;
    const department = "开发部";
    const salary = ({city}) => {
      if(city === "北京" || city == "上海" || city ==="深圳") {
        return 18000
      }else{
        return 8000
      }
    }

    return {
      name,
      sex,
      age,
      department,
      salary
    }
  },
  // name: () => {
    // return "jakequc"
  // }
}

const app = express();
app.use("/graphql", graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true
}))
// 公开文件夹，供用户访问对应的静态文件
app.use(express.static("public"))
app.listen(3000, () => {
  console.log("localhost: 3000")
})