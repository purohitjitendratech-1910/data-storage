

import express from "express";
import {faker} from "@faker-js/faker"
import mysql from "mysql2"
import path from "path";
import {fileURLToPath} from "url";
import methodOverride from "method-override";
import {v4 as uuidV4} from "uuid"




const app = express();
let port = 8080;
const __fileURL = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__fileURL)

const connection = mysql.createConnection({
    host : "localhost",
    user : "root",
    database : "JRT_APK",
    password : "password-2009"
})


app.set("view engine","ejs")
app.set("views" , path.join(__dirname , "views"))

app.listen( port , ()=>{
    console.log(`the server is listening by port ${port}.............`)
})

app.use(express.json())
app.use(express.urlencoded({extends:true}))
app.use(methodOverride("_method"))
app.get("/" , (req , res)=>{
    try{
        let q = 'SELECT count(*) FROM JRT_TBL'
        connection.query(q , (err , results)=>{
            if(err){
                throw err
            }
            let count = results[0]['count(*)'];
            console.log(count)
            res.render("home" , {count})
        })
    }catch(err){
        console.log(err);
        res.send("SOMETHING WENT WORNG IN THE DATABASE !")
    }
    
})
app.get("/users",(req , res)=>{
    try{
        let q = `SELECT * FROM JRT_TBL`
        connection.query(q , (err , results)=>{
            if(err){
                throw err
            }
            let users = (results);
            res.render("users" , {users})
        })
    }catch(err){
        console.log(err);
        res.send("SOMETHING WENT WORNG IN THE DATABASE !")
    }
})
app.get("/users/:id/edit" , (req , res)=>{
    let {id} = req.params   ;
    try{
        let q = `SELECT * FROM JRT_TBL WHERE id = '${id}'`
        connection.query(q , (err , results)=>{
            if(err){
                throw err
            }
            let USER = results[0];
            console.log(USER)
            res.render("edit" , {USER})
        })
    }catch(err){
        
        res.send("SOMETHING WENT WORNG IN THE DATABASE !")
    }
})
app.patch("/USERS/:id" , (req , res)=>{
    let {id} = req.params;
    let {newName , password} = req.body;
    try{
        let q = `SELECT * FROM JRT_TBL WHERE id = '${id}'`
        connection.query(q , (err , results)=>{
            if(err){
                throw err
            }
            let USER = results[0];
            
            if(`${USER.PASSWORD}` == `${password}`){
                try{
                    let qr = `update jrt_tbl set name = '${newName}' WHERE ID = '${id}'`;
                    connection.query(qr , (err , results)=>{
                        if(err){
                            throw err
                        }
                        let data = results[0];
                        console.log(data);
                        res.redirect("/users")
                    })
                }catch(err){
                    
                    res.send("SOMETHING WENT WORNG IN THE DATABASE !")
                }
            }else{
                if(!(password)){
                    res.send("please! Enter the password first");
                    
                }else{
                    res.send("THE PASSWORD IS WRONG !!!!!")
                }
            }
            
        })
    }catch(err){
        
        res.send("SOMETHING WENT WORNG IN THE DATABASE !")
    }
})

app.get("/users/:id/dlt",( req , res)=>{
    let {id} = req.params;
    res.render("dlt" , {id})
})

app.delete("/users/:id" , (req,res) =>{
    let {id} = req.params;
    let {password} = req.body;
    try{
        let q = `select * from jrt_tbl where id = '${id}'`
        connection.query(q , (err , results)=>{
            if(err){
                throw err
            }
            if(`${results[0].PASSWORD}` == `${password}`){
                let qr = `delete from jrt_tbl where id = '${id}'`;
                connection.query(qr , (err , resutls)=>{
                    if(err){
                        throw err;
                    }
                    res.redirect("/users")
                })
            }else{
                if(!(password)){
                    res.send("please! Enter the password first");
                    
                }else{
                    res.send("THE PASSWORD IS WRONG !!!!!")
                }
            }
        })
    }catch(err){
        console.log(err);
    }

})

app.get("/users/add" , (req , res)=>{
    res.render("add")
})

app.post("/users" , async(req , res)=>{
    try{
        let {userName , password , email } = req.body;
        email = email.toLowerCase()
        console.log(userName , password , email)

        let id = uuidV4();
        let q = `INSERT INTO JRT_TBL (ID, NAME, EMAIL, PASSWORD) VALUES (?, ?, ?, ?)`;    
        let values = [id , userName , email , password]
        console.log(values)

        await connection.query(q , values , (err ,results)=>{
            if(err){
                res.send("some thing is wrong in the DB!! ")
                throw err
            }
            console.log(results);
            res.redirect("/users")
        })
    }catch(err){
        
        console.log(err)
    }
})