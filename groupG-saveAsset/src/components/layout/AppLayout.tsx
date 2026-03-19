import React, { useState, type ReactNode } from "react"
import { Sidebar } from "./Sidebar"
import { Topbar } from "./Topbar"

interface AppLayoutProps {
	children: ReactNode
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

	return (
		<div className="min-h-screen bg-primary-dark text-white flex">
			{/* Desktop Sidebar */}
			<div className="hidden lg:block fixed inset-y-0 left-0 z-20">
				<Sidebar />
			</div>

			{/* Mobile Sidebar Overlay */}
			{isMobileMenuOpen && (
				<div
					className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
					onClick={() => setIsMobileMenuOpen(false)}
					aria-hidden="true"
				/>
			)}

			{/* Mobile Sidebar */}
			<div
				className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 lg:hidden ${
					isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
				}`}>
				<Sidebar onClose={() => setIsMobileMenuOpen(false)} />
			</div>

			<div className="flex-1 ml-0 lg:ml-60 flex flex-col min-w-0 transition-all duration-300">
				<Topbar onMenuClick={() => setIsMobileMenuOpen(true)} />
				<main className="flex-1 p-4 md:p-8 overflow-y-auto w-full">{children}</main>
			</div>
		</div>
	)
}
