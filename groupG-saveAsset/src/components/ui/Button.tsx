import React, { type ButtonHTMLAttributes } from "react"

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger"
type ButtonSize = "sm" | "md" | "lg" | "icon"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant
	size?: ButtonSize
	isLoading?: boolean
	fullWidth?: boolean
	leftIcon?: React.ReactNode
	rightIcon?: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
	className = "",
	variant = "primary",
	size = "md",
	isLoading = false,
	fullWidth = false,
	leftIcon,
	rightIcon,
	children,
	disabled,
	...props
}) => {
	const baseStyles =
		"inline-flex items-center justify-center font-bold tracking-wide transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed rounded-full"

	const variants: Record<ButtonVariant, string> = {
		primary:
			"bg-gradient-to-r from-[#80edff] to-[#00aacc] text-black hover:from-[#a6f4ff] hover:to-[#00d4ff] shadow-[0_0_15px_rgba(0,212,255,0.15)] hover:shadow-[0_0_20px_rgba(0,212,255,0.3)]",
		secondary: "bg-[#222630] text-white hover:bg-[#2c313c] border border-gray-700",
		outline: "bg-transparent text-[#00d4ff] border border-[#00d4ff] hover:bg-[#00d4ff] hover:text-black",
		ghost: "bg-transparent text-gray-300 hover:text-white hover:bg-[#222630]",
		danger: "bg-transparent text-red-500 hover:bg-red-500/10",
	}

	const sizes: Record<ButtonSize, string> = {
		sm: "text-xs px-3 py-1.5",
		md: "text-sm px-4 py-2",
		lg: "text-base px-6 py-3",
		icon: "p-2",
	}

	const classes = [baseStyles, variants[variant], sizes[size], fullWidth ? "w-full" : "", className]
		.filter(Boolean)
		.join(" ")

	return (
		<button className={classes} disabled={disabled || isLoading} {...props}>
			{isLoading && (
				<svg
					className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24">
					<circle
						className="opacity-25"
						cx="12"
						cy="12"
						r="10"
						stroke="currentColor"
						strokeWidth="4"></circle>
					<path
						className="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
				</svg>
			)}
			{!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
			{children}
			{!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
		</button>
	)
}
