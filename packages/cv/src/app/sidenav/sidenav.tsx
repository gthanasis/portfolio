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
        Obsessed with designing well-thought software through team collaboration.
        Always trying to maximize organization / personal value while maintaining
        code quality, best practices, and fulfilling my code cravings.
        Lately into user experience, microservices, micro frontends, D3 data visualizations,
        HA/FT systems.
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
