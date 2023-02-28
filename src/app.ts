import express from 'express';
import "reflect-metadata";
import {Between, DataSource, MoreThan} from "typeorm";
import { Cat } from './entities/User';
const {auth} =require('express-openid-connect');


const app=express();
app.use(express.json());
const port =3000;



const config = {
    authRequired: false,
    auth0Logout: true,
    baseURL: 'http://localhost:3000',
    clientID: 'CyyAGHqH7017XSkqxv3aexKRLW5zcneT',
    issuerBaseURL: 'https://dev-sj3gaf67s0oveek0.us.auth0.com',
    secret: 'hellojiiamalongrandomstringwhichwillbeused'
  };

app.use(auth(config));

app.get('/search',async(req:any,res:any)=>{
    const userRepo=AppDataSource.getRepository(Cat);
    const {age_lte,age_gte}=req.query;
    const cats=userRepo.findBy({age:Between(5,20)});
    console.log(cats);
    res.send(JSON.stringify(cats));
})


app.get('/',async function(req:any,res:any){
    const userRepo=AppDataSource.getRepository(Cat);
    const allRecords=await userRepo.find();
    res.send(req.oidc.isAuthenticated() ? JSON.stringify(allRecords) : 'Logged out');
})

app.get('/:id',async(req:any,res:any)=>{
    const userRepo=AppDataSource.getRepository(Cat);
    const {id}=req.params;
    const cat=await userRepo.findOne({where:{id:id}});
    res.send(req.oidc.isAuthenticated() ? JSON.stringify(cat) : 'Logged out');
})


app.post('/',async(req:any,res:any)=>{
  const userRepo=AppDataSource.getRepository(Cat);
  const {name,ownerName,age}=req.body;
  let result:string="";
  let catInserted;
  if(req.oidc.isAuthenticated()){
  let cat:Cat=new Cat();
  cat.Name=name;
  cat.ownerName=ownerName;
  cat.age=age;
  catInserted=await userRepo.save(cat);
  result="Data inserted successfully";
  }else{
    result="You are logged out";
  }
  res.json(result);
})



app.delete('/:id',async(req:any,res:any)=>{
    const catRepo=AppDataSource.getRepository(Cat);
    let result;
    const {id}=req.params;
    if(req.oidc.isAuthenticated()){
        result=await catRepo.delete(id);
    }
    else{
        result="You are logged out";
    }
    res.json(result);
})


app.put('/:id',async(req:any,res:any)=>{
    const catRepo=AppDataSource.getRepository(Cat);
    let result;
    const {id}=req.params;
    result=await catRepo.update(id,{...req.body});
    res.json(result);
})




const AppDataSource=new DataSource({
    type: "mysql",
    host : "localhost",
    port : 3306,
    username : "root",
    password : "password",
    database : "cat",
    entities :  [Cat],
    synchronize : true,
    logging : true
});

AppDataSource.initialize().then(()=>{
    console.log("database connected0");

    app.listen(port,()=>{
        console.log("The application is running on porst"+port);
    })

}).catch((err)=>{
    console.log(err)
})

