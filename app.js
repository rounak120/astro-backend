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


app.get('/', (req, res) => {
  res.send('Hello World!');
});





app.get('/forauthorization' ,(req,res)=>{
  var emailId=req.user.email
  var name=req.user.name
  
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
    })
    // save to backend here
    //  url is filtered image and req.body.url is original image
  } catch (error) {
    console.log(error);
    res.json({ error })
  }
});







app.get('/asteroidDetector', (req, res) => {
  console.log("Hello");
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
  
app.post('/index', async(req, res) => {
  console.log("hello");
  try {
    // let calendar = {
    //   "0": {
    //     "date": "January 3 - 4",
    //     "title": "Quadrantids Meteor Shower",
    //     "description": "The Quadrantids is an above average shower, with up to 40 meteors per hour at its peak. It is thought to be produced by dust grains left behind by an extinct comet known as 2003 EH1, which was discovered in 2003. The shower runs annually from January 1-5. It peaks this year on the night of the 3rd and morning of the 4th. This year the nearly full moon will block out most of the fainter meteors. But if you are patient you may still be able to catch a few good ones. Best viewing will be from a dark location after midnight. Meteors will radiate from the constellation Bootes, but can appear anywhere in the sky."
    //   }
    // };
    
    // res.json(calendar);
    let calendar={};
        const pythonProcess = spawn('python', ['Python/calendar.py']);
    pythonProcess.stdout.on('data', async(data) => {
        console.log(`Python script stdout: ${data}`);
        calendar=data
      });
      pythonProcess.stderr.on('data', (data) => {
        console.error(`Python script stderr: ${data}`);
      });
      pythonProcess.on('close', async(code) => {
        console.log(`Python script process exited with code ${code}`);
        res.json(calendar)
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