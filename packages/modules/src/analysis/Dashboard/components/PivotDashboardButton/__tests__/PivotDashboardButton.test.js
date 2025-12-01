import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import PivotDashboardButton from '..';

describe('<PivotDashboardButton />', () => {
  const defaultProps = {
    athletesText: null,
    onClick: jest.fn(),
    datesText: null,
    defaultText: 'Pivot Dashboard',
    isDisabled: false,
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders', () => {
    render(<PivotDashboardButton {...defaultProps} />);
    expect(
      screen.getByRole('button', { value: 'Pivot Dashboard' })
    ).toBeInTheDocument();
  });

  it('calls the onClick function when clicked', async () => {
    const user = userEvent.setup();
    render(<PivotDashboardButton {...defaultProps} />);

    await user.click(screen.getByRole('button', { value: 'Pivot Dashboard' }));

    expect(defaultProps.onClick).toHaveBeenCalled();
  });

  it('disables button if isDisabled is true', () => {
    render(<PivotDashboardButton {...defaultProps} isDisabled />);
    expect(
      screen.getByRole('button', { value: 'Pivot Dashboard' })
    ).toBeDisabled();
  });

  it('displays the correct defaultText', () => {
    render(<PivotDashboardButton {...defaultProps} />);
    expect(screen.getByRole('button')).toHaveTextContent('Pivot Dashboard');
  });

  describe('when a date is selected', () => {
    beforeEach(() => {
      render(
        <PivotDashboardButton {...defaultProps} datesText="This Season" />
      );
    });

    it('renders the PivotDashboardButton component with the correct text', () => {
      expect(screen.getByText('This Season')).toBeInTheDocument();
    });
  });

  describe('when an athlete is selected', () => {
    it('renders the PivotDashboardButton component with the correct text', () => {
      render(
        <PivotDashboardButton {...defaultProps} athletesText="Robbie Brady" />
      );

      expect(
        screen.getByRole('button', { value: 'Robbie Brady' })
      ).toBeInTheDocument();
    });
  });

  describe('when multiple athletes are selected', () => {
    it('renders the PivotDashboardButton component with the correct text', () => {
      render(
        <PivotDashboardButton
          {...defaultProps}
          athletesText="Robbie Brady, Seamus Coleman, Darren Randolph"
        />
      );
      expect(screen.getByText('3')).toBeInTheDocument();
    });
  });

  describe('when an athlete and a date is selected', () => {
    const defaultPropsWithDateAndAthlete = {
      ...defaultProps,
      datesText: 'This Season',
      athletesText: 'Robbie Keane',
    };

    it('renders the calendar icon', () => {
      render(<PivotDashboardButton {...defaultPropsWithDateAndAthlete} />);

      expect(
        screen
          .getByRole('button')
          .querySelector('.pivotDashboardButton__datesIcon')
      ).toBeInTheDocument();
    });

    it('renders the PivotDashboardButton component with the correct text', () => {
      render(<PivotDashboardButton {...defaultPropsWithDateAndAthlete} />);

      expect(screen.getByText('This Season')).toBeInTheDocument();
    });

    it('renders a divider line', () => {
      render(<PivotDashboardButton {...defaultPropsWithDateAndAthlete} />);

      expect(
        screen
          .getByRole('button')
          .querySelector('.pivotDashboardButton__dividerLine')
      ).toBeInTheDocument();
    });

    it('renders the PivotDashboardButton component with the correct athlete text', () => {
      render(<PivotDashboardButton {...defaultPropsWithDateAndAthlete} />);
      expect(screen.getByText('Robbie Keane')).toBeInTheDocument();
    });
  });
});
