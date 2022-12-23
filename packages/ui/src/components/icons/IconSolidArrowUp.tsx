import React from 'react'
import { IconProps } from './types'

export const IconSolidArrowUp = ({ size = '1em', ...props }: IconProps) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={size}
			height={size}
			fill="none"
			viewBox="0 0 20 20"
			focusable="false"
			{...props}
		>
			<path
				fill="currentColor"
				fillRule="evenodd"
				d="M3.293 9.707a1 1 0 0 1 0-1.414l6-6a1 1 0 0 1 1.414 0l6 6a1 1 0 0 1-1.414 1.414L11 5.414V17a1 1 0 1 1-2 0V5.414L4.707 9.707a1 1 0 0 1-1.414 0Z"
				clipRule="evenodd"
			/>
		</svg>
	)
}
