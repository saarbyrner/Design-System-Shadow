import { render, screen } from '@testing-library/react';
import DateRangePicker from '../index';

describe('<DateRangePicker /> shared component', () => {
  const props = {
    turnaroundList: [
      {
        id: 1,
        name: 'PS1-Cork',
        from: '15 Dec 2017',
        to: '09 Jan 2018',
      },
      {
        id: 2,
        name: 'PS2-Australia',
        from: '09 Jan 2018',
        to: '18 Jan 2018',
      },
      {
        id: 3,
        name: 'IS1',
        from: '18 Jan 2018',
        to: '31 Jan 2018',
      },
    ],
  };

  it('renders an input with a calendar icon', () => {
    const { container } = render(<DateRangePicker {...props} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(container.getElementsByClassName('icon-calendar')).toHaveLength(1);
  });

  it('ignores the validation when ignoreValidation is true', () => {
    render(<DateRangePicker {...props} ignoreValidation />);
    expect(screen.getByRole('textbox')).toHaveAttribute(
      'data-ignore-validation',
      'true'
    );
  });

  it('adds the correct class when invalid is true', () => {
    const { container } = render(<DateRangePicker {...props} invalid />);
    expect(
      container.getElementsByClassName('input-group--invalid')
    ).toHaveLength(1);
  });

  it('renders a button when kitmanDesignSystem is true', () => {
    render(<DateRangePicker {...props} kitmanDesignSystem />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
