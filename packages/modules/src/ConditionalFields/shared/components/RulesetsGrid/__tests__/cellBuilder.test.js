import moment from 'moment';

import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';

import { render, screen } from '@testing-library/react';
import buildCellContent from '../cellBuilder';
import { data } from '../../../services/mocks/data/mock_rulesets_list';
import { MOCK_ORGANISATION_ID } from '../../../utils/test_utils.mock';

describe('buildCellContent', () => {
  const MOCK_RULESET = data[0];
  const MOCK_NO_NAME_RULESET = data[1];

  const MOCK_VERSION = MOCK_RULESET.versions[0];

  const payloadForCellBuilder = {
    ruleset: MOCK_RULESET,
    organisationId: MOCK_ORGANISATION_ID,
  };

  it('renders an LinkToolTipCell for a ruleset', () => {
    render(buildCellContent({ row_key: 'name' }, payloadForCellBuilder));

    expect(screen.getByText(MOCK_RULESET.name)).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: MOCK_RULESET.name })
    ).toHaveAttribute(
      'href',
      `/administration/conditional_fields/organisations/${MOCK_ORGANISATION_ID}/rulesets/${MOCK_RULESET.id}?title=${MOCK_RULESET.name} `
    );
  });

  it('renders a LinkToolTipCell with "--" when title empty', () => {
    render(
      buildCellContent(
        { row_key: 'name' },
        {
          ruleset: MOCK_NO_NAME_RULESET,
          organisationId: MOCK_ORGANISATION_ID,
        }
      )
    );
    expect(screen.getByText('--')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '--' })).toHaveAttribute(
      'href',
      `/administration/conditional_fields/organisations/${MOCK_ORGANISATION_ID}/rulesets/${MOCK_NO_NAME_RULESET.id}`
    );
  });
  it('renders the version published at date', () => {
    render(
      buildCellContent({ row_key: 'published_at' }, payloadForCellBuilder)
    );

    expect(
      screen.getByText(
        DateFormatter.formatStandard({
          date: moment(MOCK_VERSION.published_at),
        })
      )
    ).toBeInTheDocument();
  });
  it('renders the ruleset version', () => {
    render(buildCellContent({ row_key: 'version' }, payloadForCellBuilder));
    expect(screen.getByText(MOCK_VERSION.version)).toBeInTheDocument();
  });
  it('renders the published status', () => {
    render(buildCellContent({ row_key: 'status' }, payloadForCellBuilder));
    expect(screen.getByText('Active')).toBeInTheDocument();
  });
  it('renders the squad assignees of ruleset', () => {
    render(buildCellContent({ row_key: 'squads' }, payloadForCellBuilder));

    expect(
      screen.getByText(
        'International Squad, Academy Squad, Test, Kitman Labs - Staff'
      )
    ).toBeInTheDocument();
  });
});
