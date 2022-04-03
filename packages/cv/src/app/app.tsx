import styles from './app.module.scss'
import ContactDetails from './contact-details/contact-details'
import JobsList from './jobs-list/jobs-list'
import Reference from './reference/reference'
import JobTitle from './job-title/job-title'
import Section from './section/section'
import Job from './job/job'
import List from './list/list'
import Signature from './signature/signature'

export function App() {
  const skills = [
    'Project management',
    'Software Design',
    'H/A Environments',
    'Microservices',
    'SCRUM',
    'UX',
  ]
  const technologies = [
    'Javascript',
    'MongoDB',
    'PostgreSQL',
    'Elasticsearch',
    'NodeJS',
    'D3.js',
    'SCSS/SASS'
  ]
  return (
    <div className={styles['cv-canvas']}>
      <div className={styles['cv-wrapper']}>
        <div className={styles['columns']}>
          <div className={styles['leftColumn']}>
            <Signature/>
          </div>
          <div className={styles['rightColumn']}>
            <img width={'200px'} src="https://static.gthanasis.com/portofolio-photo.jpg" alt="Icon" className={styles['cropped']}/>
          </div>
        </div>
        <div className={styles['columns']}>
          <div className={styles['leftColumn']}>
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
          </div>
          <div className={styles['rightColumn']}>
            <Section title={'Experience'}>
              <JobsList/>
            </Section>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
