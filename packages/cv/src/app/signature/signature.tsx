import styles from './signature.module.scss'

/* eslint-disable-next-line */
export interface SignatureProps {}

export function Signature(props: SignatureProps) {
  return (
    <div className={styles['container']}>
      <div className={styles['surname']}>GKLIATIS</div>
      <div className={styles['name']}>THANASIS</div>
      <div className={styles['title']}>SOFTWARE ENGINEER</div>
      <div className={styles['personality']}>
        [<a  target={'_blank'} href="https://www.16personalities.com/enfj-personality" rel="noreferrer">ENFJ</a>]
      </div>
    </div>
  )
}

export default Signature
