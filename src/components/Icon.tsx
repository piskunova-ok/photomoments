export type IconName =
  | 'palette'
  | 'sparkles'
  | 'clock'
  | 'shield'
  | 'truck'
  | 'wallet'
  | 'arrowRight'
  | 'check'
  | 'calculator'
  | 'upload'
  | 'form'
  | 'box'
  | 'pin'
  | 'phone'
  | 'menu'
  | 'close'
  | 'minus'
  | 'plus'

const PATHS: Record<IconName, string> = {
  palette:
    'M12 3a9 9 0 0 0 0 18h1.5a2 2 0 0 0 0-4H13a2 2 0 0 1 0-4h4a4 4 0 0 0 4-4 6 6 0 0 0-9-6Z M7.5 10.5h.01 M10.5 7.5h.01 M14.5 7.5h.01',
  sparkles:
    'M12 3v4 M12 17v4 M3 12h4 M17 12h4 M6.3 6.3l2.8 2.8 M14.9 14.9l2.8 2.8 M17.7 6.3l-2.8 2.8 M9.1 14.9l-2.8 2.8',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z M12 7v5l3 2',
  shield: 'M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z M9.5 12l1.8 1.8 3.4-3.6',
  truck:
    'M3 7h11v9H3z M14 10h4l3 3v3h-7z M6.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z M17.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z',
  wallet: 'M4 7h16v11H4z M4 7l2.5-3h11L20 7 M15 12.5h.01',
  arrowRight: 'M5 12h14 M13 6l6 6-6 6',
  check: 'M5 13l4 4 10-11',
  calculator: 'M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z M8 7h8v3H8z M8 14h.01 M12 14h.01 M16 14h.01 M8 17.5h.01 M12 17.5h.01 M16 17.5h.01',
  upload: 'M12 16V4 M7 9l5-5 5 5 M5 20h14',
  form: 'M5 4h14v16H5z M8.5 8.5h7 M8.5 12h7 M8.5 15.5h4',
  box: 'M3.5 8L12 3.5 20.5 8v8L12 20.5 3.5 16V8Z M3.5 8l8.5 4.5 8.5-4.5 M12 12.5v8',
  pin: 'M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
  phone:
    'M6 3h3l1.5 4-2 1.5a12 12 0 0 0 5 5l1.5-2 4 1.5v3a2 2 0 0 1-2 2A15 15 0 0 1 4 5a2 2 0 0 1 2-2Z',
  menu: 'M4 7h16 M4 12h16 M4 17h16',
  close: 'M6 6l12 12 M18 6L6 18',
  minus: 'M6 12h12',
  plus: 'M12 6v12 M6 12h12',
}

interface IconProps {
  name: IconName
  className?: string
}

export function Icon({ name, className = '' }: IconProps) {
  return (
    <svg
      className={`icon ${className}`.trim()}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={PATHS[name]} />
    </svg>
  )
}
