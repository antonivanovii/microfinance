import { MASCOTS, type MascotName } from '../../assets'
import styles from './Mascot.module.css'

const SIZES = {
  sm: 120,
  md: 150,
  lg: 200,
  xl: 280,
} as const

interface MascotProps {
  name: MascotName
  size?: keyof typeof SIZES
  alt?: string
}

export function Mascot({ name, size = 'md', alt = '' }: MascotProps) {
  const px = SIZES[size]
  return (
    <img
      className={styles.root}
      src={MASCOTS[name]}
      alt={alt}
      width={px}
      height={px}
      loading="lazy"
      decoding="async"
    />
  )
}
