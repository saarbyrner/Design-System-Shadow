import { screen, fireEvent } from '@testing-library/react';

import useDebouncedCallback from '@kitman/common/src/hooks/useDebouncedCallback';
import { renderWithUserEventSetup as render } from '@kitman/common/src/utils/test_utils';

import { AthletesAndStaffSelectorMUI } from '../AthletesAndStaffSelectorMUI';

jest.mock('@kitman/common/src/hooks/useDebouncedCallback');

const mockSquads = [
  {
    id: 1,
    name: 'Squad A',
    position_groups: [
      {
        id: 10,
        name: 'Goalkeepers',
        positions: [
          {
            id: 100,
            name: 'Goalkeeper',
            athletes: [
              { id: 1000, fullname: 'Alice Keeper' },
              { id: 1001, fullname: 'Bob Keeper' },
            ],
          },
        ],
      },
      {
        id: 11,
        name: 'Defenders',
        positions: [
          {
            id: 110,
            name: 'Defender',
            athletes: [{ id: 1100, fullname: 'Charlie Defender' }],
          },
        ],
      },
    ],
  },
  {
    id: 2,
    name: 'Squad B',
    position_groups: [
      {
        id: 20,
        name: 'Strikers',
        positions: [
          {
            id: 200,
            name: 'Striker',
            athletes: [{ id: 2000, fullname: 'David Striker' }],
          },
        ],
      },
    ],
  },
];

const mockT = (key) => key;

describe('AthletesAndStaffSelectorMUI', () => {
  const defaultProps = {
    t: mockT,
    isOpen: true,
    squads: mockSquads,
    onCancel: jest.fn(),
    onConfirm: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    useDebouncedCallback.mockImplementation((fn) => fn);
  });

  it('renders the side panel when `isOpen` is `true`', () => {
    render(<AthletesAndStaffSelectorMUI {...defaultProps} />);

    expect(screen.getByText('Select athletes')).toBeInTheDocument();
  });

  it('doesn’t render the side panel when `isOpen` is `false`', () => {
    render(<AthletesAndStaffSelectorMUI {...defaultProps} isOpen={false} />);

    expect(screen.queryByText('Select athletes')).not.toBeInTheDocument();
  });

  it('renders the spinner when `isLoading` is `true`', () => {
    render(<AthletesAndStaffSelectorMUI {...defaultProps} isLoading />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders the error state when `isError` is `true`', () => {
    render(<AthletesAndStaffSelectorMUI {...defaultProps} isError />);

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  it('calls `onCancel` when clicking the close button', async () => {
    const { user } = render(<AthletesAndStaffSelectorMUI {...defaultProps} />);

    const closeButton = screen.getByTestId('CloseIcon');
    await user.click(closeButton);

    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });

  it('calls `onCancel` when clicking the cancel button', async () => {
    const { user } = render(<AthletesAndStaffSelectorMUI {...defaultProps} />);

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });

  it('calls `onConfirm` with the correct datsa after selecting an athlete and clicking the confirm button', async () => {
    const { user } = render(<AthletesAndStaffSelectorMUI {...defaultProps} />);

    const aliceCheckbox = screen.getByLabelText('Alice Keeper');
    await user.click(aliceCheckbox);

    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    await user.click(confirmButton);

    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);

    const [selected] = defaultProps.onConfirm.mock.calls[0];
    expect(selected).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 1000, fullname: 'Alice Keeper' }),
      ])
    );
  });

  it('disables the confirm button if no athletes are selected and `isEmptySelectionAllowed` is false', () => {
    render(
      <AthletesAndStaffSelectorMUI
        {...defaultProps}
        isEmptySelectionAllowed={false}
      />
    );

    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    expect(confirmButton).toBeDisabled();
  });

  it('doesn’t disable the confirm button if no athletes are selected and `isEmptySelectionAllowed` is true', () => {
    render(
      <AthletesAndStaffSelectorMUI {...defaultProps} isEmptySelectionAllowed />
    );

    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    expect(confirmButton).toBeEnabled();
  });

  it('filters the athletes by fullname when searching', () => {
    render(<AthletesAndStaffSelectorMUI {...defaultProps} />);

    expect(screen.getByLabelText('Alice Keeper')).toBeInTheDocument();
    expect(screen.getByLabelText('Bob Keeper')).toBeInTheDocument();
    expect(screen.getByLabelText('Charlie Defender')).toBeInTheDocument();
    expect(screen.getByLabelText('David Striker')).toBeInTheDocument();

    const searchBox = screen.getByRole('textbox', { name: /search/i });
    fireEvent.change(searchBox, { target: { value: 'Alice' } });

    expect(screen.getByLabelText('Alice Keeper')).toBeInTheDocument();
    expect(screen.queryByLabelText('Bob Keeper')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Charlie Defender')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('David Striker')).not.toBeInTheDocument();
  });

  it('selects a squad correctly', async () => {
    const { user } = render(<AthletesAndStaffSelectorMUI {...defaultProps} />);

    const squadAHeader = screen.getByText('Squad A');
    await user.click(squadAHeader);

    const squadACheckbox = screen.getByLabelText(/squad a \(group\)/i);
    await user.click(squadACheckbox);

    expect(screen.getByLabelText('Alice Keeper')).toBeChecked();
    expect(screen.getByLabelText('Bob Keeper')).toBeChecked();
    expect(screen.getByLabelText('Charlie Defender')).toBeChecked();
  });

  it('selects a group correctly', async () => {
    const { user } = render(<AthletesAndStaffSelectorMUI {...defaultProps} />);

    await user.click(screen.getByText('Squad A'));

    const selectAllButton = screen.getAllByRole('button', {
      name: /select all/i,
    })[0];
    await user.click(selectAllButton);

    expect(screen.getByLabelText('Alice Keeper')).toBeChecked();
    expect(screen.getByLabelText('Bob Keeper')).toBeChecked();
    expect(screen.getByLabelText('Charlie Defender')).not.toBeChecked();
  });

  it('pre-selects the athletes from `initialSelection`', () => {
    render(
      <AthletesAndStaffSelectorMUI
        {...defaultProps}
        initialSelection={[1001, 2000]}
      />
    );

    expect(screen.getByLabelText('Bob Keeper')).toBeChecked();
    expect(screen.getByLabelText('David Striker')).toBeChecked();

    expect(screen.getByLabelText('Alice Keeper')).not.toBeChecked();
    expect(screen.getByLabelText('Charlie Defender')).not.toBeChecked();
  });

  it('retains the selected athletes when searching for other athletes', async () => {
    const { user } = render(<AthletesAndStaffSelectorMUI {...defaultProps} />);

    await user.click(screen.getByLabelText('Bob Keeper'));
    expect(screen.getByLabelText('Bob Keeper')).toBeChecked();

    const searchBox = screen.getByRole('textbox', { name: /search/i });
    fireEvent.change(searchBox, { target: { value: 'David' } });

    expect(screen.queryByLabelText('Bob Keeper')).not.toBeInTheDocument();
    await user.clear(searchBox);

    expect(screen.getByLabelText('Bob Keeper')).toBeChecked();
  });

  it('calls `onCancel` if user clicks outside the side panel’s ClickAwayListener', async () => {
    const { user } = render(<AthletesAndStaffSelectorMUI {...defaultProps} />);

    await user.click(document.body);

    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });

  it('calls `onConfirm` with an empty array when `isEmptySelectionAllowed` is true and nothing is selected', async () => {
    const { user } = render(
      <AthletesAndStaffSelectorMUI {...defaultProps} isEmptySelectionAllowed />
    );

    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    await user.click(confirmButton);

    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);

    const [selected] = defaultProps.onConfirm.mock.calls[0];
    expect(selected).toEqual([]);
  });

  it('clears a group selection correctly when clicking the clear button', async () => {
    const { user } = render(<AthletesAndStaffSelectorMUI {...defaultProps} />);

    await user.click(screen.getByText('Squad A'));

    const selectAllButton = screen.getAllByRole('button', {
      name: /select all/i,
    })[0];
    await user.click(selectAllButton);

    expect(screen.getByLabelText('Alice Keeper')).toBeChecked();
    expect(screen.getByLabelText('Bob Keeper')).toBeChecked();

    const clearButton = screen.getAllByRole('button', {
      name: /clear/i,
    })[0];
    await user.click(clearButton);

    expect(screen.getByLabelText('Alice Keeper')).not.toBeChecked();
    expect(screen.getByLabelText('Bob Keeper')).not.toBeChecked();
  });

  it('renders custom `title`, `cancelLabel`, and `confirmLabel` when provided', () => {
    render(
      <AthletesAndStaffSelectorMUI
        {...defaultProps}
        title="Custom Title"
        cancelLabel="Custom Cancel"
        confirmLabel="Custom Confirm"
      />
    );

    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /custom cancel/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /custom confirm/i })
    ).toBeInTheDocument();
  });

  it('deselects a selected athlete', async () => {
    const { user } = render(
      <AthletesAndStaffSelectorMUI {...defaultProps} isEmptySelectionAllowed />
    );

    const aliceCheckbox = screen.getByLabelText('Alice Keeper');
    await user.click(aliceCheckbox);
    expect(aliceCheckbox).toBeChecked();

    await user.click(aliceCheckbox);
    expect(aliceCheckbox).not.toBeChecked();

    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    await user.click(confirmButton);

    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
    const [selected] = defaultProps.onConfirm.mock.calls[0];
    expect(selected).toEqual([]);
  });

  it('searches but still returns the full selection on confirm', async () => {
    const { user } = render(<AthletesAndStaffSelectorMUI {...defaultProps} />);

    const charlieCheckbox = screen.getByLabelText('Charlie Defender');
    await user.click(charlieCheckbox);
    expect(charlieCheckbox).toBeChecked();

    const searchBox = screen.getByRole('textbox', { name: /search/i });
    fireEvent.change(searchBox, { target: { value: 'David' } });

    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    await user.click(confirmButton);

    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
    const [selected] = defaultProps.onConfirm.mock.calls[0];
    expect(selected).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 1100, fullname: 'Charlie Defender' }),
      ])
    );
  });

  it('marks a squad as not fully selected if only some of its athletes are selected', async () => {
    const { user } = render(<AthletesAndStaffSelectorMUI {...defaultProps} />);

    await user.click(screen.getByText('Squad A'));

    await user.click(screen.getByLabelText('Alice Keeper'));

    const squadACheckbox = screen.getByLabelText(/squad a \(group\)/i);
    expect(squadACheckbox).not.toBeChecked();

    expect(screen.getByLabelText('Alice Keeper')).toBeChecked();
    expect(screen.getByLabelText('Bob Keeper')).not.toBeChecked();
    expect(screen.getByLabelText('Charlie Defender')).not.toBeChecked();
  });

  it('doesn’t fail if `initialSelection` contains an invalid athlete ID', () => {
    render(
      <AthletesAndStaffSelectorMUI
        {...defaultProps}
        initialSelection={[9999]} // Non-existent athlete
      />
    );

    expect(screen.getByText('Select athletes')).toBeInTheDocument();
  });

  it('toggles an athlete multiple times without error', async () => {
    const { user } = render(<AthletesAndStaffSelectorMUI {...defaultProps} />);

    const bobCheckbox = screen.getByLabelText('Bob Keeper');

    await user.click(bobCheckbox);
    expect(bobCheckbox).toBeChecked();

    await user.click(bobCheckbox);
    expect(bobCheckbox).not.toBeChecked();

    await user.click(bobCheckbox);
    expect(bobCheckbox).toBeChecked();

    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    await user.click(confirmButton);

    const [selected] = defaultProps.onConfirm.mock.calls[0];
    expect(selected).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 1001, fullname: 'Bob Keeper' }),
      ])
    );
  });
});
