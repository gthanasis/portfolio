import styles from './jobs-list.module.scss'

export type Job = {
  period: {
    from: Date
    to: Date
  }
  title: string,
  company: string
  companyLink: string
  content: unknown
}

/* eslint-disable-next-line */
export interface JobsListProps {
  jobs?: Job[]
}

export function JobsList(props: JobsListProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to JobsList!</h1>
    </div>
  )
}

export default JobsList
