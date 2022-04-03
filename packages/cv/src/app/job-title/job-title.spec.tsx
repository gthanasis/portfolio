import { render } from '@testing-library/react'

import JobTitle from './job-title'

describe('JobTitle', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<JobTitle title={'Hey'} company={'you'} />)
    expect(baseElement).toBeTruthy()
  })
})
