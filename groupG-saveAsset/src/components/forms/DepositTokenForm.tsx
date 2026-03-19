import React, { useState } from "react"
import { Input, Button, Label } from "../ui"
import { useAppContext, useMockContract } from "../../hooks"
import { MdArrowDownward } from "react-icons/md"

interface Props {
	onComplete?: () => void
}

export const DepositTokenForm: React.FC<Props> = ({ onComplete }) => {
	const [amount, setAmount] = useState("")
	const { depositToken } = useMockContract()
	const { loading } = useAppContext()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!amount) return
		await depositToken(amount)
		setAmount("")
		onComplete?.()
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div>
				<h2 className="text-xl font-bold text-white mb-2">Deposit RBNNT</h2>
				<p className="text-sm text-gray-400">Lock your ERC20 tokens into the institutional vault.</p>
			</div>

			<div>
				<Label>Amount Field (RBNNT)</Label>
				<Input
					type="number"
					step="0.01"
					min="0"
					placeholder="0.00"
					value={amount}
					onChange={(e) => setAmount(e.target.value)}
					suffix="RBNNT"
					required
				/>
			</div>

			<Button type="submit" variant="primary" fullWidth isLoading={loading} leftIcon={<MdArrowDownward />}>
				Deposit Tokens
			</Button>
		</form>
	)
}
