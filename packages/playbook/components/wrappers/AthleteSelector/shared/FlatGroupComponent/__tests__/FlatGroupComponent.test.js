import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18n from '@kitman/common/src/utils/i18n';
import FlatGroupComponent from '../index';
import { collectAthleteIds } from '../../utils';

jest.mock('../../utils', () => ({
  collectAthleteIds: jest.fn(),
}));

describe('<FlatGroupComponent />', () => {
  const mockGroup = {
    key: 'group-1',
    title: 'Group 1',
    subtitle: 'Sub 1',
    athletes: [{ id: 1 }, { id: 2 }],
    children: [],
  };

  let selectedIds;
  let setSelectedIds;
  let setPath;

  beforeEach(() => {
    selectedIds = new Set();
    setSelectedIds = jest.fn((updater) => {
      selectedIds = updater(selectedIds);
    });
    setPath = jest.fn();
    collectAthleteIds.mockReturnValue([1, 2]);
  });

  const renderComponent = () =>
    render(
      <FlatGroupComponent
        group={mockGroup}
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
        setPath={setPath}
      />
    );

  it('renders group title and subtitle', () => {
    renderComponent();
    expect(screen.getByText('Group 1')).toBeInTheDocument();
    expect(screen.getByText('Sub 1')).toBeInTheDocument();
  });

  it('renders "Select all" button when not all athletes are selected', () => {
    renderComponent();
    expect(screen.getByText(i18n.t('Select all'))).toBeInTheDocument();
  });

  it('renders "Clear all" button when all athletes are selected', () => {
    selectedIds = new Set([1, 2]);
    renderComponent();
    expect(screen.getByText(i18n.t('Clear all'))).toBeInTheDocument();
  });

  it('selects all athletes when clicking "Select all"', async () => {
    const user = userEvent.setup();
    renderComponent();
    const button = screen.getByText(i18n.t('Select all'));
    await user.click(button);
    expect(selectedIds.has(1)).toBe(true);
    expect(selectedIds.has(2)).toBe(true);
  });

  it('clears all athletes when clicking "Clear all"', async () => {
    const user = userEvent.setup();
    selectedIds = new Set([1, 2]);
    renderComponent();
    const button = screen.getByText(i18n.t('Clear all'));
    await user.click(button);
    expect(selectedIds.size).toBe(0);
  });

  it('calls setPath with the group when clicking on group container', async () => {
    const user = userEvent.setup();
    renderComponent();
    const container = screen.getByText('Group 1').closest('div');
    if (!container) throw new Error('Group container not found');
    await user.click(container);
    expect(setPath).toHaveBeenCalledWith(expect.any(Function));
  });
});
