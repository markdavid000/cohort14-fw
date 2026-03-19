import {
    overviewIcon,
	capIcon,
	cardIcon,
	ledgerIcon,
	logoutIcon,
	settingsIcon,
	usersIcon,
} from './icons'
import { navItems as defaultNavItems, type NavItem } from './navItems'

type PortalNavProps = {
	items?: readonly NavItem[]
	title?: string
	subtitle?: string
}

function NavIcon({ icon }: { icon: NavItem['icon'] }) {
    if (icon === 'grid') {
        return (
            <img src={overviewIcon} alt="Overview" className="h-4.5 w-4.5" />
        )
    }

	if (icon === 'ledger') {
		return (
			<img src={ledgerIcon} alt="Academic Ledger" className="h-4.5 w-4.5" />
		)
	}

	if (icon === 'users') {
		return (
			<img src={usersIcon} alt="Student Registry" className="h-4.5 w-4.5" />
		)
	}

	if (icon === 'cap') {
		return (
			<img src={capIcon} alt="Faculty Portal" className="h-4.5 w-4.5" />
		)
	}

	if (icon === 'card') {
		return (
			<img src={cardIcon} alt="Claims & Billing" className="h-4.5 w-4.5" />
		)
	}

	return null
}

function PortalNav({
	items = defaultNavItems,
	title = 'ExcelSchool',
	subtitle = 'Academic Management',
}: PortalNavProps) {
	return (
		<aside className="flex w-full flex-col border-b border-[#dfe3ea] bg-[#eceff3] px-4 py-5 lg:sticky lg:top-0 lg:h-screen lg:w-[236px] lg:self-start lg:border-b-0 lg:border-r lg:px-4 lg:py-4">
			<div>
				<h1 className="text-[34px] font-semibold leading-none text-[#1f2937]">{title}</h1>
				<p className="mt-1 text-[11px] font-medium tracking-[0.01em] text-[#7b8696]">{subtitle}</p>
			</div>

			<nav className="mt-9 grid gap-2">
				{items.map((item) => (
					<button
						key={item.label}
						type="button"
						className={`flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left text-[16px] font-medium transition ${
							item.active
								? 'border-[#dfe3ea] bg-[#f5f7fa] text-[#1656d2]'
								: 'border-transparent text-[#65748b] hover:border-[#dfe3ea] hover:bg-[#f3f5f8]'
						}`}
					>
						<span className="grid h-5 w-5 place-items-center text-current">
							<NavIcon icon={item.icon} />
						</span>
						<span>{item.label}</span>
					</button>
				))}
			</nav>

			<div className="mt-8 grid gap-2 border-t border-[#d8dde5] pt-5 lg:mt-auto">
				<button
					type="button"
					className="flex items-center gap-2.5 rounded-lg border border-transparent px-3 py-2 text-left text-[16px] font-medium text-[#65748b] transition hover:border-[#dfe3ea] hover:bg-[#f3f5f8]"
				>
					<span className="grid h-5 w-5 place-items-center">
						<img src={settingsIcon} alt="Settings" className="h-4.5 w-4.5" />
					</span>
					<span>Settings</span>
				</button>

				<button
					type="button"
					className="flex items-center gap-2.5 rounded-lg border border-transparent px-3 py-2 text-left text-[16px] font-medium text-[#65748b] transition hover:border-[#dfe3ea] hover:bg-[#f3f5f8]"
				>
					<span className="grid h-5 w-5 place-items-center">
						<img src={logoutIcon} alt="Logout" className="h-4.5 w-4.5" />
					</span>
					<span>Logout</span>
				</button>
			</div>
		</aside>
	)
}

export default PortalNav
