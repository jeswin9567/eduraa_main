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
        <Route path = "/teacher" element={<TeacherDash />} />

      </Routes>
    </Router>
  );
}

export default App;
