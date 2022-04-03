import styles from './reference.module.scss'

/* eslint-disable-next-line */
export interface ReferenceProps {}

export function Reference(props: ReferenceProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to Reference!</h1>
    </div>
  )
}

export default Reference
