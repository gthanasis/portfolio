import styles from './app.module.scss'
import JobsList from './jobs-list/jobs-list'
import Section from './section/section'
import Contact from './contact/contact'
import Sidenav from './sidenav/sidenav'
import Reference from './reference/reference'
import Footer from './footer/footer'

export function App() {
  const references = [
    {
      title: 'Founder & CEO',
      location: 'Athens, GR',
      name: 'Theo Vasileiadis',
      company: 'Socital & Kariera.gr',
      linkedIn: 'https://www.linkedin.com/in/theofilosvasiliadis/'
    },
    {
      title: 'Technical Product Manager',
      location: 'Athens, GR',
      name: 'Giannis Zaoudis',
      company: 'Kariera.gr & Pollfish',
      linkedIn: 'https://www.linkedin.com/in/zaoudis/'
    }
  ]
  return (
    <div className={styles['cv-canvas']}>
      <div className={styles['cv-wrapper']}>
        <div className={styles['columns']}>
          <div className={`${styles['left-column']} ${styles['sidenav']}`}>
            <Sidenav/>
          </div>
          <div className={styles['right-column']}>
            <div className={styles['icon-wrapper']}>
              <div className={styles['icon-ghost']}/>
              <div className={styles['icon-ghost-contact']}>
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
        <Footer/>
      </div>
    </div>
  )
}

export default App
