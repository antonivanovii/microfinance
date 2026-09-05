import { OBJECTS, type ObjectName } from '../../assets'
import styles from './ObjectImage.module.css'

interface ObjectImageProps {
  name: ObjectName
  size?: number
  alt?: string
}

export function ObjectImage({ name, size = 96, alt = '' }: ObjectImageProps) {
  return (
    <img
      className={styles.root}
      src={OBJECTS[name]}
      alt={alt}
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
    />
  )
}
