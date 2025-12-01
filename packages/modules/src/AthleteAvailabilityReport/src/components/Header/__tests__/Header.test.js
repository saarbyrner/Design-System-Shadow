import { render, screen } from '@testing-library/react';
import Header from '../index';

describe('Availability Report <Header /> component', () => {
  let props;

  beforeEach(() => {
    props = {
      timeRangeStart: '2019-09-30T23:00:00Z',
      timeRangeEnd: '2019-11-12T23:59:59Z',
      orgTimeZone: 'Europe/Dublin',
    };
  });

  it('renders', () => {
    const { container } = render(<Header {...props} />);
    expect(
      container.querySelector('.js-scrollableTable__header')
    ).toBeInTheDocument();
  });

  it('renders the correct number of days', () => {
    const { container } = render(<Header {...props} />);
    expect(
      container.querySelectorAll('.availabilityReportTable__headerCell').length
    ).toBe(43);
  });

  describe('when the date range starts and ends in different months', () => {
    it('renders the month name on the first day of the month', () => {
      render(<Header {...props} />);
      expect(screen.getByText(/Nov/i)).toBeInTheDocument();
    });
  });

  describe('when the date range starts and ends in different year', () => {
    beforeEach(() => {
      props.timeRangeStart = '2018-12-30T23:00:00Z';
      props.timeRangeEnd = '2019-01-12T23:59:59Z';
    });

    it('renders the year on the first day of the year', () => {
      render(<Header {...props} />);
      expect(screen.getByText(/Jan 2019/i)).toBeInTheDocument();
    });
  });
});
