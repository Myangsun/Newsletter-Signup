const express = require("express");
const bodyParser = require("body-parser");
const client = require("@mailchimp/mailchimp_marketing");

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

  client.setConfig({
    apiKey: "dc59da1405f05b68840a51f2943d9036-us8",
    server: "us8",
  });

  const run = async () => {
    const response = await client.lists.batchListMembers("d65596bbaa", {
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
