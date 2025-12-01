import { screen, render } from '@testing-library/react';

import Value from '../index';

describe('TemplateDashboards|<Value/>', () => {
  it('renders a value when given a value', () => {
    render(<Value value={123} />);

    const value = screen.queryByText('123');
    const style = window.getComputedStyle(value);

    expect(value).toBeVisible();
    expect(style.fontSize).toBe('60px');
    expect(style.lineHeight).toBe('60px');
  });
});
