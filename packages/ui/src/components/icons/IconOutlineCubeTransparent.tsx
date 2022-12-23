import React from 'react'
import { IconProps } from './types'

export const IconOutlineCubeTransparent = ({
	size = '1em',
	...props
}: IconProps) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={size}
			height={size}
			fill="none"
			viewBox="0 0 24 24"
			focusable="false"
			{...props}
		>
			<path
				fill="currentColor"
				fillRule="evenodd"
				d="M11.553 2.106a1 1 0 0 1 .894 0l2 1a1 1 0 1 1-.894 1.788L12 4.118l-1.553.776a1 1 0 1 1-.894-1.788l2-1ZM6.894 5.553a1 1 0 0 1-.447 1.341L6.237 7l.21.106a1 1 0 0 1-.894 1.788L5 8.618V9.5a1 1 0 1 1-2 0V7a1 1 0 0 1 .553-.894l2-1a1 1 0 0 1 1.341.447Zm10.212 0a1 1 0 0 1 1.341-.447l2 1A1 1 0 0 1 21 7v2.5a1 1 0 1 1-2 0v-.882l-.553.276a1 1 0 1 1-.894-1.788l.21-.106-.21-.106a1 1 0 0 1-.447-1.341Zm-8 4a1 1 0 0 1 1.341-.447L12 9.882l1.553-.776a1 1 0 1 1 .894 1.788L13 11.618V13.5a1 1 0 1 1-2 0v-1.882l-1.447-.724a1 1 0 0 1-.447-1.341ZM4 13.5a1 1 0 0 1 1 1v1.882l1.447.724a1 1 0 1 1-.894 1.788l-2-1A1 1 0 0 1 3 17v-2.5a1 1 0 0 1 1-1Zm16 0a1 1 0 0 1 1 1V17a1 1 0 0 1-.553.894l-2 1a1 1 0 1 1-.894-1.788L19 16.382V14.5a1 1 0 0 1 1-1Zm-8 4a1 1 0 0 1 1 1v.882l.553-.276a1 1 0 1 1 .894 1.788l-2 1a1 1 0 0 1-.894 0l-2-1a1 1 0 1 1 .894-1.788l.553.276V18.5a1 1 0 0 1 1-1Z"
				clipRule="evenodd"
			/>
		</svg>
	)
}
