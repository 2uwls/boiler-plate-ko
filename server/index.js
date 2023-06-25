const express = require('express')
const app = express()
const port=5000
const bodyParser=require('body-parser');
const cookieParser=require('cookie-parser');
const config=require('./config/key');
const {auth}=require('./middleware/auth')
const{User}=require("./models/User");

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:true}));

//application/json
app.use(bodyParser.json());
app.use(cookieParser());


const mongoose = require('mongoose')
mongoose.connect(config.mongoURI,{
    useUnifiedTopology:true
}).then(()=>console.log('MongoDB Connected...'))
.catch(err=>console.log(err))


app.get('/', (req, res) => {res.send('hello world')})

app.get('/api/hello',(req,res)=>{
    res.send('안녕하세요~')
})

app.post('/api/users/register', async(req,res)=>{
    const user= new User(req.body)

    const result= await user.save().then(()=>{
        res.status(200).json({
            success:true
        })
    }).catch((err)=>{
        res.json({succeess:false,err})
    })
})

app.post('/api/users/login',(req,res)=>{
    //요청된 이메일을 데이터 베이스에서 있는지 찾는다.
    User.findOne({email: req.body.email})
    .then(user=>{
        if(!user){
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            });
        }
        user.comparePassword(req.body.password,(err,isMatch)=>{
            if(!isMatch) 
            return res.json({
                loginSuccess: false,
                message: "비밀번호가 틀렸습니다."
            });
            user.generateToken().then(user => {
                res.cookie('x_auth', user.token)
                    .status(200)
                    .json({
                        loginSuccess: true,
                        userId: user._id
                    });
            }).catch(err => {
                return res.status(400).send(err);
            });
        })
    })
    .catch((err)=>{
        return res.status(400).send(err);
    })
})

app.get('/api/users/auth',auth,(req,res)=>{
    //여기까지 미들웨어를 통과해 왔다는 얘기는 Authentication이 true라는 말

    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role ===0 ? false: true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
})

app.get('/api/users/logout',auth,(req,res)=>{
    User.findOneAndUpdate(
        {_id:req.user._id},
        {token:""}
    )
    .then(user=>{
        if(!user){
            return res.json(400).json({
                success: false,
                message: "유저를 찾을 수 없습니다,"
            });
        }
        res.status(200).json({
            success: true
        });
    })
    .catch(err=>{
        res.status(400).json({
            success: false,
            error: err
        });
    })
});



app.listen(port,()=>console.log(`Example app listening on port ${port}!`))

