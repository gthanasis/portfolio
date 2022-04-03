import styles from './reference.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLinkedin } from '@fortawesome/free-brands-svg-icons'
import { faMobile, faAt } from '@fortawesome/free-solid-svg-icons'

/* eslint-disable-next-line */
export interface ReferenceProps {
  name: string
  title: string
  company: string
  location: string
  phone: string
  email: string
  linkedIn?: string
}

export function Reference(props: ReferenceProps) {
  const {
    name,
    title,
    company,
    location,
    phone,
    email,
    linkedIn
  } = props
  return (
    <div className={styles['container']}>
      <a className={styles['name']} target={'_blank'} href={linkedIn}>
        <FontAwesomeIcon icon={faLinkedin} size="xs" />
        <div className={styles['nameText']}>{name}</div>
      </a>
      <div className={styles['title']}>{title}</div>
      <div className={styles['company']}>{company}</div>
      <div className={styles['location']}>{location}</div>
      <div className={styles['phone']}>
        <FontAwesomeIcon icon={faMobile} size="xs" />
        <div className={styles['phoneText']} >{phone}</div>
      </div>
      <div className={styles['email']}>
        <FontAwesomeIcon icon={faAt} size="xs" />
        <div className={styles['emailText']} >{email}</div>
      </div>
    </div>
  )
}

export default Reference
