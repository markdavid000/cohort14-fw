import React, { type HTMLAttributes } from "react"

interface CardProps extends HTMLAttributes<HTMLDivElement> {
	variant?: "default" | "interactive" | "outline" | "gradient"
	noPadding?: boolean
}

export const Card: React.FC<CardProps> = ({
	className = "",
	variant = "default",
	noPadding = false,
	children,
	...props
}) => {
	const baseStyles = "rounded-xl overflow-hidden"

	const variants = {
		default: "bg-[#16181d] border border-gray-800/60 shadow-lg",
		interactive:
			"bg-[#16181d] border border-gray-800/60 shadow-lg hover:border-gray-600 transition-colors cursor-pointer hover:bg-[#1a1c23]",
		outline: "bg-transparent border border-dashed border-gray-700",
		gradient: "bg-gradient-to-br from-[#16181d] to-[#0f1115] border border-gray-800 shadow-xl",
	}

	const classes = [baseStyles, variants[variant], !noPadding ? "p-5" : "", className].filter(Boolean).join(" ")

	return (
		<div className={classes} {...props}>
			{children}
		</div>
	)
}
