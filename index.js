const connectToMongoDb = require('./db')
const cors = require('cors');


const mongoose = require("mongoose")
const { body, validationResult } = require("express-validator");


const express = require("express")
connectToMongoDb();

const app = express();
app.use(cors());


const formSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    message: {
        type: String
    }
  });

const Form = mongoose.model("From" , formSchema);


//below line is for start using req.body 
app.use(express.json());


app.get('/',(req,res)=>{
    res.send("hii");
})


app.post(
    "/formData",
    [
      body("name", "Enter valid name").isLength({ min: 3 }),
      body("email", "Enter a valid email").isEmail(),
      body("message", "password must be atleast of 5 letters").isLength({
        min: 2,
      }),
    ],
    (req, res) => {
      const result = validationResult(req);
  
      if (!result.isEmpty()) {
        return res.send({ errors: result.array() });
      } else {
        (async () => {
          try {
              const form_data = new Form({
                  name:req.body.name,
                  email:req.body.email,
                  message:req.body.message
              });
  
              const savedform = await form_data.save();
              console.log("form saved successfully:", savedform);
              res.send("ok");
          } catch (error) {
            console.error("Error saving user:", error);
          }
        })();
      }
    }
  );

  // app.get('/fetchAllMessage', async (req, res) => {
  //   try {
  //     const allFormData = await Form.find();
  //     res.json(allFormData);
  //   } catch (error) {
  //     console.error(error.message);
  //     res.status(500).send("Internal server error");
  //   }
  // });




var port = 5000;


app.listen(port,function(){
console.log(`server is running on port ${port} `)});