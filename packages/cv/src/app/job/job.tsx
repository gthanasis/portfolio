import styles from './job.module.scss'
import React from 'react'
import JobTitle from '../job-title/job-title'

export type Job = {
  period?: {
    from: Date
    to?: Date
  }
  title: string,
  company: string
  companyLink?: string
}

export interface JobProps extends Job {
  children?: React.ReactNode
}

const extractDate = (d: Date) => {
  const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d)
  const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d)
  const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d)
  return { ye, mo, da }
}

export function Job(props: JobProps) {
  const { period, title, company, companyLink, children} = props
  let from = undefined
  let to = 'present'
  if (period && period.from) {
    const { ye, mo, da } = extractDate(period.from)
    from = `${mo} ${da}, ${ye}`
  }
  if (period && period.to) {
    const { ye, mo, da } = extractDate(period.to)
    to = `to ${mo} ${da}, ${ye}`
  }
  const periodLine = <div className={styles['periodLine']}>
    { from && <div className={styles['periodStart']}>from {from}</div> }
    { to && <div className={styles['periodSeparator']}>-</div> }
    { to && <div className={styles['periodStart']}>{to}</div> }
  </div>
  return (
    <div className={styles['container']}>
      { periodLine }
      <JobTitle title={title} company={company} />
      <div className={styles['content']}>
        { children }
      </div>
    </div>
  )
}

export default Job
