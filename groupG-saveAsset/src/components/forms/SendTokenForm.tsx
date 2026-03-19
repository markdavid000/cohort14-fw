import React, { useState } from "react"
import { Input, Button, Label } from "../ui"
import { useMockContract, useAppContext } from "../../hooks"

import { MdSend } from "react-icons/md"

interface Props {
	onComplete?: () => void
}

export const SendTokenForm: React.FC<Props> = ({ onComplete }) => {
	const [recipient, setRecipient] = useState("")
	const [amount, setAmount] = useState("")
	const { sendToken } = useMockContract()
	const { loading, tokenBalance } = useAppContext()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!amount || !recipient) return
		await sendToken(recipient, amount)
		setAmount("")
		setRecipient("")
		onComplete?.()
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div>
				<h2 className="text-xl font-bold text-white mb-2">Send RBNNT Token</h2>
				<p className="text-sm text-gray-400">Transfer institutional liquidity securely.</p>
			</div>

			<div>
				<Label>Recipient Address</Label>
				<Input
					type="text"
					placeholder="0x..."
					value={recipient}
					onChange={(e) => setRecipient(e.target.value)}
					required
				/>
			</div>

			<div>
				<div className="flex justify-between items-center mb-2">
					<Label className="mb-0">Amount</Label>
					<span className="text-xs text-gray-500">Balance: {tokenBalance} RBNNT</span>
				</div>
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

			<Button
				type="submit"
				variant="primary"
				fullWidth
				isLoading={loading}
				leftIcon={<MdSend className="text-black" />}>
				Send Tokens
			</Button>
		</form>
	)
}
