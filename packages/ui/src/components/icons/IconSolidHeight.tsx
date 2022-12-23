import React from 'react'
import { IconProps } from './types'

export const IconSolidHeight = ({ size = '1em', ...props }: IconProps) => {
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
			<g clipPath="url(#a)">
				<path
					fill="currentColor"
					d="m8.922 12.62.129-.107 6.473-.056.04.164a.409.409 0 0 1-.04.1c-.056.098-.177.168-.419.308l-6.25 3.616c-.622.36-.933.54-1.125.497a.505.505 0 0 1-.363-.315c-.07-.184.065-.518.335-1.185l1.22-3.021Z"
				/>
				<path
					fill="currentColor"
					d="M15.564 12.62H8.922l-.039-.274 2.01-4.915.165-.092 4.208 4.675.02.022c.173.193.26.294.282.4a.413.413 0 0 1-.004.185Z"
				/>
				<path
					fill="currentColor"
					d="m11.108 3.35-6.22 3.582c-.242.139-.364.209-.42.307a.413.413 0 0 0-.045.285c.023.11.116.215.303.423l4.196 4.674 2.136-5.282 1.203-2.985c.268-.665.402-.997.333-1.181a.505.505 0 0 0-.363-.315c-.192-.043-.502.135-1.123.493Z"
				/>
			</g>
			<defs>
				<clipPath id="a">
					<path fill="currentColor" d="M0 0h20v20H0z" />
				</clipPath>
			</defs>
		</svg>
	)
}
