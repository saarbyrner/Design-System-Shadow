import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AthleteListItem from '../index';
import * as utils from '../../utils';

jest.mock('@kitman/common/src/utils/i18n', () => ({
  t: jest.fn((key) => key),
}));

jest.mock('../../utils', () => ({
  chipColorFor: jest.fn(() => 'primary'),
  getInitial: jest.fn((name) => name.charAt(0)),
}));

describe('<AthleteListItem />', () => {
  const mockAthlete = {
    id: 1,
    key: 'ath-1',
    name: 'Alice',
    position: 'Forward',
    avatarUrl: '',
    status: 'Active',
  };

  const handleToggleAthlete = jest.fn();

  const defaultProps = {
    athlete: mockAthlete,
    selectedIds: new Set(),
    handleToggleAthlete,
    size: 'md',
  };

  const renderComponent = (props = {}) =>
    render(<AthleteListItem {...defaultProps} {...props} />);

  it('renders the athlete name and position', () => {
    renderComponent();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Forward')).toBeInTheDocument();
  });

  it('renders a checkbox that is unchecked when athlete is not selected', () => {
    renderComponent();
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('renders a checkbox that is checked when athlete is selected', () => {
    renderComponent({ selectedIds: new Set([1]) });
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('calls handleToggleAthlete when clicking the list item', async () => {
    const user = userEvent.setup();
    renderComponent();
    const listItem = screen.getByText('Alice').closest('li');
    if (!listItem) throw new Error('ListItem not found');
    await user.click(listItem);
    expect(handleToggleAthlete).toHaveBeenCalledWith(1);
  });

  it('renders avatar with initial when avatarUrl is empty', () => {
    renderComponent();
    const avatar = screen.getByText('A');
    expect(avatar).toBeInTheDocument();
    expect(utils.getInitial).toHaveBeenCalledWith('Alice');
  });

  it('renders avatar with src when avatarUrl is provided', () => {
    renderComponent({ athlete: { ...mockAthlete, avatarUrl: 'url.jpg' } });
    const avatar = screen.getByRole('img');
    expect(avatar).toHaveAttribute('src', 'url.jpg');
  });

  it('renders status chip when athlete has status', () => {
    renderComponent();
    const chip = screen.getByText('Active');
    expect(chip).toBeInTheDocument();
    expect(utils.chipColorFor).toHaveBeenCalledWith('Active');
  });

  it('does not render status chip when athlete has no status', () => {
    renderComponent({ athlete: { ...mockAthlete, status: '' } });
    const chip = screen.queryByText('Active');
    expect(chip).not.toBeInTheDocument();
  });
});
