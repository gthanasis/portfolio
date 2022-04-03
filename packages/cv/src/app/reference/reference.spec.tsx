import { render } from '@testing-library/react'

import Reference from './reference'

describe('Reference', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Reference />)
    expect(baseElement).toBeTruthy()
  })
})
