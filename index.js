const express = require('express')
const app = express()
const port=5000
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://2uwls:2uwls0000@cluster0.caukujh.mongodb.net/?retryWrites=true&w=majority',{
    useUnifiedTopology:true
}).then(()=>console.log('MongoDB Connected...'))
.catch(err=>console.log(err))


app.get('/', (req, res) => {res.send('hello world')})

app.listen(port,()=>console.log(`Example app listening on port ${port}!`))

