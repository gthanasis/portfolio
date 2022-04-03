import { render } from '@testing-library/react';

import Signature from './signature';

describe('Signature', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Signature />);
    expect(baseElement).toBeTruthy();
  });
});
