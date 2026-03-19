import React, { type LabelHTMLAttributes } from "react"

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
	required?: boolean
}

export const Label: React.FC<LabelProps> = ({ className = "", children, required, ...props }) => {
	return (
		<label
			className={`block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 ${className}`}
			{...props}>
			{children}
			{required && <span className="text-red-500 ml-1">*</span>}
		</label>
	)
}
