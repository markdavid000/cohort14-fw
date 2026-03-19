import React, { type InputHTMLAttributes, type ReactNode } from "react"

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	icon?: ReactNode
	suffix?: ReactNode
	error?: string
	fullWidth?: boolean
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className = "", icon, suffix, error, fullWidth = false, ...props }, ref) => {
		const baseStyles =
			"flex items-center w-full bg-[#0d0e12] border border-gray-800 rounded-lg text-white transition-colors focus-within:border-[#00d4ff] focus-within:ring-1 focus-within:ring-[#00d4ff]"
		const errorStyles = error ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-500" : ""
		const widthClass = fullWidth ? "w-full" : ""

		return (
			<div className={`${widthClass}`}>
				<div className={`${baseStyles} ${errorStyles} px-3 py-2 ${className}`}>
					{icon && <span className="text-gray-400 mr-2 shrink-0">{icon}</span>}
					<input
						ref={ref}
						className="flex-1 bg-transparent border-none outline-none text-sm placeholder-gray-500 w-full"
						{...props}
					/>
					{suffix && (
						<span className="ml-2 text-gray-400 font-medium text-xs whitespace-nowrap">{suffix}</span>
					)}
				</div>
				{error && <p className="mt-1 text-xs text-red-500">{error}</p>}
			</div>
		)
	},
)

Input.displayName = "Input"
