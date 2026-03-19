import toast from "react-hot-toast"

import type { Activity } from "../context"
import { useAppContext } from "./useAppContext"

const DELAY_MS = 2500

export const useMockContract = () => {
	const { ethBalance, setEthBalance, tokenBalance, setTokenBalance, activity, setActivity, setLoading } =
		useAppContext()

	const generateId = () => Math.random().toString(36).substring(2, 9)

	const formatDate = () => {
		return new Date().toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		})
	}

	const addActivity = (type: string, amount: string, isPositive: boolean, status: Activity["status"]) => {
		const newActivity: Activity = {
			id: generateId(),
			date: formatDate(),
			type,
			amount,
			isPositive,
			status,
		}
		// Using current activity from context closure
		setActivity([newActivity, ...activity])
	}

	const simulateTransaction = async (
		actionName: string,
		amountStr: string,
		isPositive: boolean,
		onSuccess: () => void,
	) => {
		if (!amountStr || parseFloat(amountStr) <= 0 || isNaN(parseFloat(amountStr))) {
			toast.error("Please enter a valid amount")
			return
		}

		setLoading(true)

		const promise = new Promise<void>((resolve, reject) => {
			setTimeout(() => {
				// 95% mock success rate
				if (Math.random() > 0.05) {
					resolve()
				} else {
					reject(new Error("Transaction failed simulated network error"))
				}
			}, DELAY_MS)
		})

		toast.promise(
			promise,
			{
				loading: "Transaction in Progress... AWAITING CONFIRMATION",
				success: "Transaction successfully submitted! View on Etherscan",
				error: "Transaction failed!",
			},
			{
				style: {
					background: "#1a1d24",
					color: "#fff",
					border: "1px solid #2d3342",
				},
				success: {
					iconTheme: {
						primary: "#00e676",
						secondary: "#1a1d24",
					},
				},
			},
		)

		try {
			await promise
			onSuccess()
			addActivity(actionName, isPositive ? `+${amountStr}` : `-${amountStr}`, isPositive, "COMPLETED")
		} catch {
			addActivity(actionName, isPositive ? `+${amountStr}` : `-${amountStr}`, isPositive, "FAILED")
		} finally {
			setLoading(false)
		}
	}

	const depositEth = async (amount: string) => {
		await simulateTransaction("Deposit ETH", `${amount} ETH`, true, () => {
			setEthBalance((parseFloat(ethBalance) + parseFloat(amount)).toFixed(2))
		})
	}

	const withdrawEth = async (amount: string) => {
		await simulateTransaction("Withdraw ETH", `${amount} ETH`, false, () => {
			setEthBalance((parseFloat(ethBalance) - parseFloat(amount)).toFixed(2))
		})
	}

	const sendToken = async (recipient: string, amount: string) => {
		if (!recipient) {
			toast.error("Recipient address is required")
			return
		}
		await simulateTransaction("Send Token", `${amount} RBNNT`, false, () => {
			setTokenBalance((parseFloat(tokenBalance) - parseFloat(amount)).toFixed(2))
		})
	}

	const depositToken = async (amount: string) => {
		await simulateTransaction("Deposit ERC20", `${amount} RBNNT`, true, () => {
			setTokenBalance((parseFloat(tokenBalance) + parseFloat(amount)).toFixed(2))
		})
	}

	const withdrawToken = async (amount: string) => {
		await simulateTransaction("Withdraw ERC20", `${amount} RBNNT`, false, () => {
			setTokenBalance((parseFloat(tokenBalance) - parseFloat(amount)).toFixed(2))
		})
	}

	const burnToken = async (amount: string) => {
		await simulateTransaction("Burn Token", `${amount} RBNNT`, false, () => {
			setTokenBalance((parseFloat(tokenBalance) - parseFloat(amount)).toFixed(2))
		})
	}

	return {
		depositEth,
		withdrawEth,
		sendToken,
		depositToken,
		withdrawToken,
		burnToken,
	}
}
