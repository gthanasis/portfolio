import styles from './app.module.scss'
import ContactDetails from './contact-details/contact-details'
import JobsList from './jobs-list/jobs-list'
import Reference from './reference/reference'
import JobTitle from './job-title/job-title'
import Section from './section/section'
import Job from './job/job'
import List from './list/list'

export function App() {
  return (
    <>
      <div className={styles['example']}>
        <h2>Contact Details</h2>
        <ContactDetails></ContactDetails>
      </div>
    </>
  )
}

export default App
