import React, { useState } from "react"
import { Input, Button, Label } from "../ui"
import { useMockContract } from "../../hooks"
import { useAppContext } from "../../hooks"
import { MdLocalFireDepartment } from "react-icons/md"

interface Props {
	onComplete?: () => void
}

export const BurnTokenForm: React.FC<Props> = ({ onComplete }) => {
	const [amount, setAmount] = useState("")
	const { burnToken } = useMockContract()
	const { loading, tokenBalance } = useAppContext()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!amount) return
		await burnToken(amount)
		setAmount("")
		onComplete?.()
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div>
				<h2 className="text-xl font-bold text-red-500 mb-2">Burn RBNNT</h2>
				<p className="text-sm text-gray-400">Permanently destroy vault tokens. This action is irreversible.</p>
			</div>

			<div>
				<div className="flex justify-between items-center mb-2">
					<Label className="mb-0">Amount Field (RBNNT)</Label>
					<span className="text-xs text-gray-500">Vault Balance: {tokenBalance} RBNNT</span>
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

			<Button type="submit" variant="danger" fullWidth isLoading={loading} leftIcon={<MdLocalFireDepartment />}>
				Burn Tokens
			</Button>
		</form>
	)
}
