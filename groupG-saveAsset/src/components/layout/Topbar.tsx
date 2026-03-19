import React from "react"
import { MdSearch, MdNotificationsNone, MdAccountBalanceWallet, MdMenu } from "react-icons/md"
import { Input } from "../ui/Input"
import { useAppContext } from "../../hooks/useAppContext"

interface TopbarProps {
	onMenuClick?: () => void
}

export const Topbar: React.FC<TopbarProps> = ({ onMenuClick }) => {
	const { walletAddress } = useAppContext()

	const truncateAddress = (addr: string) => {
		if (!addr) return "Not connected"
		return `${addr.slice(0, 6)}...${addr.slice(-4)}`
	}

	return (
		<header className="h-20 px-4 md:px-8 flex items-center justify-between border-b border-[#1e2028] bg-primary-dark/80 backdrop-blur-md sticky top-0 z-10">
			{/* Left: Search & Menu */}
			<div className="flex items-center gap-4">
				{onMenuClick && (
					<button
						type="button"
						className="lg:hidden text-gray-400 hover:text-white transition-colors"
						onClick={onMenuClick}>
						<MdMenu className="text-3xl" />
					</button>
				)}
				<div className="w-full max-w-[320px] hidden md:block">
					<Input
						placeholder="Search assets..."
						icon={<MdSearch className="text-xl" />}
						className="bg-[#14161b] border-transparent"
					/>
				</div>
				<div className="md:hidden flex items-center">
					<span className="font-bold text-white text-lg leading-tight">Digital Obsidian</span>
				</div>
			</div>

			{/* Right: Actions & Profile */}
			<div className="flex items-center gap-6">
				<div className="flex items-center gap-4 text-gray-400">
					<button className="hover:text-white transition-colors">
						<MdNotificationsNone className="text-2xl" />
					</button>
					<button className="hover:text-white transition-colors">
						<MdAccountBalanceWallet className="text-xl" />
					</button>
				</div>

				{/* Wallet Pill */}
				<div className="flex items-center gap-3 pl-6 border-l border-gray-800">
					<div className="flex items-center gap-2 bg-[#1a1d24] border border-gray-700 rounded-full pl-4 pr-1 py-1 cursor-pointer hover:border-gray-500 transition-colors">
						<span className="text-sm font-medium text-white tracking-wide">
							{truncateAddress(walletAddress || "")}
						</span>
						<div className="w-7 h-7 rounded-full bg-gradlinearient-to-r from-orange-400 to-pink-500 border-2 border-primary-dark"></div>
					</div>
				</div>
			</div>
		</header>
	)
}
