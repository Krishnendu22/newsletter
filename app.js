const express=require("express")//remember in json add  "node app.js", install dotenv and require('dotenv').config()
const app=express();
const https = require("https");
const bodyParser=require("body-parser")
const request=require("request")
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))//we need to set the path relative to the public folder.
const dotenv=require('dotenv').config();
app.get("/",function(request,response)
{
    response.sendFile(__dirname+"/sign-up.html")
})
app.post("/",function(request,response)
{
    var fname=request.body.firstname;
    var lname=request.body.lastname;
    var email=request.body.email;
    var data={
       members:[{ email_address:email,
        status:"subscribed",
        merge_fields:{
            FNAME:fname,
            LNAME:lname
        }

    }] }
  
    const jsondata=JSON.stringify(data);
    const url=process.env.audienceID;
    const options={
        method:"POST",
        auth:process.env.apiID
    }
    const req=https.request(url,options,function(res)
    {
        if(res.statusCode===200){
        response.sendFile(__dirname+"/success.html")
        
    }
    else{
        response.sendFile(__dirname+"/failure.html")
    }
        response.on("data",function(data)
        {
            console.log(JSON.parse(data));
        })
    })
    req.write(jsondata);
    req.end();

}
)
app.post("/failure",function(request,response)
{
    response.redirect("/");
})
app.listen(process.env.PORT || 3000,function()//dynamic port
{
    console.log("Server with port 3000 deployed")
})



