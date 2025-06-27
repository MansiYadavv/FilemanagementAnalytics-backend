


const express=require("express");
const cors=require("cors");
const dotenv=require("dotenv");
const { connectDb } = require('./config/db');
const bodyParser = require("body-parser");
const userRoutes= require('./routes/userRoutes'); 
const submissionRoutes = require('./routes/submissionRoutes');
// const fileRoutes = require('./routes/fileRoutes');
const path = require('path');
const analyticsRoutes = require('./routes/analyticsRoutes');

const errorHandler = require('./middleware/errorHandler');

connectDb(); 
require('dotenv').config(); 

const app=express();

//middleware
app.use(cors());
// app.use(morgan("dev"));

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {  //this make deployment ease because it give head and get a route ......
  res.json({ 
    message: "backend running fine",
    status: 'Working',
    timestamp: new Date().toISOString()
  });
});




app.use('/api/users', userRoutes);
app.use('/api/submissions', submissionRoutes);

// app.use('/api/files', fileRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
console.log("what is error")
app.use((req, res, next) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

app.use(errorHandler);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

