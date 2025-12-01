import { screen } from '@testing-library/react';

import { renderWithUserEventSetup } from '@kitman/common/src/utils/test_utils';
import DummyIssueStatusOptions from '@kitman/modules/src/AthleteInjury/utils/DummyIssueStatusOptions';
import { formatIssueStatusOptions } from '@kitman/modules/src/AthleteInjury/athleteIssueEditor/src/utils';
import IssueStatusSelect from '../../components/IssueStatusSelect';



describe('Athlete Injury Editor <IssueStatusSelect /> component', () => {
  let props;

  beforeEach(() => {
    props = {
      injuryStatusOptions: formatIssueStatusOptions(DummyIssueStatusOptions),
      injuryStatusEventId: 'id_1235',
      value: 'option_1235',
      onChange: jest.fn(),
      t: (key) => key,
    };
  });

  it('renders', () => {
    renderWithUserEventSetup(<IssueStatusSelect {...props} />);
    expect(screen.getAllByText('Fit for rehab / non-team training')[0]).toBeInTheDocument();
  });

  it('builds the correct options for the dropdown', async () => {
    const { user } = renderWithUserEventSetup(<IssueStatusSelect {...props} />);
    await user.click(screen.getAllByText('Fit for rehab / non-team training')[0]);
    expect(screen.getByText('Not fit for training or match')).toBeInTheDocument();
    expect(screen.getAllByText('Fit for rehab / non-team training')[0]).toBeInTheDocument();
    expect(screen.getByText('Fit for modified team training, but not match selection')).toBeInTheDocument();
    expect(screen.getByText('Fit for match selection, no training modifications. Recovered.')).toBeInTheDocument();
  });

  it('sets the correct data-attribute for the validation', () => {
    renderWithUserEventSetup(<IssueStatusSelect {...props} />);
    expect(screen.getByTestId('issue-status-select')).toHaveAttribute('data-injurystatuseventid', 'id_1235');
  });
});
