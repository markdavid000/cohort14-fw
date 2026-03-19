export const navItems = [
	{ label: 'Overview', active: false, icon: 'grid' },
	{ label: 'Academic Ledger', active: false, icon: 'ledger' },
	{ label: 'Student Registry', active: false, icon: 'users' },
	{ label: 'Faculty Portal', active: false, icon: 'cap' },
	{ label: 'Claims & Billing', active: true, icon: 'card' },
] as const

export type NavItem = (typeof navItems)[number]
