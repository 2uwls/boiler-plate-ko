const express = require('express')
const app = express()
const port=5000
const bodyParser=require('body-parser');

const config=require('./config/key');

const{User}=require("./models/User");

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:true}));

//application/json
app.use(bodyParser.json());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI,{
    useUnifiedTopology:true
}).then(()=>console.log('MongoDB Connected...'))
.catch(err=>console.log(err))


app.get('/', (req, res) => {res.send('hello world')})

app.post('/register', async(req,res)=>{
    const user= new User(req.body)

    const result= await user.save().then(()=>{
        res.status(200).json({
            success:true
        })
    }).catch((err)=>{
        res.json({succeess:false,err})
    })
})
app.listen(port,()=>console.log(`Example app listening on port ${port}!`))

