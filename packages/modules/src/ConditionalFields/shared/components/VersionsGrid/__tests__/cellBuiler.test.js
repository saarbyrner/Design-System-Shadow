import { render, screen } from '@testing-library/react';
import moment from 'moment';

import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';

import buildCellContent from '../cellBuilder';
import { data as MOCK_RULESET } from '../../../services/mocks/data/mock_versions_list';
import { data as MOCK_NEWLY_CREATE_RULESET } from '../../../services/mocks/data/mock_newly-created_ruleset';
import { MOCK_ORGANISATION_ID } from '../../../utils/test_utils.mock';

const MOCK_VERSION = MOCK_RULESET.versions[1];
const MOCK_VERSION_WITHOUT_TITLE = MOCK_NEWLY_CREATE_RULESET.versions[0];

const payloadForCellBuilder = {
  version: MOCK_VERSION,
  versions: MOCK_RULESET.versions,
  organisationId: MOCK_ORGANISATION_ID,
  rulesetId: MOCK_RULESET.id,
};

describe('buildCellContent', () => {
  it('renders an LinkToolTipCell for a version', () => {
    render(buildCellContent({ row_key: 'name' }, payloadForCellBuilder));

    expect(
      screen.getByText(`${MOCK_VERSION.name}_v${MOCK_VERSION.version}`)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', {
        name: `${MOCK_VERSION.name}_v${MOCK_VERSION.version}`,
      })
    ).toHaveAttribute(
      'href',
      `/administration/conditional_fields/organisations/${MOCK_ORGANISATION_ID}/rulesets/${MOCK_RULESET.id}/versions/${MOCK_VERSION.version}?title=${MOCK_VERSION.name} `
    );
  });
  it('renders a LinkToolTipCell with "--" when title empty', () => {
    render(
      buildCellContent(
        { row_key: 'name' },
        {
          version: MOCK_VERSION_WITHOUT_TITLE,
          versions: MOCK_RULESET.versions,
          rulesetId: MOCK_RULESET.id,
          organisationId: MOCK_ORGANISATION_ID,
        }
      )
    );

    expect(
      screen.getByText(`--_v${MOCK_VERSION_WITHOUT_TITLE.version}`)
    ).toBeInTheDocument();
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
  it('renders the versions version', () => {
    render(buildCellContent({ row_key: 'version' }, payloadForCellBuilder));
    expect(screen.getByText(MOCK_VERSION.version)).toBeInTheDocument();
  });
  it('renders the versions published status', () => {
    render(buildCellContent({ row_key: 'status' }, payloadForCellBuilder));
    expect(screen.getByText('Active')).toBeInTheDocument();
  });
  it('renders the squad assignees of version', () => {
    render(buildCellContent({ row_key: 'squads' }, payloadForCellBuilder));

    expect(
      screen.getByText(
        'International Squad, Academy Squad, Test, Kitman Labs - Staff'
      )
    ).toBeInTheDocument();
  });
});
