import styles from './section.module.scss'
import React from 'react'

/* eslint-disable-next-line */
export interface SectionProps {
  title: string
  children: React.ReactNode
}

export function Section(props: SectionProps) {
  const {title, children} = props
  return (
    <div className={styles['container']}>
      <div className={styles['title']}>{title}</div>
      {children}
    </div>
  )
}

export default Section
