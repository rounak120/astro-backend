var express = require("express")
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
const cloud_upload=({});
// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});
// image uploader

app.get('/forauthorization' ,(req,res)=>{
  // console.log(req.user.email);
  var emailId=req.user.email
  var name=req.user.name
  
  let sql='select * from user_details where email_id= ? '
  // console.log(sql);
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

app.post('/ClusterOfColors',upload.single('file') , (req, res) => {
  try {
    const imagePath = req.file.path;
    const pythonProcess = spawn('python', ['Python/clusterOfColors.py', imagePath]);
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
app.post('/BackgroundRemover', (req, res) => {
  // console.log("hello"); 
  // console.log(req.body.url)

  try {
    const imagePath = req.body.url;
    
    console.log("path:", imagePath);
    const pythonProcess = spawn('python', ['Python/backgroundRemover.py', imagePath]);
    let result = '';
    pythonProcess.stdout.on('data', (data) => {
        console.log(`Python script stdout: ${data}`);
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
app.post('/ClusterFromImage', upload.single('file'), (req, res) => {
  try {
    const imagePath = req.file.path;
    const pythonProcess = spawn('python', ['Python/clusterFromImage.py', imagePath]);
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
