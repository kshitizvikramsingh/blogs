const express=require("express")
const path=require("path")
const session=require("express-session")
const nodemailer = require('nodemailer');

const app=express()

console.log(__dirname)
const viewsPath=path.join(__dirname,"/views")
const publicPath=path.join(__dirname,"/public")


app.use(express.static(publicPath))
app.use(session({secret:"thisisnotagoodsecret"}))

app.set("view engine", "ejs")
app.set("views", viewsPath)

app.use(express.urlencoded({ extended: true}))

let obj=[{
    username:"admin",
    password:"1234"
},{
    username:"user",
    password:"1234"
}]
let otpObj=""
function generateOTP() {
    const otp = Math.floor(100000 + Math.random() * 900000); // generates a 6-digit OTP
    return otp;
}

async function sendOTP(email) {
    // Create a transporter object using your email service (Gmail example)
    let transporter = nodemailer.createTransport({
     // service: 'gmail',
     host:"smtp.gmail.com",
     port:465,
     secure:true,
      auth: {
        user: 'kshitizvikram.singh007@gmail.com',  // replace with your email
        pass: 'slgu bmtc zzlu spbn'    // replace with your email password or app-specific password
        }
    });

    const otp=generateOTP()
otpObj=otp.toString()
let mailOptions = {
    from: 'kshitizvikram.singh007@gmail.com',
    to: email, // recipient email address
    subject: 'Your OTP Code for CallBA Concepts App',
    text: `Your OTP code is: ${otp}`
  };

try {
    let info = await transporter.sendMail(mailOptions);
    console.log('OTP sent successfully:', info.response);
  } catch (error) {
    console.error('Error sending OTP:', error);
  }
}



app.get("/home",(req,res)=>{
    
        res.render("home.ejs")
    
    
})
app.get("/test",(req, res)=>{
    res.render("test.ejs")
})
app.get("/agentic-ai",(req, res)=>{
    res.render("agentic-ai.ejs")
})
app.get("/life",(req, res)=>{
    res.render("life.ejs")
})
app.get("/cultureInIndia",(req, res)=>{
    res.render("culture.ejs")
})
app.get("/login",(req,res)=>{
    
    res.render("login.ejs")
})
app.get("/otp",(req,res)=>{

 
    res.render("otp.ejs")
})
app.post("/otp",(req,res)=>{
    console.log(req.body)
    console.log(otpObj)
    const {otp}=req.body
    if(otp===otpObj){
        console.log(otpObj)
        req.session.user_id=otp
        res.redirect("/home") 
    }
    else{
        res.redirect("/login")

    }
   
})
app.post("/login",(req,res)=>{
    const {username,password,email}=req.body
    if(username===obj[0].username&&password==obj[0].password){
        
        const userEmail = email; // replace with the recipient's email
        sendOTP(userEmail);
        res.redirect("/otp")
    }
    else{
        res.render("login.ejs")
    }
    
})
app.post("/logout",(req,res)=>{
    req.session.destroy();
    res.redirect("/login")
})

app.listen("3000",()=>{
    console.log("App is up on port 3000")
})