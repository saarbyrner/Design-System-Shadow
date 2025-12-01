import {
  parseOrganisationIdFromLocation,
  parseRulesetIdFromLocation,
  parseVersionIdFromLocation,
} from '..';

import { MOCK_CONDITIONAL_FIELDS_URL } from '../../../utils/test_utils.mock';

describe('parseOrganisationIdFromLocation', () => {
  it('parses organisation id from url', async () => {
    const organisationId = parseOrganisationIdFromLocation(
      MOCK_CONDITIONAL_FIELDS_URL
    );

    expect(organisationId).toContain('666');
  });
});

describe('parseRulesetIdFromLocation', () => {
  it('parses ruleset id from url', async () => {
    const rulesetId = parseRulesetIdFromLocation(MOCK_CONDITIONAL_FIELDS_URL);

    expect(rulesetId).toContain('10001');
  });
});

describe('parseVersionIdFromLocation', () => {
  it('parses version id from url', async () => {
    const versionId = parseVersionIdFromLocation(MOCK_CONDITIONAL_FIELDS_URL);

    expect(versionId).toContain('2');
  });
});
