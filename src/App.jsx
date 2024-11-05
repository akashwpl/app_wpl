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

function App() {

  return (
    <div>
      <div className="fixed top-0 left-0 w-full z-[100]">
        <Navbar />
      </div>
      <div className="mt-[64px]">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projectdetails/:id" element={<ProjectDetailsPage />} />
          <Route path="/rewards" element={<RewardsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/editprofile" element={<EditProfilePage />} />
          <Route path="/signup/form" element={<FormPage />} />
          <Route path="/projectdetails/form/:id" element={<FormPage />} />
          <Route path="/onboarding" element={<OnBoarding />} />
          <Route path="/addproject" element={<AddProjectPage />} />
          <Route path="/editproject/:id" element={<EditProjectPage />} />
          <Route path="/allprojects" element={<AllProjectsPage />} />
          <Route path="/userprojects" element={<AllUserOwnedProjectsPage />} />
          <Route path="/submissions/:id/:page" element={<SubmissionsPage />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/verifyorg" element={<VerifyOrgForm />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
