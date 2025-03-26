import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/home/home';
import Login from './pages/login/login';
import SignUp from './pages/signup/signup'
import ForgotPassword from './pages/login/forgotpass';
import Uhome from './pages/uhome/userhome';
import UVProfile from './pages/user/UProfile';
import UpdateUserProfile from './pages/user/updateprofile';
import Adhome from './pages/admin/adhome';
import Mhome from './pages/Manager/mhome';
import ManagerProfile from './pages/Manager/Profile';
import Scholarship from './pages/user/scholarships/scholar';
import Entrance from './pages/user/entrance/entrance';
import Loan from './pages/user/loan/loan';
import Ascholar from './pages/admin/functionalities/ascholar';
import Aloan from './pages/admin/functionalities/aloan';
import AEntrance from './pages/admin/functionalities/aentrance';
import AManager from './pages/admin/functionalities/amanager';
import MEntrance from './components/manager/mentran';
import Mloan from './components/manager/mloan';
import Mscholar from './components/manager/mscho';
import ScholarshipForm from './components/admin/ScholarShipForm';
import StudentLoanForm from './components/admin/StudentLoan';
import EntranceForm from './components/admin/EntranceForm';
import MStudentLoanForm from './pages/Manager/functionalities/addln';
import MEntranceForm from './pages/Manager/functionalities/adden';
import MScholarshipForm from './pages/Manager/functionalities/addscho';
import VScholarshipDetails from './components/admin/ViewScholar';
import MVScholarshipDetails from './pages/Manager/MViewScholar';
import UVScholarshipDetails from './pages/user/scholarships/UVIewScholar';
import VEntranceDetails from './components/admin/ViewEntrance';
import VLoanDetails from './components/admin/ViewLoan';
import MVLoanDetails from './pages/Manager/MViewLoan';
import MVEntranceDetails from './pages/Manager/MViewEntrance';
import UVEntranceDetails from './pages/user/entrance/UViewEntrance';
import UVLoanDetails from './pages/user/loan/UViewLoan';
import UpdateLoan from './components/admin/aupdate/uplon';
import UpdateEntrance from './components/admin/aupdate/upent';
import UpdateScholarship from './components/admin/aupdate/uscho';
import MUpdateLoan from './components/manager/mupdate/mupln';
import MUpdateEntrance from './components/manager/mupdate/mupen';
import MUpdateScholarship from './components/manager/mupdate/mupscho';
import USearchSchoResults from './pages/user/Search/Uschorslt';
import USearchEntrResults from './pages/user/Search/Uentrsl';
import USearchLnResults from './pages/user/Search/Uloanrslt';
import ManagerDelEntr from './pages/Manager/MViewDEntr';
import MVDScholar from './pages/Manager/MViewDScholar';
import MVDLoan from './pages/Manager/MViewDLoan';
import MockTest from './pages/Manager/Mocktest';
import ManageMock from './pages/Manager/ManageMock';
import ViewMock from './pages/Manager/ViewMocks';
import UpdateMock from './pages/Manager/Mocktestupdate';
import VMockTestDet from './pages/Manager/MockTestDetails';
import VDeletedMockTest from './pages/Manager/Viewdeletedmocktest';
import UserViewMockTest from './pages/user/ViewMock';
import UEachMock from './pages/user/UViewMocks';
import Quiz from './pages/user/UQuiz';
import ViewAns from './pages/user/ViewAns';
import ManageManager from './pages/admin/ManageMan';
import Amount from './pages/Manager/Amount';
import ViewPrices from './pages/Manager/ViewPrice';
import EditPr from './pages/Manager/EditPr';
import TeacherDash from './pages/Teacher/teacherdashboard';
import TeacherRegistration from './pages/home/registration/teacher';
import ViewTeacher from './pages/Manager/ViewTeach';
import ViewTeachReq from './pages/Manager/ViewTeachReqs';
import ViewTeachID from './pages/Manager/ViewTeacherId';
import TeacherProfile from './pages/Teacher/TeacherProfile';
import TeacherAddMock from './pages/Teacher/addmocktest';
import TeacherMocktestList from './pages/Teacher/mocktestlist';
import TeacherViewMock from './pages/Teacher/viewmocktests';
import TeacherViewMockDetails from './pages/Teacher/viewmocktestdetails';
import TeacherUpdateMockTest from './pages/Teacher/updatemocktest';
import TeacherDeletedMock from './pages/Teacher/deletedmocktest';
import TeachAddCourse from './pages/Teacher/addcoursesteacher';
import TeachUploadedClasses from './pages/Teacher/uploadedClasses';
import TeachUploadedClassesLists from './pages/Teacher/uploadedClasseslistsTopic';
import ScheduleLiveClass from './pages/Teacher/scheduleliveclass';
import ViewAllSchedLiveClz from './pages/Teacher/viewscheduledliveclassAll';
import VideoPlayerPage from './components/teacher/videopla/videoPlayer';
import UserPrmDashBrd from './pages/user/premium/dashbd';
import UserPrmCousrBx from './pages/user/premium/userboxcrs';
import CourseBoxDet from './pages/user/premium/userboxcrsdet';
import UserClasPartic from './pages/user/premium/userclassdet';
import Course from './pages/user/premium/Course';
import UpdCoursePage from './pages/Teacher/updatecourspage';
import EntrFieldPage from './pages/Manager/addfield';
import UpdFieldPg from './pages/Manager/updfildpage';
import ViewAssignStudentPg from './pages/Teacher/assignedstudent';
import ViewAssignTeah from './pages/user/premium/viewteacherspag';
import UserViewLiveTime from './pages/user/premium/viewscheduleclass';
import VideoCall from './components/VideoCall';
import { TeacherProtectedRoute, StudentProtectedRoute } from './components/ProtectedRoutes';
import PremiumViewMocktest from './pages/user/premium/ViewMocktest';
import ViewMockTestdetPage from './pages/user/premium/viewmocktestlist';
import ViewStudentPr from './pages/Teacher/ViewStudentPro';
import ManagerAnnouncementMake from './pages/Manager/announcement';
import ViewTeachAnnouncement from './pages/Teacher/ViewAnnouncement';
import ViewUsrAnnouncement from './pages/user/premium/viewannouncement';
import AIChatPage from './pages/user/premium/AIChatpage';
import AIStudentDashboard from './pages/user/premium/AIStudentDashboard';
import AIMockTest from './components/AIMockTest';
import ViewAIQuizPage from './pages/user/premium/viewaiquiz';
import SearchResultpage from './pages/user/premium/SearchResultpage';
import RevenueDetails from './pages/Manager/RevenueDetails';
import CourseDetails from './pages/Manager/CourseDetails';
import NewRptgn from './pages/Manager/NewRptgn';
import StudentDetails from './pages/Manager/StudentDetails';
import TeacherCareers from './pages/home/careers/TeacherCareers';
import TimetablePage from './pages/Manager/teacherTimetable';


function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgotpassword" element= {<ForgotPassword />} />
        <Route path="/userhome" element={<Uhome/>} />
        <Route path="/uvpro" element={<UVProfile />} />
        <Route path="/upro" element={<UpdateUserProfile />} />
        <Route path="/adhome" element={<Adhome />} />
        <Route path="/mhome" element = {<Mhome />} />
        <Route path="/manager/profile" element = {<ManagerProfile />} />
        <Route path='/addManager' element={<AManager />} />
        <Route path="/scholarship" element={<Scholarship />} />
        <Route path="/entrance" element={<Entrance />} />
        <Route path="/loan" element={<Loan />} />
        <Route path="/admin/scholar" element={<Ascholar />} />
        <Route path='/admin/loan' element={<Aloan />} />
        <Route path='/admin/entrance' element={<AEntrance />} />
        <Route path='/manager/entrance' element={<MEntrance />} />
        <Route path='/manager/loan' element={<Mloan />} />
        <Route path='/manager/scholarship' element={<Mscholar />} />   
        <Route path = "/addscholar" element={<ScholarshipForm />} />
        <Route path = "/addLoan" element = {<StudentLoanForm />} />
        <Route path ="/addEntrance" element= {<EntranceForm />} />
        <Route path = "/manager/addfields" element={<EntrFieldPage />} />
        <Route path = "/manager/updatefields" element={<UpdFieldPg />} />
        <Route path='/maddLoan' element={<MStudentLoanForm />} />
        <Route path='/maddEntrance' element={<MEntranceForm />} />
        <Route path='/maddScholarship' element={<MScholarshipForm />} />
        <Route path='/scholarshipdetails/:id' element={<VScholarshipDetails />} />
        <Route path='/mscholarshipdetails/:id' element={<MVScholarshipDetails />} />
        <Route path = '/mvdelscho' element ={<MVDScholar />} />
        <Route path='/uscholarshipdetails/:id' element={<UVScholarshipDetails />} />
        <Route path='/uentrancedetails/:id' element={<UVEntranceDetails />} />
        <Route path='/uloandetails/:id' element= {<UVLoanDetails />} />
        <Route path='/ventrancedetails/:id' element={<VEntranceDetails />} />
        <Route path='/vloandetails/:id' element={<VLoanDetails />} />
        <Route path='/mloandetails/:id' element={<MVLoanDetails />} />
        <Route path='/mvdelln' element = {<MVDLoan />} />
        <Route path='/mventrancedetails/:id' element={<MVEntranceDetails />} />
        <Route path = '/mvdelentrs' element={<ManagerDelEntr />} />
        <Route path='/updateloan/:id' element={<UpdateLoan />} />
        <Route path='/updateentr/:id' element={<UpdateEntrance />} />
        <Route path='/updatescho/:id' element={<UpdateScholarship />} />
        <Route path='/mupdateloan/:id' element ={<MUpdateLoan />} />
        <Route path='/mupdateentrance/:id' element ={<MUpdateEntrance />} />
        <Route path='/mupdatescholar/:id' element={<MUpdateScholarship />} />
        <Route path="/search-results" element={<USearchSchoResults />} />
        <Route path="/ensearch-results" element={<USearchEntrResults />} />
        <Route path="/loansearch-results" element={<USearchLnResults />} />
        <Route path = "/manager/mocktest" element={<MockTest />}  />
        <Route path="/manager/managemocktest" element={<ManageMock />} />
        <Route path="/manager/viewmocktest/:examId" element={<ViewMock />} />
        <Route path="/manager/updatemocktest/:mockTestId" element={<UpdateMock />} />
        <Route path="/manager/mocktestdetails/:mockTestId" element={<VMockTestDet />} />
        <Route path = "/manager/deletedmocktest" element = {<VDeletedMockTest />} />
        <Route path= "/user/mocktest" element={<UserViewMockTest />} />
        <Route path = "/user/mocktest/:examId" element={<UEachMock />} /> 
        <Route path = "/user/quiz/:mockTestId" element={<Quiz />} />
        <Route path = "/user/answers/:mockTestId" element={<ViewAns />} />
        <Route path = "/admin/manager" element={<ManageManager />} />
        <Route path = "/manager/price" element={<Amount />} />
        <Route path = "/manager/vprice" element={<ViewPrices />} />
        <Route path = "/manager/eprice/:id" element={<EditPr />} />
        <Route path = "/teacherregistration" element = {<TeacherRegistration />} />
        <Route path = "/teacherhome" element={<TeacherDash />} />
        <Route path = "/manager/viewteacher" element={<ViewTeacher />} />
        <Route path = "/manager/viewteacherrequests" element={<ViewTeachReq />} />
        <Route path = "/manager/viewteacherdetails/:id" element={<ViewTeachID />} />
        <Route path = "/teacher/profile" element = {<TeacherProfile />} />
        <Route path = "/teacher/addmocktest" element = {<TeacherAddMock />} />
        <Route path = "/teacher/mocktestlist" element = {<TeacherMocktestList />} />
        <Route path = "/teacher/viewmocktest/:examId" element = {<TeacherViewMock />} />
        <Route path = "/teacher/viewmocktestdetails/:mockTestId" element = {<TeacherViewMockDetails />} />
        <Route path = "/teacher/updatemocktest/:mockTestId" element= {<TeacherUpdateMockTest />} />
        <Route path = "/teacher/deletedmocktest" element= {<TeacherDeletedMock />} />
        <Route path = "/teacher/addcourses" element={<TeachAddCourse/>} />
        <Route path ="/teacher/managecourses" element ={<TeachUploadedClasses />} />
        <Route path = "/subtopics/:topic" element = {<TeachUploadedClassesLists />} />
        <Route path = "/teacher/scheduleclass" element = {<ScheduleLiveClass />} />
        <Route path = "/teacher/viewscheduleclasses" element = {<ViewAllSchedLiveClz />} />
        <Route path = "/video-player" element = {<VideoPlayerPage />} />
        <Route path = "/user/premium" element = {<UserPrmDashBrd />} />
        <Route path = "/user/premium/classes" element = {<Course />} />
        <Route path = "/available-courses/:subject" element = {<UserPrmCousrBx />} />
        <Route path = "/tsubtopics/:topic" element = {<CourseBoxDet />} />
        <Route path = "/classes/:topic/:subTopic" element ={<UserClasPartic />} />
        <Route path = "/update-subtopic/:subtopicId" element= {<UpdCoursePage />} />
        <Route path = "/teacher/assignedstudents" element = {<ViewAssignStudentPg />} />
        <Route path = "/student/assignedteachers" element = {<ViewAssignTeah />} />
        <Route path = "/student/classschedule" element = {<UserViewLiveTime />} />
        <Route path="/video-call/:classId" element={<VideoCall />} />
        <Route path="/teacher/video-call/:classId" element={
          <TeacherProtectedRoute>
            <VideoCall />
          </TeacherProtectedRoute>
        } />
        
        <Route path="/student/video-call/:classId" element={
          <StudentProtectedRoute>
            <VideoCall />
          </StudentProtectedRoute>
        } />
        <Route path="/user/premium/mocktest" element={<PremiumViewMocktest />} />
        <Route path="/mocktest-list/:subject" element={<ViewMockTestdetPage />} />
        <Route path ="/teacher/student-progress/:studentEmail" element ={<ViewStudentPr/>} />
        <Route path = "/manager/makeannouncement" element = {<ManagerAnnouncementMake />} />
        <Route path = "/teacher/viewAnnouncement" element = {<ViewTeachAnnouncement />} />
        <Route path='/user/announcent' element = {<ViewUsrAnnouncement />} />
        <Route path="/user/ai-chat" element={<AIChatPage />} />
        <Route path="/user/ai-dashboard" element={<AIStudentDashboard />} />
        <Route path="/ai-mocktest/:id" element={<AIMockTest />} />
        <Route path="/user/ai-quiz-results" element={<ViewAIQuizPage />} />
        <Route path="/query/search-results" element={<SearchResultpage />} />
        <Route path="/manager/revenue-details" element={<RevenueDetails />} />
        <Route path="/manager/course-details" element={<CourseDetails />} />
        <Route path="/manager/analytics" element={<NewRptgn />} />
        <Route path="/manager/students" element={<StudentDetails />} />
        <Route path="/careers/teaching" element={<TeacherCareers />} />
        <Route path="//manager/teacher-timetable" element={<TimetablePage />} />

      </Routes>
    </Router>
  );
}

export default App;
