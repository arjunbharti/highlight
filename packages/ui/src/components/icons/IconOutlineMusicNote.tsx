import React from 'react'
import { IconProps } from './types'

export const IconOutlineMusicNote = ({ size = '1em', ...props }: IconProps) => {
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
				d="M21.615 2.212A1 1 0 0 1 22 3v13c0 .99-.602 1.765-1.324 2.246-.729.486-1.678.754-2.676.754-.998 0-1.947-.268-2.676-.754C14.602 17.766 14 16.991 14 16c0-.99.602-1.765 1.324-2.246C16.053 13.268 17.002 13 18 13c.712 0 1.4.136 2 .391v-5.11l-10 2.5V19c0 .99-.602 1.765-1.324 2.246C7.947 21.732 6.998 22 6 22c-.998 0-1.947-.268-2.676-.754C2.602 20.766 2 19.991 2 19c0-.99.602-1.765 1.324-2.246C4.053 16.268 5.002 16 6 16c.713 0 1.4.137 2 .391V6a1 1 0 0 1 .757-.97l12-3a1 1 0 0 1 .858.182ZM10 8.719l10-2.5V4.281l-10 2.5v1.938ZM8 19c0-.114-.07-.34-.433-.582C7.21 18.18 6.659 18 6 18c-.659 0-1.21.18-1.567.418C4.07 18.66 4 18.886 4 19c0 .114.07.34.433.582C4.79 19.82 5.341 20 6 20c.659 0 1.21-.18 1.567-.418C7.93 19.34 8 19.114 8 19Zm12-3c0-.114-.07-.34-.433-.582C19.209 15.18 18.658 15 18 15c-.659 0-1.21.18-1.567.418-.364.243-.433.468-.433.582 0 .114.07.34.433.582.358.238.909.418 1.567.418.659 0 1.21-.18 1.567-.418.364-.243.433-.468.433-.582Z"
				clipRule="evenodd"
			/>
		</svg>
	)
}
