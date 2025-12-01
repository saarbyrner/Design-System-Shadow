import { render, screen } from '@testing-library/react';
import { dmrEventStatusProgress } from '@kitman/modules/src/PlanningEvent/src/hooks/useUpdateDmrStatus';
import MatchDayStatusInfo from '../index';

describe('MatchDayStatusInfo', () => {
  it('renders both status circles out', () => {
    render(
      <MatchDayStatusInfo
        homeStatus={dmrEventStatusProgress.complete}
        awayStatus={dmrEventStatusProgress.partial}
      />
    );
    expect(screen.getByTestId('CheckCircleOutlineIcon')).toBeInTheDocument();
    expect(screen.getByTestId('ContrastOutlinedIcon')).toBeInTheDocument();
  });

  it('only renders one status circle', () => {
    render(<MatchDayStatusInfo homeStatus="" />);
    expect(
      screen.getByTestId('RadioButtonUncheckedRoundedIcon')
    ).toBeInTheDocument();
  });

  it('renders the lock icon when skipAutomaticGameTeamEmail is true', () => {
    render(<MatchDayStatusInfo skipAutomaticGameTeamEmail />);
    expect(screen.getByTestId('MailLockIcon')).toBeInTheDocument();
  });

  it('does not render the lock icon when skipAutomaticGameTeamEmail is false', () => {
    render(<MatchDayStatusInfo skipAutomaticGameTeamEmail={false} />);
    expect(screen.queryByTestId('MailLockIcon')).not.toBeInTheDocument();
  });
});
