import styles from './jobs-list.module.scss'
import List from '../list/list'
import Job from '../job/job'

/* eslint-disable-next-line */
export interface JobsListProps {}

export function JobsList(props: JobsListProps) {
  return (
    <div className={styles['container']}>
      <div className={styles['job']} >
        <Job
          title={'Tech lead'}
          company={'Socital'}
          period={{ from: new Date() }}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed rhoncus neque in sapien dapibus auctor.
          Etiam sodales cursus ex, in feugiat lacus tincidunt sit amet. Phasellus euismod dictum erat in.
          <List items={['item 1', 'item 2', 'item 3' ]} />
        </Job>
      </div>
      <div className={styles['job']} >
        <Job
          title={'Software Engineer'}
          company={'Socital'}
          period={{ from: new Date() }}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed rhoncus neque in sapien dapibus auctor.
          Etiam sodales cursus ex, in feugiat lacus tincidunt sit amet. Phasellus euismod dictum erat in.
          <List items={['item 1', 'item 2', 'item 3']} />
        </Job>
      </div>
    </div>
  )
}

export default JobsList
