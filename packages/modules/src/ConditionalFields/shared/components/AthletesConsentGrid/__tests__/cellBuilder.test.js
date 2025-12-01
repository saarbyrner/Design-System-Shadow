import { render, screen } from '@testing-library/react';
import moment from 'moment';
import { formatStandard } from '@kitman/common/src/utils/dateFormatter';
import { data } from '@kitman/services/src/mocks/handlers/consent/searchAthletes.mock';
import buildCellContent from '@kitman/modules/src/ConditionalFields/shared/components/AthletesConsentGrid/Cells';
import { ROW_KEY } from '@kitman/modules/src/ConditionalFields/shared/types';
import { CONSENT_STATUS } from '@kitman/common/src/types/Consent';

const firstAthlete = data.data[0];

describe('buildCellContent', () => {
  it('renders the athlete', () => {
    render(
      buildCellContent({ rowKey: ROW_KEY.athlete, athlete: firstAthlete })
    );
    expect(screen.getByText(firstAthlete.fullname)).toBeInTheDocument();
  });
  it('renders the squads', () => {
    render(buildCellContent({ rowKey: ROW_KEY.squads, athlete: firstAthlete }));
    expect(
      screen.getByText(
        firstAthlete.athlete_squads.map((squad) => squad.name).join(', ')
      )
    ).toBeInTheDocument();
  });
  it('renders the consent', () => {
    render(
      buildCellContent({ rowKey: ROW_KEY.consent, athlete: firstAthlete })
    );
    expect(screen.getByText(firstAthlete.consent_status)).toBeInTheDocument();
  });
  it('renders the consent date', () => {
    render(
      buildCellContent({ rowKey: ROW_KEY.consent_date, athlete: firstAthlete })
    );
    expect(
      screen.getByText(
        `${formatStandard({
          date: moment(firstAthlete.most_recent_consent?.start_date),
        })} - ${formatStandard({
          date: moment(firstAthlete.most_recent_consent?.end_date),
        })}`
      )
    ).toBeInTheDocument();
  });
  it('renders the start date and archived on date if athlete has the consent revoked', () => {
    const revokedAthlete = {
      ...firstAthlete,
      consent_status: CONSENT_STATUS.NoConsent,
      most_recent_consent: {
        start_date: '2024-01-01T00:00:00Z',
        archived_on: '2024-01-05T00:00:00Z',
      },
    };

    render(
      buildCellContent({
        rowKey: ROW_KEY.consent_date,
        athlete: revokedAthlete,
      })
    );
    expect(screen.getByText('Jan 1, 2024 - Jan 5, 2024')).toBeInTheDocument();
  });
});
