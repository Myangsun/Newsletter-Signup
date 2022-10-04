const express = require("express");
const bodyParser = require("body-parser");
const client = require("@mailchimp/mailchimp_marketing");
const configration = require(`${__dirname}/config.js`);


const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));



app.get("/",(req, res)=>{
  res.sendFile(`${__dirname}/signup.html`)
})

app.post("/",(req, res)=>{

  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const config = configration.configGet();

  client.setConfig({
    apiKey: config.API_KEY,
    server: config.SERVER,
  });

  const run = async () => {
    const response = await client.lists.batchListMembers(config.ID, {
      members: [
        {
        email_address: email,
        status: "subscribed",
        merge_fields:{
          FNAME: firstName,
          LNAME: lastName }
        }
        ]
    });
    console.log(response);
    if(response.error_count === 0){
      res.sendFile(`${__dirname}/success.html`);
    } else {
      res.sendFile(`${__dirname}/failure.html`);
    }

  };
  run();

})

app.post("/failure", (req,res)=>{
  res.redirect("/");
})

app.listen(process.env.PORT || 3000, ()=>{
  console.log(`Server is running on ${process.env.PORT}.`);
})
