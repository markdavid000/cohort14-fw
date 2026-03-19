import React, { useState } from "react"
import { Input, Button, Label } from "../ui"
import { useMockContract, useAppContext } from "../../hooks"

import { MdRemoveCircleOutline } from "react-icons/md"

interface Props {
	onComplete?: () => void
}

export const WithdrawEthForm: React.FC<Props> = ({ onComplete }) => {
	const [amount, setAmount] = useState("")
	const { withdrawEth } = useMockContract()
	const { loading, ethBalance } = useAppContext()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!amount) return
		await withdrawEth(amount)
		setAmount("")
		onComplete?.()
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div>
				<h2 className="text-xl font-bold text-white mb-2">Withdraw ETH</h2>
				<p className="text-sm text-gray-400">Securely withdraw ETH to your connected wallet.</p>
			</div>

			<div>
				<div className="flex justify-between items-center mb-2">
					<Label className="mb-0">Amount Field (ETH)</Label>
					<span className="text-xs text-gray-500">Available: {ethBalance} ETH</span>
				</div>
				<Input
					type="number"
					step="0.01"
					min="0"
					placeholder="0.00"
					value={amount}
					onChange={(e) => setAmount(e.target.value)}
					suffix="ETH"
					required
				/>
			</div>

			<Button type="submit" variant="primary" fullWidth isLoading={loading} leftIcon={<MdRemoveCircleOutline />}>
				Withdraw ETH
			</Button>
		</form>
	)
}
