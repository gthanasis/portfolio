import styles from './app.module.scss'
import ContactDetails from './contact-details/contact-details'
import JobsList from './jobs-list/jobs-list'
import Reference from './reference/reference'
import JobTitle from './job-title/job-title'
import Section from './section/section'
import Job from './job/job'

export function App() {
  return (
    <>
      <div className={styles['example']}>
        <h2>Job Title</h2>
        <JobTitle title={'Job title'} company={'Company'}></JobTitle>
      </div>
      <div className={styles['example']}>
        <h2>Jobs</h2>
        <JobsList></JobsList>
      </div>
      <div className={styles['example']}>
        <h2>Job</h2>
        <Job title={'Software Engineer'} company={'Socital'}></Job>
      </div>
      <div className={styles['example']}>
        <h2>Reference</h2>
        <Reference></Reference>
      </div>
      <div className={styles['example']}>
        <h2>Section</h2>
        <Section></Section>
      </div>
      <div className={styles['example']}>
        <h2>Contact Details</h2>
        <ContactDetails></ContactDetails>
      </div>
    </>
  )
}

export default App
