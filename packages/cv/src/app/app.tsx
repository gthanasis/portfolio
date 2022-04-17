import styles from './app.module.scss'
import JobsList from './jobs-list/jobs-list'
import Section from './section/section'
import List from './list/list'
import Signature from './signature/signature'
import Contact from './contact/contact'
import Sidenav from './sidenav/sidenav'
import Reference from './reference/reference'

export function App() {

  const references = [
    {
      title: 'Founder & CEO',
      email: 'theo@socital.com',
      location: 'Athens, GR',
      phone: '+306912121212',
      name: 'Theo Vasileiadis',
      company: 'Socital & Kariera.gr',
      linkedIn: 'https://www.linkedin.com/in/theofilosvasiliadis/'
    },
    {
      title: 'Technical Product Manager',
      email: 'zaoudis@gmail.com',
      location: 'Athens, GR',
      phone: '+30691212121212',
      name: 'Giannis Zaoudis',
      company: 'Kariera.gr & Pollfish',
      linkedIn: 'https://www.linkedin.com/in/zaoudis/'
    }
  ]
  return (
    <div className={styles['cv-canvas']}>
      <div className={styles['cv-wrapper']}>
        <div className={styles['columns']}>
          <div className={`${styles['leftColumn']} ${styles['sidenav']}`}>
            <Sidenav/>
          </div>
          <div className={styles['rightColumn']}>
            <div className={styles['iconWrapper']}>
              <div className={styles['iconGhost']}/>
              <div className={styles['iconGhostContact']}>
                <Contact/>
              </div>
              <div className={styles['icon']}/>
            </div>
            <div className={styles['side-scroll']}>
              <Sidenav/>
            </div>
            <Section title={'Experience'}>
              <JobsList/>
            </Section>
            <Section title={'Talks'}>
              <a target={'_blank'} href="https://www.youtube.com/watch?v=QnkJZYZ8dBk">Tech excellence on starts ups | Developer talks</a>
            </Section>
            <Section title={'Reference'}>
              <div className={styles['references']}>
                {references.map(ref => <div className={styles['reference']}> <Reference {...ref} /> </div>)}
              </div>
            </Section>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
