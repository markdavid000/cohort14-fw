import React, { useState } from "react"
import { Input, Button, Label } from "../ui"
import { useAppContext, useMockContract } from "../../hooks"
import { MdAddCircleOutline } from "react-icons/md"

interface Props {
	onComplete?: () => void
}

export const DepositEthForm: React.FC<Props> = ({ onComplete }) => {
	const [amount, setAmount] = useState("")
	const { depositEth } = useMockContract()
	const { loading } = useAppContext()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!amount) return
		await depositEth(amount)
		setAmount("")
		onComplete?.()
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div>
				<h2 className="text-xl font-bold text-white mb-2">Deposit ETH</h2>
				<p className="text-sm text-gray-400">Fund your vault instantly with Ethereum mainnet.</p>
			</div>

			<div>
				<Label>Amount Field (ETH)</Label>
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

			<Button type="submit" variant="primary" fullWidth isLoading={loading} leftIcon={<MdAddCircleOutline />}>
				Deposit ETH
			</Button>
		</form>
	)
}
