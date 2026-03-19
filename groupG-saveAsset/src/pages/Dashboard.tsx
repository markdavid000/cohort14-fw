import React, { useState } from "react"
import { WelcomeHeader, BalanceCards, QuickActions, ActivityTable } from "../components/dashboard"
import { ActionDrawer } from "../components/ui"
import {
	DepositEthForm,
	WithdrawEthForm,
	SendTokenForm,
	DepositTokenForm,
	WithdrawTokenForm,
	BurnTokenForm,
} from "../components/forms"
import { useAppContext } from "../hooks"

export const Dashboard: React.FC = () => {
	const [activeActionId, setActiveActionId] = useState<string | null>(null)
	const { ethBalance, tokenBalance, walletAddress, activity } = useAppContext()

	const closeDrawer = () => setActiveActionId(null)

	const renderActiveForm = () => {
		switch (activeActionId) {
			case "deposit-eth":
				return <DepositEthForm onComplete={closeDrawer} />
			case "withdraw-eth":
				return <WithdrawEthForm onComplete={closeDrawer} />
			case "send-token":
				return <SendTokenForm onComplete={closeDrawer} />
			case "deposit-erc20":
				return <DepositTokenForm onComplete={closeDrawer} />
			case "withdraw-erc20":
				return <WithdrawTokenForm onComplete={closeDrawer} />
			case "burn-token":
				return <BurnTokenForm onComplete={closeDrawer} />
			default:
				return null
		}
	}

	return (
		<div className="max-w-[1400px] mx-auto pb-12">
			<WelcomeHeader />
			<BalanceCards
				ethBalance={ethBalance}
				tokenBalance={tokenBalance}
				vaultAddress={walletAddress || "Not Connected"}
			/>
			<QuickActions onActionClick={setActiveActionId} />
			<ActivityTable activities={activity} />

			<ActionDrawer isOpen={activeActionId !== null} onClose={closeDrawer}>
				{renderActiveForm()}
			</ActionDrawer>
		</div>
	)
}
