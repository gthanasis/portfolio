import styles from './contact-details.module.scss'

/* eslint-disable-next-line */
export interface ContactDetailsProps {}

export function ContactDetails(props: ContactDetailsProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to ContactDetails!</h1>
    </div>
  )
}

export default ContactDetails
