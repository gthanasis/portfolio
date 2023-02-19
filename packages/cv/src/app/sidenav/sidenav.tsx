import styles from './sidenav.module.scss'
import Signature from '../signature/signature'
import Section from '../section/section'
import List from '../list/list'

/* eslint-disable-next-line */
export interface SidenavProps {
  inline?: boolean
}

export function Sidenav(props: SidenavProps) {
  const { inline } = props
  const skills = [
    'Project management',
    'Software Design',
    'H/A Environments',
    'Microservices',
    'Scrum',
    'UX',
  ]
  const technologies = [
    'Typescript',
    'Javascript',
    'NodeJS',
    'Nginx',
    'Ansible',
    'Bash/Unix'
  ]
  const frameworks = [
    'ReactJS',
    'ExpressJS',
    'Tailwind',
    'SCSS/SASS',
    'D3.js'
  ]
  const databases = [
    'Elasticsearch',
    'PostgreSQL',
    'MongoDB'
  ]
  return (
    <>
      <div className={styles['signature']}>
        <Signature/>
      </div>
      <Section title={'Profile'}>
        Highly motivated software engineer with a passion for designing well-architected
        software through team collaboration. With a strong commitment to quality,
        I consistently strive to maximize organizational and personal value while adhering
        to best practices. My expertise includes clean architecture, high-availability and
        fault-tolerant systems, event-driven design, and a recent focus on micro frontends.
        I am dedicated to staying up-to-date on the latest technology trends and committed
        to continuously improving my skills.
      </Section>
      <Section title={'Skills'}>
        <List items={skills} />
      </Section>
      <Section title={'Technologies'}>
        <List items={technologies} />
      </Section>
      <Section title={'Frameworks'}>
        <List items={frameworks} />
      </Section>
      <Section title={'Databases'}>
        <List items={databases} />
      </Section>
    </>
  )
}

export default Sidenav
