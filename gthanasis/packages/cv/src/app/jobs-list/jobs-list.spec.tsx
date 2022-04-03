import { render } from '@testing-library/react';

import JobsList from './jobs-list';

describe('JobsList', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<JobsList />);
    expect(baseElement).toBeTruthy();
  });
});
