import styles from './job.module.scss'
import React from 'react'
import JobTitle from '../job-title/job-title'

export type Job = {
  period?: {
    from: Date
    to: Date
  }
  title: string,
  company: string
  companyLink?: string
}

export interface JobProps extends Job {
  children?: React.ReactNode
}

export function Job(props: JobProps) {
  const { period, title, company, companyLink, children} = props
  const periodLine = <div className={styles['periodLine']}>
    { period && period.from && <div className={styles['periodStart']}></div> }
    { period && period.to && <div>-</div> }
    { period && period.to && <div className={styles['periodStart']}></div> }
  </div>
  return (
    <div className={styles['container']}>
      <JobTitle title={title} company={company} />
      { periodLine }
      {children}
    </div>
  )
}

export default Job
