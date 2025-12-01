import { render } from '@testing-library/react';
import { displayValidationMessages } from '../utils';

describe('PlanningEventSidePanel validation utils', () => {
  it('returns a layout of validation messages', () => {
    const results = displayValidationMessages(['message01', 'message02']);
    const { container } = render(results);

    const messages = container.querySelectorAll('div');
    expect(messages).toHaveLength(2);

    expect(messages[0]).toHaveTextContent('message01');
    expect(messages[1]).toHaveTextContent('message02');
  });
});
