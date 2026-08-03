require('dotenv').config();

const app=require('./src/app.js')
app.listen(3000,()=>{

    console.log('Server is runing on port 3000')
})