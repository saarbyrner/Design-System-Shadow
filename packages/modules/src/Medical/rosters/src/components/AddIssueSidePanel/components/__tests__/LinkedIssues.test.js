import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import selectEvent from 'react-select-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import LinkedIssues from '../LinkedIssues';

const mockedIssues = {
  open_issues: [
    { id: 1, issue_occurrence_title: 'Test Injury', issue_type: 'Injury' },
    {
      id: 123,
      issue_occurrence_title: 'Test Open Illness',
      issue_type: 'Illness',
    },
  ],
  closed_issues: [
    {
      id: 12,
      issue_occurrence_title: 'Test Closed Illness',
      issue_type: 'Illness',
    },
  ],
};

describe('<LinkedIssues />', () => {
  const defaultProps = {
    t: i18nextTranslateStub(),
    allIssues: { open_issues: [], closed_issues: [] },
    isLoadingIssues: false,
    selectedLinkedIssues: {
      injuries: [],
      illnesses: [],
    },
    onSelectLinkedIllness: jest.fn(),
    onSelectLinkedInjury: jest.fn(),
    onRemove: jest.fn(),
  };

  beforeEach(() => {
    // Clear mocks before each test to prevent calls from leaking between tests
    jest.clearAllMocks();
  });

  it('renders a Select component with grouped open and closed issues', async () => {
    render(<LinkedIssues {...defaultProps} allIssues={mockedIssues} />);

    const selectInput = screen.getByRole('textbox');
    await selectEvent.openMenu(selectInput);

    expect(await screen.findByText('Open Issues')).toBeInTheDocument();
    expect(await screen.findByText('Test Injury')).toBeInTheDocument();
  });

  it('calls the correct callbacks when selecting multiple issues', async () => {
    const user = userEvent.setup();
    const onSelectLinkedIllness = jest.fn();
    const onSelectLinkedInjury = jest.fn();
    render(
      <LinkedIssues
        {...defaultProps}
        allIssues={mockedIssues}
        onSelectLinkedIllness={onSelectLinkedIllness}
        onSelectLinkedInjury={onSelectLinkedInjury}
      />
    );

    const selectInput = screen.getByRole('textbox');

    // Select the items one by one
    await selectEvent.openMenu(selectInput);
    await user.click(await screen.findByText('Test Injury'));
    await selectEvent.openMenu(selectInput);
    await user.click(await screen.findByText('Test Open Illness'));
    await selectEvent.openMenu(selectInput);
    await user.click(await screen.findByText('Test Closed Illness'));

    // Assert that the injury callback was called WITH [1] at some point during the process.
    expect(onSelectLinkedInjury).toHaveBeenCalledWith([1]);

    // Assert that the illness callback's LAST call contained the final, complete array.
    expect(onSelectLinkedIllness).toHaveBeenCalledWith([123]);
    expect(onSelectLinkedIllness).toHaveBeenCalledWith([12]);
  });

  it('triggers onRemove and clears selections when the remove button is clicked', async () => {
    const user = userEvent.setup();
    const onSelectLinkedIllness = jest.fn();
    const onSelectLinkedInjury = jest.fn();
    const onRemove = jest.fn();
    render(
      <LinkedIssues
        {...defaultProps}
        onSelectLinkedIllness={onSelectLinkedIllness}
        onSelectLinkedInjury={onSelectLinkedInjury}
        onRemove={onRemove}
      />
    );

    const removeButton = screen.getByRole('button');
    await user.click(removeButton);

    expect(onRemove).toHaveBeenCalledTimes(1);
    expect(onSelectLinkedInjury).toHaveBeenCalledWith([]);
    expect(onSelectLinkedIllness).toHaveBeenCalledWith([]);
  });

  it('renders correctly when no issues are provided', () => {
    render(<LinkedIssues {...defaultProps} />);
    expect(
      screen.getByRole('heading', { name: /attach associated issue/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });
});
