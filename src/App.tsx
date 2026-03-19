import { BrowserRouter, Route, Routes, Outlet } from 'react-router-dom'
import PortalNav from './components/PortalNav'
import Overview from './pages/overview'
import FacultyPortal from './pages/falcutyportal'
import ClaimPortal from './pages/claimportal'
import StudentRegistry from './pages/studentRegistry'
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

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<PortalLayout />}>
					<Route index element={<Overview />} />
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
