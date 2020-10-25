### Graghql 学习 note

demo 技术栈： express, express-graphql , graphql


#### 环境搭建
1. 初始化 npm init -y
2. 安装第三方插件 yarn add express express-graphql graphql

#### Schema 定义查询字段和其对应的类型
```js
// schema 这里是用来定义类型 和 查询中的  查询字段和类型， 查询字段对应了root中的方法，查询字段的类型就是root中对应字段名字返回类型
var schema = buildSchema(`
  // 自定义类型， type XXX ,实际上这里不能注释
  type Person {
    name: String,
    age: Int,
    department: String
  }

  // 查询类型， type Query， 这里将会返回所有的查询字段， 查询字段就是Query中的key，对应的是root中的同名函数，类型为root中同名方法的返回类型
  type Query{
    hello: String,  // 对应root中的 hello: () => return 'string type'
    name: String, 
    age: Int,
    person: Person // person对应的类型是自定义类型Person，root中的返回类型与Person结构要一致
  }
`)
```

#### root 中定义的是查询对应的resolver【处理器】

```js
// 定义查询所对应的的resolver，也就是 【查询对应的处理器】
var root = {
  // 键值对的形式，返回的类型和Schema里边定义的一样
  person: () => { // 对应schema中的person
    return { // 回调函数中return对应的Person类型
      name: 'person',
      age: 23,
      department: '全栈开发道路'
    }
  },
  hello: () => { // 对应schema中的hello，返回类型是String
    return 'Hello world'
  },
  name: () => {
    return 'jake'
  },
  age: () => {
    return 23
  }
}
```


#### 参数基本数据类型
基本类型：String，Int， Float， Boolean， 和ID，可以在Schema声明的时候直接使用

[类型]代表数组，列如：[int]代表整型数组， [Person]代表自定义类型为Person的数组

#### 参数传递
和js传递参数一样， 小括号内定义形参，但是形参后边需要是加：类型， [param: paramType],
!(感叹号)表示该参数传递的时候不能为空
eg.
schema中定义类型和字段
type Student{
  numId: ID!,
  name: String
}
// `Query[大写]`
type Query{
  student(numId: ID!, name:String):Student
}

root对象中定义查询的处理器，其实就是查询函数
const root = {
  student(numId){
    return {
      numId: numId,
      name: 'jakquc'
    }
  }
}


#### 在前端访问graphql接口，以便查询到数据
```
  var username = 3;
  // Account 为接口的名字，是约定俗称的， 前端传递的 变量名要以$开头
  var query = `query Account($username: Int!){
   account(username:$username) 
  }`;
  
  fetch('/后台提供的graphql数据处理接口', {
    method: 'POST',
    headers:{
      'Content-Type': 'application/json',
      'Accept': 'applictions/json'
    },
    body: JSON.stringify({
      query,
      variables: {username} // usernmae 传递给$username
    })
  }).then(res => res.json())
  .then(data => console.log('data returned: ', data))


```

#### 查询使用query，修改数据使用Mutation

Mutation里边 修改数据的方法需要使用 input 来标识这是修改数据的方法

```js

// 模板
input argType {
  field1: field1Type1
  field2: field2Type2
  ...
  fieldN: fieldnTypeN
}

type Mutation {
  // 里边定义修改数据的方法， updateFunction(形参: 形参类型): 函数返回的类型， returnType就是我们需要修改后的类型
  createFunction(argumens: argType): returnType
  updateFunction(arg1: arg1Type, arg2: argType,...): returnType
}
```

```js
type Account {
  name:String
  age: Int
  sex: String
  department: String
  salary(city: String):Int
}

// 修改数据的要使用input来标识，来提醒这个是用来输入的，即input是用来限制输入类型的
input AccountInput {
  name: String,
  age: Int,
  sex: String,
  department: String,
  salary: Int
}

type Mutation {
  # Account是我们修改数据的函数的返回值,创建后返回对应类型的值
  createAccount(input: AccountInput): Account
  updateAccount(id: ID!, input:AccountInput): Account
}

// 定义查询对应的处理器
const root = {
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


// 前端修改数据
 mutation {
  	createAccount(inputArg:{
      name: "Jakequc", 
      age: 18, 
      sex: "nan",
      department:"js"
    }){
      name
      age
      sex
      department
    }
  }

  // 前端查询数据
```

```js
    #  创建数据
    #   mutation {
    #   	createAccount(inputArg:{
    #       name: "yifen", 
    #       age: 20, 
    #       sex: "woman",
    #       department:"yifenkeju"
    #     }){
    #       name
    #       age
    #       department
    #     }
    #   }
    
    # 修改数据
      # mutation {
      # updateAccount(id: "jakequc",
      # inputArg:{
      # name: "JakeQuc",
      # age: 18,
      # department: "tenxun"
      # }){
      # name,
      # age,
      # department,
      # sex
      # }
      # }

    # query {
    #   accounts {
    #     name,
    #     age,
    #     sex,
    #     department
    #   }
    # }

    # mutation {
    #   updateAccount(id:"jakequc",inputArg:{
    #     name: "kehao_Quan",
    #     age: 23,
    #     sex: "blue",
    #     department: "jakquc_department"
    #   }){
    #     name,
    #     age,
    #     department,
    #     sex
    #   }
    # }

    mutation {
      deleteAccount(id:"kehao_Quan")
    }
```
