import React, { useState, type ReactNode } from "react"
import { AppContext } from "../hooks/useAppContext"

export interface Activity {
	id: string
	date: string
	type: string
	amount: string
	isPositive: boolean
	status: "COMPLETED" | "PENDING" | "FAILED"
}

export interface AppState {
	walletAddress: string | null
	ethBalance: string
	tokenBalance: string
	tokenVault: string
	activity: Activity[]
	loading: boolean
}

export interface AppContextType extends AppState {
	setWalletAddress: (address: string | null) => void
	setEthBalance: (balance: string) => void
	setTokenBalance: (balance: string) => void
	setTokenVault: (vault: string) => void
	setActivity: (activity: Activity[]) => void
	setLoading: (loading: boolean) => void
}

const defaultState: AppState = {
	walletAddress: null,
	ethBalance: "0.00",
	tokenBalance: "0.00",
	tokenVault: "",
	activity: [],
	loading: false,
}

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [walletAddress, setWalletAddress] = useState<string | null>(defaultState.walletAddress)
	const [ethBalance, setEthBalance] = useState<string>(defaultState.ethBalance)
	const [tokenBalance, setTokenBalance] = useState<string>(defaultState.tokenBalance)
	const [tokenVault, setTokenVault] = useState<string>(defaultState.tokenVault)
	const [activity, setActivity] = useState<Activity[]>(defaultState.activity)
	const [loading, setLoading] = useState<boolean>(defaultState.loading)

	const contextValue = React.useMemo(
		() => ({
			walletAddress,
			ethBalance,
			tokenBalance,
			tokenVault,
			activity,
			loading,
			setWalletAddress,
			setEthBalance,
			setTokenBalance,
			setTokenVault,
			setActivity,
			setLoading,
		}),
		[walletAddress, ethBalance, tokenBalance, tokenVault, activity, loading],
	)

	return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
}
