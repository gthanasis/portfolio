import styles from './footer.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { faFilePdf } from '@fortawesome/free-solid-svg-icons'

export function Footer() {
  return (
    <div className={styles['columns']}>
      <div className={styles['left-column']}>© {(new Date().getFullYear())} Thanasis G.</div>
      <div className={styles['right-column']}>
        <a target={'_blank'} href="https://github.com/gthanasis/portfolio/tree/main/packages/cv/src" rel="noreferrer">
          <div className={styles['github']}>
            <FontAwesomeIcon icon={faGithub} size="xs" />
            <span> View on github </span>
          </div>
        </a>
        <a target={'_blank'} href="" rel="noreferrer">
          <div className={styles['github']}>
            <FontAwesomeIcon icon={faFilePdf} size="xs" />
            <span> Download pdf </span>
          </div>
        </a>
      </div>
    </div>
  )
}

export default Footer
