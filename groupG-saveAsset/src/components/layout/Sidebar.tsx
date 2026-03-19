import React from "react"
import { MdSpaceDashboard, MdAccountBalanceWallet, MdHistory, MdSettings, MdClose } from "react-icons/md"
import { Button } from "../ui/Button"
import { useAppContext } from "../../hooks/useAppContext"

interface SidebarProps {
	onClose?: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
	const { walletAddress, setWalletAddress } = useAppContext()

	const handleConnect = () => {
		if (!walletAddress) {
			setWalletAddress("0x71C81387d834927bCDdf4f21")
		} else {
			setWalletAddress(null)
		}
	}

	return (
		<div className="h-full w-60 bg-[#0c0d10] border-r border-[#1e2028] flex flex-col">
			{/* Logo Area */}
			<div className="p-6 flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="w-8 h-8 rounded bg-linear-to-br from-[#80edff] to-[#00aacc] shadow-[0_0_10px_rgba(0,212,255,0.2)] flex items-center justify-center">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-black">
							<path
								d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</div>
					<div className="flex flex-col">
						<span className="font-bold text-white leading-tight">Digital Obsidian</span>
						<span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">
							Institutional Grade
						</span>
					</div>
				</div>
				{onClose && (
					<button
						type="button"
						className="lg:hidden text-gray-400 hover:text-white transition-colors"
						onClick={onClose}>
						<MdClose className="text-2xl" />
					</button>
				)}
			</div>

			{/* Navigation */}
			<nav className="flex-1 px-4 py-4 space-y-2">
				<a
					href="#"
					className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#1a1d24] text-white font-medium transition-colors">
					<MdSpaceDashboard className="text-xl text-accent" />
					Overview
				</a>
				<a
					href="#"
					className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-[#1a1d24]/50 font-medium transition-colors">
					<MdAccountBalanceWallet className="text-xl" />
					Assets
				</a>
				<a
					href="#"
					className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-[#1a1d24]/50 font-medium transition-colors">
					<MdHistory className="text-xl" />
					History
				</a>
				<a
					href="#"
					className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-[#1a1d24]/50 font-medium transition-colors">
					<MdSettings className="text-xl" />
					Settings
				</a>
			</nav>

			{/* Bottom Area */}
			<div className="p-6">
				<Button
					variant={walletAddress ? "outline" : "primary"}
					fullWidth
					className="font-bold whitespace-nowrap overflow-hidden"
					onClick={handleConnect}>
					{walletAddress ? "Disconnect" : "Connect Wallet"}
				</Button>
			</div>
		</div>
	)
}
