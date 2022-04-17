import styles from './contact.module.scss'
import { faAt, faMobile } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons'

/* eslint-disable-next-line */
export interface ContactProps {}

export function Contact(props: ContactProps) {
  return (
    <div className={styles['container']}>
      <div className={styles['phone']}>
        <FontAwesomeIcon icon={faMobile} size="xs" />
        <span> +30 6983797830 </span>
      </div>
      <div className={styles['email']}>
        <FontAwesomeIcon icon={faAt} size="xs" />
        <span> thanasis.glts@gmail.com </span>
      </div>
      <div className={styles['linkedin']}>
        <FontAwesomeIcon icon={faLinkedin} size="xs" />
        <span> /in/thanasis-gkliatis </span>
      </div>
      <div className={styles['github']}>
        <FontAwesomeIcon icon={faGithub} size="xs" />
        <span> /gthanasis </span>
      </div>
      <div className={styles['website']}>
        <a href="https://cv.gthanasis.com">https://cv.gthanasis.com</a>
      </div>
      <div className={styles['location']}>
        Salaminos 74, Chalandri 152 32
        Attica, Grecce
      </div>
    </div>
  )
}

export default Contact
