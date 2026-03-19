import { BrowserRouter, Route, Routes, Outlet, Navigate } from 'react-router-dom'
import { useAccount } from 'wagmi'
import PortalNav from './components/PortalNav'
import Overview from './pages/overview'
import FacultyPortal from './pages/falcutyportal'
import ClaimPortal from './pages/claimportal'
import StudentRegistry from './pages/studentRegistry'
import LandingPage from './pages/LandingPage'
import AcademicLedger from './pages/academyledger'

function PortalLayout() {
	return (
		<div className="min-h-screen bg-[#eceff3] text-[#5d6470]">
			<div className="mx-auto flex w-full max-w-[1280px] lg:min-h-screen">
				<PortalNav />
				<div className="flex-1">
					<Outlet />
				</div>
			</div>
		</div>
	)
}

// Redirect to landing if wallet not connected
function ProtectedRoute() {
	const { isConnected } = useAccount()
	if (!isConnected) return <Navigate to="/home" replace />
	return <PortalLayout />
}

function App() {
	return (
		<BrowserRouter>
			<Routes>
				{/* Landing page — public, no sidebar */}
				<Route index element={<LandingPage />} />
				<Route path="home" element={<LandingPage />} />

				{/* Dashboard routes — protected, requires wallet */}
				<Route element={<ProtectedRoute />}>
					<Route path="overview" element={<Overview />} />
					<Route path="ledger" element={<AcademicLedger />} />
					<Route path="faculty" element={<FacultyPortal />} />
					<Route path="claims" element={<ClaimPortal />} />
					<Route path="students" element={<StudentRegistry />} />
				</Route>
			</Routes>
		</BrowserRouter>
	)
}

export default App

