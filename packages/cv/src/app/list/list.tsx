import styles from './list.module.scss'

/* eslint-disable-next-line */
export interface ListProps {
  items: string[]
}

export function List(props: ListProps) {
  const { items } = props
  return (
    <ul className={styles['container']}>
      { items.map(item => <li className={styles['item']}><span>{item}</span></li>) }
    </ul>
  )
}

export default List
