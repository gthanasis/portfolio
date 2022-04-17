import styles from './jobs-list.module.scss'
import List from '../list/list'
import Job from '../job/job'
import { useState } from 'react'

/* eslint-disable-next-line */
export interface JobsListProps {}

export function JobsList(props: JobsListProps) {
  const [showOlder, setShowOlder] = useState(false)
  const older = showOlder
    ?
      <>
        <div className={styles['job']} >
          <Job
            title={'Website developer'}
            company={'Agorainfo.net'}
            period={{
              from: new Date('May 01, 2016'),
              to: new Date('Oct 01, 2016')
            }}
          >
            Agorainfo.net is a digital agency that mostly developed e-shops built on CMS.
            Most common tasks:
            <List items={[
              'Project based website development',
              'Project based eshop development',
              'Custom extensions for various popular CMS'
            ]} />
          </Job>
        </div>
      </>
    : null
  return (
    <div className={styles['container']}>
      <div className={styles['job']} >
        <Job
          title={'Tech lead'}
          company={'Socital'}
          period={{
            from: new Date('Jan 01, 2020')
          }}
        >
          As part of a good funding round, I stared working on putting together a 6 person team
          to push Socital's software to the next stage and start growing even faster. Besides
          finalizing the dev process, optimizing the team's delivery rate and adding some fresh
          technologies to the task, I participated in the recruitment process to overcome the
          lack of Engineering supply. With constant collaboration with the Product team and the DevOps
          team we managed to create a healthy team that always delivered on time.
          <br/>
          <br/>
          Some projects that I am proud of:
          <br/>
          <br/>
          <List items={[
            'Introduce TS in the codebase and translated some core parts',
            'Lead and designed the DevOps pipelines using docker, K8s and circleCI',
            'Optimized the development process that worked towards a major delivery rate improvement',
            'Introduced kafka and event driven architecture (event notification pattern) to microservices',
            'Created a design system for our web application from scratch which was available though Storybook',
            'Lead and designed the v2 of on-site campaigns, live editor and the core rendering engine in React.js'
          ]} />
        </Job>
      </div>
      <div className={styles['job']} >
        <Job
          title={'Sr. Software Engineer'}
          company={'Socital'}
          period={{
            from: new Date('Jan 01, 2018'),
            to: new Date('Dec 30, 2020')
          }}
        >
          After some years being involved with the codebase, I took part in most of
          the technical design decisions and lifecycle of the application. While developing
          new client facing features we kept a track of consuming tech debt and improving
          the architecture as well as the development process.
          <br/>
          <br/>
          Some of my many interesting projects:
          <br/>
          <br/>
          <List items={[
            'Redesigned & refactored application\'s tests to create a reliable suite',
            'Introduced Cypress.js for E2E tests and implemented strategically the most business critical tests',
            'Designed & implemented a multi vendor subscription system',
            'Refactored blue/green ansible deployment playbooks',
            'Standardized and provisioned a centralized logging cluster for all components based on ELKB',
            'Reduced public script size by 80%',
            'Introduced yarn workspaces and structured the monorepo to packages and shared modules',
            'Refactored authentication microservice'
          ]} />
        </Job>
      </div>
      <div className={styles['job']} >
        <Job
          title={'Software Engineer'}
          company={'Socital'}
          period={{
            from: new Date('Oct 01, 2016'),
            to: new Date('Jan 01, 2018')
          }}
        >
          I joined Socital as a software engineer to expand the team and develop integrations with third
          party platforms such us Mailchimp, Moosend, Magento, etc. Soon I took more responsibilities and begun
          to actively contributing across the codebase.
          <br/>
          <br/>
          Some of my most interesting projects:
          <br/>
          <br/>
          <List items={[
            'Integration microservice with an internal queue that was responsible of handling rate limits and huge amount of API calls',
            'A Magento extension that integrated the CMS with socital onsite campaigns functionalities',
            'Successfully refactored the implementation on one of the main entities / models'
          ]} />
        </Job>
      </div>
      { !showOlder && <a className={styles['showOlder']} onClick={() => setShowOlder(!showOlder)}>{ showOlder ? 'Hide' :  'Show' } older</a> }
      { older }
    </div>
  )
}

export default JobsList
