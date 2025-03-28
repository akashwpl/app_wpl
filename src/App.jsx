import { Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage"
import ProjectDetailsPage from "./pages/ProjectDetailsPage"
import RewardsPage from "./pages/RewardsPage"
import Navbar from "./components/Navbar"
import ProfilePage from "./pages/ProfilePage"
import EditProfilePage from "./pages/EditProfilePage"
import FormPage from "./pages/FormPage"
import OnBoarding from "./pages/OnBoarding"
import AddProjectPage from "./pages/AddProjectPage"
import EditProjectPage from "./pages/EditProjectPage"
import AllProjectsPage from "./pages/AllProjectsPage"
import AllUserOwnedProjectsPage from "./pages/AllUserOwnedProjectsPage"
import SubmissionsPage from "./pages/SubmissionsPage"
import Notifications from "./pages/Notifications"
import VerifyOrgForm from "./pages/VerifyOrgForm"
import Leaderboard from "./pages/Leaderboard"
import SponsorDashboard from "./pages/SponsorDashboard"
import AdminDashboard from "./pages/AdminDashboard"
import OrganisationPage from "./pages/OrganisationPage"
import Requests from "./pages/Requests"
import ForgetPasswordPage from "./pages/ForgetPasswordPage"
import RequestsPage from "./pages/RequestsPage"
import Portal from "./components/ui/Portal"
import Snackbar from "./components/ui/Snackbar"
import { useSelector } from "react-redux"
import LandingPageIFrame from "./pages/LandingPageIFrame"
import GrantsPage from "./pages/GrantsPage"
import SelectProjectType from "./components/projectdetails/SelectProjectType"
import AddGrantPage from "./pages/AddGrantPage"
import GrantDetailsPage from "./pages/GrantDetailsPage"
import DistributeRewardsPage from "./components/projectdetails/DistributeRewardsPage"
import EditGrantPage from "./pages/EditGrantPage"
import SendPayPage from "./pages/SendPayPage"

function App() {

  const { snackBar, isSignInModalOpen } = useSelector(state => state)

  return (
    <div className="relative">
      {!isSignInModalOpen && 
        <div className="fixed top-0 left-0 w-full z-10">
          <Navbar />
        </div>
      }
      <div className="mt-[64px]">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projectdetails/:id" element={<ProjectDetailsPage />} />
          <Route path="/rewards" element={<RewardsPage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/editprofile" element={<EditProfilePage />} />
          <Route path="/signup/form" element={<FormPage />} />
          <Route path="/projectdetails/form/:id" element={<FormPage />} />
          <Route path="/onboarding" element={<OnBoarding />} />
          <Route path="/addproject/:gigtype" element={<AddProjectPage />} />
          <Route path="/editproject/:id" element={<EditProjectPage />} />
          <Route path="/allprojects" element={<AllProjectsPage />} />
          <Route path="/userprojects" element={<AllUserOwnedProjectsPage />} />
          <Route path="/submissions/:id/:page" element={<SubmissionsPage />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/verifyorg" element={<VerifyOrgForm />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/sponsordashboard" element={<SponsorDashboard />} />
          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/organisation/:id" element={<OrganisationPage />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/requests/:id/" element={<RequestsPage />} />
          <Route path="/forgetpassword" element={<ForgetPasswordPage />} />
          <Route path="/wplprogram" element={<LandingPageIFrame />} />
          <Route path="/grants" element={<GrantsPage />} />
          <Route path="/grantdetails/:id" element={<GrantDetailsPage />} />
          <Route path="/addGrant" element={<AddGrantPage />} />
          <Route path="/editGrant/:id/" element={<EditGrantPage />} />
          <Route path="/selectprojecttype" element={<SelectProjectType />} />
          <Route path="/distribute-rewards/:id" element={<DistributeRewardsPage />} />
          <Route path="/send-pay" element={<SendPayPage />} />

        </Routes>
      </div>
      {snackBar?.show && (
        <Portal>
          <div className='fixed bottom-20 left-1/2 transform -translate-x-1/2 z-[1000] w-full max-w-md bg-primaryBlue border-white64 h-12 rounded-md'>
            <Snackbar text={snackBar?.text} />
          </div>
        </Portal>
      )}
    </div>
  )
}

export default App
