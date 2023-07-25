var express = require("express")
const fs = require('fs');
const axios = require('axios');
const fetch = require('node-fetch'); 
var cors = require("cors")
var morgan = require("morgan")
var {spawn} = require("child_process")
var multer = require("multer")
var path = require("path")
var con = require("./db") 
var middleware = require("./middleware")
var LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./scratch');
// var {Blob} = require('buffer')
// var FormData = require('form-data')
const app = express();
app.use(express.static('Files'))
app.use(express.static('cluster'))
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(middleware.decodeToken)
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage });


function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


async function cloud_upload(imagePath='abc.png') {
  try {
    await wait(2000)
    const imageData = fs.readFileSync(imagePath);
    const blob = new Blob([imageData], { type: 'image/jpeg' });
  
    const formData = new FormData();
    formData.append('file', blob, 'image.jpg');
    formData.append("upload_preset", "chat-app");
    formData.append("cloud_name", "dtdehangx");
  
    const response = await axios.post("https://api.cloudinary.com/v1_1/dtdehangx/image/upload", formData);

    const upload_json = response.data;
    return upload_json.url; 
  } catch (error) {
    console.error("Error uploading image:", error);
    return null; 
  }
}
function insert(feature,original,modified,time){
  var email=localStorage.getItem(email)
  // console.log(feature);
  let que=`insert into user_data (email_id,feature,original_img,modified_img,date) values (?,?,?,?,?)`
  con.query(que,[email,feature,original,modified,time],function(err,res){

        if(err) throw err
        console.log(res);
        console.log("Data inserted");
      })
}

app.get('/', (req, res) => {
  res.send('Hello World!');
});




let email

app.get('/forauthorization' ,(req,res)=>{
  var emailId=req.user.email
  var name=req.user.name
  localStorage.setItem(email,emailId)
  // email=emailId
  let sql='select * from user_details where email_id= ? '
  con.query(sql,[emailId], function(err,res){
    if(err) throw err
    if(res.length===0){
      var re=[emailId,name]
      console.log(re);
      let que=`insert into user_details (email_id,name) values (?,?)`
      con.query(que,[emailId,name],function(err,res){

        if(err) throw err
        console.log(res);
        console.log("Data inserted");
      })
    }else{
      console.log("Email exist");
    }
  })
})




app.post('/ClusterOfColors', async(req, res) => {
  try {
    const imagePath = req.body.url;
    const pythonProcess = spawn('python', ['Python/clusterOfColors.py', imagePath]);
    let url 
    pythonProcess.stdout.on('data', async(data) => {
        console.log(`Python script stdout: ${data}`);
      });
      pythonProcess.stderr.on('data', (data) => {
        console.error(`Python script stderr: ${data}`);
      });
      pythonProcess.on('close', async(code) => {
        console.log(`Python script process exited with code ${code}`);
        url=await cloud_upload();
        res.json({resp:url})
        var feature='PC'
        var original=req.body.url
        var modified=url
        var time=new Date().toJSON().slice(0, 19).replace('T', ' ')
        insert(feature,original,modified,time)
    })
    
    // save to backend here
    //  url is filtered image and req.body.url is original image
  } catch (error) {
    console.log(error);
    res.json({ error })
  }
});
app.post('/BackgroundRemover', async(req, res) => {
  try {
    const imagePath = req.body.url;
    const pythonProcess = spawn('python', ['Python/backgroundRemover.py', imagePath]);
    var url
      pythonProcess.stdout.on('data', async(data) => {
        console.log(`Python script stdout: ${data}`);
      });
      pythonProcess.stderr.on('data', (data) => {
        console.error(`Python script stderr: ${data}`);
      });
       pythonProcess.on('close', async(code) => {
        console.log(`Python script process exited with code ${code}`);
        url=await cloud_upload();
        res.json({resp:url})
        var feature='BR'
        var original=req.body.url
        var modified=url
        var time=new Date().toJSON().slice(0, 19).replace('T', ' ')
        insert(feature,original,modified,time)
    })
    
    
    // save to backend here
    //  url is filtered image and req.body.url is original image

  } catch (error) {
    console.log(error);
    res.json({ error })
  }
});
app.post('/ClusterFromImage', async(req, res) => {
  try {
    const imagePath = req.body.url;
    let url
    const pythonProcess = spawn('python', ['Python/clusterFromImage.py', imagePath]);
    pythonProcess.stdout.on('data', async(data) => {
        console.log(`Python script stdout: ${data}`);
      });
      pythonProcess.stderr.on('data', (data) => {
        console.error(`Python script stderr: ${data}`);
      });
      pythonProcess.on('close', async(code) => {
        console.log(`Python script process exited with code ${code}`);
        url=await cloud_upload();
        res.json({resp:url})
        var feature='SC'
        var original=req.body.url
        var modified=url
        var time=new Date().toJSON().slice(0, 19).replace('T', ' ')
        insert(feature,original,modified,time)

    })

    // save to backend here
    //  url is filtered image and req.body.url is original image
  } catch (error) {
    console.log(error);
    res.json({ error })
  }
});
app.get('/asteroidDetector', (req, res) => {
  try {
    const pythonProcess = spawn('python', ['Python/asteroidDetector.py']);
    let result = '';
    pythonProcess.stdout.on('data', (data) => {
        // console.log(`Python script stdout: ${data}`);
      result += data.toString();
    });
    pythonProcess.stderr.on('data', (data) => {
      console.error(`Python script stderr: ${data}`);
    });
    pythonProcess.on('close', (code) => {
      console.log(`Python script process exited with code ${code}`);
      res.json({ resultPath:result });
    })
  } catch (error) {
    console.log(error);
    res.json({ error })
    
  }
});
  


// Start the server
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  con.connect(function(err){
    if(err) throw err
    console.log("Database Connected");
  })
});
