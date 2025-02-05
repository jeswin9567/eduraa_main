const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const session=require('express-session')
const app = express();

// time scheduler
const updateClassStatus = require("../backend/config/scheduler");
updateClassStatus(); // Start the cron job when the server starts



// Import routes
const loginRoute = require('./routes/log');
const signupRoute = require('./routes/sign');
const ForgotPasswordRoute = require('./routes/forgotpass');
const ScholarshipRoute = require('./routes/schship');
const StudentloanRoute = require('./routes/studln');
const EntraceRoute = require('./routes/entrnc');
const ManagerRoute = require('./routes/man');
const ViewScholarRoute = require('./routes/viewscho');
const ViewEntranceRoute = require('./routes/viewentr');
const ViewLoanRoute = require('./routes/viewln');
const DelEntranceRoute = require('./routes/delentrc');
const DelSholarRoute = require('./routes/delscholar');
const DelLoanRoute = require('./routes/delloan');
const UpdLoanRoute = require('./routes/uplon');
const UpdEnRoute = require('./routes/upentrance');
const UpdSchoRoute = require('./routes/upscho');
const VUProfileRoute = require('./routes/profile');
const UpUProfileRoute = require('./routes/userupdatepro');
const UpUPassword = require('./routes/changepass');
const USchoRoute = require('./routes/searchscho');
const USrchEntraceRoute = require('./routes/searchentr');
const USrchLoanRoute = require('./routes/searchloan');
const ManagerProf = require('./routes/manvpro');
const MockTestRoute = require('./routes/mocktest');
const Quiz = require('./routes/quizan');
const ViewAns = require('./routes/viewanswers');
const UserStatus = require('./routes/user');
const PriceRoute = require('./routes/price');
const PaymentRoute = require('./routes/paymt');
const FeedBackRoute = require('./routes/Feedback');
const TeacherRegistraionRoute = require('./routes/teacherRegistration');
const ViewTeacherRoute = require('./routes/viewteachers');
const ViewTeacherProfileRoute = require('./routes/viewteacherprofile');
const UploadCourseRoute = require('./routes/courses');
const LiveCLassScheduleRoute = require('./routes/liveclass');
const EntranceFiledRoute = require('./routes/entrancecoursef');
const AssignStudentRoute = require('./routes/teacherassign')











// Middleware
app.use(express.json());
app.use(session({
  secret: 'hgghdftdg@123',  // A secret key to sign the session ID
  resave: false,              // Prevents resaving session if it hasn't been modified
  saveUninitialized: true,    // Save uninitialized sessions (new but not modified)
  cookie: { secure: false }   // Set to true if using HTTPS
}));

app.use(cors());

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://jeswinmathew2025:UyHHB610kn6p7Xsh@eduraa.hztx3.mongodb.net/?retryWrites=true&w=majority&appName=Eduraa');
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit the process with a failure code
  }
};

connectDB();

// Use the login and signup routes
app.use('/log', loginRoute);
app.use('/sign', signupRoute);
app.use('/forgetpass', ForgotPasswordRoute);
app.use('/schship',ScholarshipRoute);
app.use('/studln',StudentloanRoute);
app.use('/entrnc',EntraceRoute);
app.use('/man', ManagerRoute);
app.use('/viewscho', ViewScholarRoute);
app.use('/viewentr', ViewEntranceRoute);
app.use('/viewln', ViewLoanRoute);
app.use('/delentr', DelEntranceRoute);
app.use('/delscho', DelSholarRoute);
app.use('/delln', DelLoanRoute);
app.use('/upln', UpdLoanRoute);
app.use('/upentr',UpdEnRoute);
app.use('/upscho', UpdSchoRoute);
app.use('/vuprofile',VUProfileRoute);
app.use('/updateprofile', UpUProfileRoute);
app.use('/changePassword',UpUPassword);
app.use('/',USchoRoute);
app.use('/',USrchEntraceRoute);
app.use('/',USrchLoanRoute);
app.use('/',ManagerProf);
app.use('/mocktest',MockTestRoute);
app.use('/quiz',Quiz);
app.use('/viewans',ViewAns);
app.use('/user',UserStatus);
app.use('/price',PriceRoute);
app.use('/payment',PaymentRoute);
app.use('/feed',FeedBackRoute);
app.use('/api/teachers',TeacherRegistraionRoute);
app.use('/api/viewteachers', ViewTeacherRoute);
app.use('/api/profile', ViewTeacherProfileRoute);
app.use('/api/course', UploadCourseRoute);
app.use('/api/liveclass',LiveCLassScheduleRoute);
app.use('/api/entrancefield',EntranceFiledRoute);
app.use('/api/viewassign',AssignStudentRoute)







// Server listen
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
