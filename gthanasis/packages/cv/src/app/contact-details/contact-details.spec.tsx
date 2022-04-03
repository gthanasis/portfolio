import { render } from '@testing-library/react'

import ContactDetails from './contact-details'

describe('ContactDetails', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ContactDetails />)
    expect(baseElement).toBeTruthy()
  })
})
