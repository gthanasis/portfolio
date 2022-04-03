import styles from './job-title.module.scss'

/* eslint-disable-next-line */
export interface JobTitleProps {
  title: string
  company: string
}

export function JobTitle(props: JobTitleProps) {
  const {title, company} = props
  return (
    <div className={styles['container']}>
      <div className={styles['title']}>{title}</div>
      <div className={styles['separator']} />
      <div className={styles['company']}>{company}</div>
    </div>
  )
}

export default JobTitle
