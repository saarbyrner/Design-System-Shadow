import moment from 'moment-timezone';
import { renderHook } from '@testing-library/react-hooks';
import { rest } from 'msw';

import { server } from '@kitman/services/src/mocks/server';
import { data } from '@kitman/services/src/mocks/handlers/medical/getAthleteIssues';

import useEnrichedAthletesIssues from '../useEnrichedAthletesIssues';
import { filterEnrichedIssueConcussions } from '../../utils';

const nonGroupedIssues = {
  issues: [
    {
      id: 1,
      issue: { id: 1 },
      issue_type: 'Injury',
      full_pathology: 'Ankle Fracture (Left)',
      issue_occurrence_title: null,
      occurrence_date: '2020-11-11T00:00:00.000Z',
      closed: false,
    },
    {
      id: 2,
      issue: { id: 2 },
      issue_type: 'Illness',
      full_pathology: 'Asthma and/or allergy',
      issue_occurrence_title: null,
      occurrence_date: '2020-08-06T00:00:00.000Z',
      closed: false,
    },
    {
      id: 1,
      issue: { id: 1 },
      issue_type: 'Injury',
      full_pathology: 'Fracture tibia and fibula at ankle joint - [Left]',
      issue_occurrence_title: null,
      occurrence_date: '2020-10-27T00:00:00.000Z',
      closed: true,
    },
    {
      id: 2,
      issue: { id: 2 },
      issue_type: 'Injury',
      full_pathology: 'Ankle Fracture (Left)',
      issue_occurrence_title: null,
      occurrence_date: '2020-09-13T00:00:00.000Z',
      closed: true,
    },
  ],
};

describe('useEnrichedAthletesIssues', () => {
  beforeEach(() => {
    moment.tz.setDefault('UTC');
    server.use(
      rest.get('/ui/medical/athletes/1/issue_occurrences', (req, res, ctx) => {
        const grouped = req.url.searchParams.get('grouped');
        const includeIssue = req.url.searchParams.get('include_issue');
        const detailed = req.url.searchParams.get('detailed');

        if (
          grouped === 'true' &&
          includeIssue === 'true' &&
          detailed !== 'true'
        ) {
          return res(ctx.json(data.groupedEnrichedIssues));
        }
        if (
          grouped === 'true' &&
          includeIssue === 'true' &&
          detailed === 'true'
        ) {
          return res(ctx.json(data.groupedDetailedEnrichedIssues));
        }
        if (grouped === 'true' && includeIssue === 'false') {
          return res(
            ctx.json({ open_issues: [], closed_issues: [], chronic_issues: [] })
          );
        }
        if (grouped === 'false' && includeIssue === 'true') {
          return res(ctx.json(nonGroupedIssues));
        }
        return res(ctx.json({}));
      })
    );
  });

  afterEach(() => {
    moment.tz.setDefault();
  });

  it('returns the expected data when mounting the hook', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useEnrichedAthletesIssues({ athleteId: 1 })
    );
    await waitForNextUpdate();

    const [openIssues, closedIssues] = result.current.enrichedAthleteIssues;
    expect(openIssues.label).toBe('Open injury/ illness');
    expect(openIssues.options).toEqual([
      { value: 'Injury_1', label: 'Nov 11, 2020 - Ankle Fracture (Left)' },
      { value: 'Illness_2', label: 'Aug 6, 2020 - Asthma and/or allergy' },
      {
        value: 'Injury_3',
        label:
          'May 23, 2020 - Fracture tibia and fibula at ankle joint - [Right]',
      },
      { value: 'Injury_4', label: 'May 23, 2020 - Preliminary' },
      { label: 'May 23, 2020 - Acute Concussion [N/A]', value: 'Injury_5' },
    ]);
    expect(closedIssues.label).toBe('Prior injury/illness');
    expect(closedIssues.options).toEqual([
      {
        value: 'Injury_1',
        label:
          'Oct 27, 2020 - Fracture tibia and fibula at ankle joint - [Left]',
      },
      { value: 'Injury_2', label: 'Sep 13, 2020 - Ankle Fracture (Left)' },
      { value: 'Illness_3', label: 'Feb 4, 2020 - Emotional stress' },
    ]);
  });

  it('returns the expected data when fetching athlete issues', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useEnrichedAthletesIssues({})
    );
    result.current.fetchAthleteIssues({ selectedAthleteId: 1 });
    await waitForNextUpdate();

    const [openIssues, closedIssues] = result.current.enrichedAthleteIssues;
    expect(openIssues.label).toBe('Open injury/ illness');
    expect(openIssues.options).toEqual([
      { value: 'Injury_1', label: 'Nov 11, 2020 - Ankle Fracture (Left)' },
      { value: 'Illness_2', label: 'Aug 6, 2020 - Asthma and/or allergy' },
      {
        value: 'Injury_3',
        label:
          'May 23, 2020 - Fracture tibia and fibula at ankle joint - [Right]',
      },
      { value: 'Injury_4', label: 'May 23, 2020 - Preliminary' },
      { label: 'May 23, 2020 - Acute Concussion [N/A]', value: 'Injury_5' },
    ]);
    expect(closedIssues.label).toBe('Prior injury/illness');
    expect(closedIssues.options).toEqual([
      {
        value: 'Injury_1',
        label:
          'Oct 27, 2020 - Fracture tibia and fibula at ankle joint - [Left]',
      },
      { value: 'Injury_2', label: 'Sep 13, 2020 - Ankle Fracture (Left)' },
      { value: 'Illness_3', label: 'Feb 4, 2020 - Emotional stress' },
    ]);
  });

  describe('when useOccurrenceId and detailed is true', () => {
    beforeEach(() => {
      window.featureFlags = {
        'emr-multiple-coding-systems': true,
      };
    });

    afterEach(() => {
      window.featureFlags = {
        'emr-multiple-coding-systems': false,
      };
    });

    it('returns the expected data when mounting the hook', async () => {
      const { result, waitForNextUpdate } = renderHook(() =>
        useEnrichedAthletesIssues({
          athleteId: 1,
          useOccurrenceId: true,
          detailedIssue: true,
        })
      );
      await waitForNextUpdate();

      const [openIssues, closedIssues] = result.current.enrichedAthleteIssues;
      expect(openIssues.label).toBe('Open injury/ illness');
      expect(openIssues.options).toEqual([
        { value: 'Injury_1', label: 'Nov 11, 2020 - Ankle Fracture (Left)' },
        { value: 'Illness_2', label: 'Aug 6, 2020 - Asthma and/or allergy' },
        {
          value: 'Injury_3',
          label:
            'May 23, 2020 - Fracture tibia and fibula at ankle joint - [Right]',
        },
        { value: 'Injury_11', label: 'May 23, 2020 - Preliminary' },
        { label: 'May 23, 2020 - Acute Concussion [N/A]', value: 'Injury_400' },
      ]);
      expect(closedIssues.label).toBe('Prior injury/illness');
      expect(closedIssues.options).toEqual([
        {
          value: 'Injury_1',
          label:
            'Oct 27, 2020 - Fracture tibia and fibula at ankle joint - [Left]',
        },
        { value: 'Injury_2', label: 'Sep 13, 2020 - Ankle Fracture (Left)' },
        { value: 'Illness_3', label: 'Feb 4, 2020 - Emotional stress' },
      ]);
    });

    it('returns the expected data when fetching athlete issues', async () => {
      const { result, waitForNextUpdate } = renderHook(() =>
        useEnrichedAthletesIssues({
          athleteId: null,
          useOccurrenceId: true,
          detailedIssue: true,
        })
      );
      result.current.fetchAthleteIssues({
        selectedAthleteId: 1,
        useOccurrenceIdValue: true,
        includeDetailedIssue: true,
      });
      await waitForNextUpdate();

      const [openIssues, closedIssues] = result.current.enrichedAthleteIssues;
      expect(openIssues.label).toBe('Open injury/ illness');
      expect(openIssues.options).toEqual([
        { value: 'Injury_1', label: 'Nov 11, 2020 - Ankle Fracture (Left)' },
        { value: 'Illness_2', label: 'Aug 6, 2020 - Asthma and/or allergy' },
        {
          value: 'Injury_3',
          label:
            'May 23, 2020 - Fracture tibia and fibula at ankle joint - [Right]',
        },
        { value: 'Injury_11', label: 'May 23, 2020 - Preliminary' },
        { label: 'May 23, 2020 - Acute Concussion [N/A]', value: 'Injury_400' },
      ]);
      expect(closedIssues.label).toBe('Prior injury/illness');
      expect(closedIssues.options).toEqual([
        {
          value: 'Injury_1',
          label:
            'Oct 27, 2020 - Fracture tibia and fibula at ankle joint - [Left]',
        },
        { value: 'Injury_2', label: 'Sep 13, 2020 - Ankle Fracture (Left)' },
        { value: 'Illness_3', label: 'Feb 4, 2020 - Emotional stress' },
      ]);
    });

    it('returns the expected filtered data when mounting the hook', async () => {
      const { result, waitForNextUpdate } = renderHook(() =>
        useEnrichedAthletesIssues({
          athleteId: 1,
          useOccurrenceId: true,
          detailedIssue: true,
          customIssueFilter: filterEnrichedIssueConcussions,
        })
      );
      await waitForNextUpdate();

      const [openIssues, closedIssues] = result.current.enrichedAthleteIssues;
      expect(openIssues.label).toBe('Open injury/ illness');
      expect(openIssues.options).toEqual([
        { label: 'May 23, 2020 - Acute Concussion [N/A]', value: 'Injury_400' },
      ]);
      expect(closedIssues.label).toBe('Prior injury/illness');
      expect(closedIssues.options).toEqual([]);
    });
  });

  it('sends include_issue as false when specified and returns empty arrays', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useEnrichedAthletesIssues({ athleteId: 1, includeIssueHook: false })
    );
    await waitForNextUpdate();

    const [openIssues, closedIssues] = result.current.enrichedAthleteIssues;
    expect(openIssues.options).toEqual([]);
    expect(closedIssues.options).toEqual([]);
  });

  describe('when API returns data without the nested issue object', () => {
    beforeEach(() => {
      const issuesWithoutNestedObject = {
        open_issues: [
          {
            id: 101,
            issue_type: 'Injury',
            full_pathology: 'A problem without a nested issue object',
            issue_occurrence_title: null,
            occurrence_date: '2025-10-15T00:00:00.000Z',
          },
        ],
        closed_issues: [],
      };

      server.use(
        rest.get(
          '/ui/medical/athletes/1/issue_occurrences',
          (req, res, ctx) => {
            return res(ctx.json(issuesWithoutNestedObject));
          }
        )
      );
    });

    it('returns an empty options list when useOccurrenceId is false (default)', async () => {
      const { result, waitForNextUpdate } = renderHook(() =>
        useEnrichedAthletesIssues({ athleteId: 1, useOccurrenceId: false })
      );
      await waitForNextUpdate();

      const [openIssues] = result.current.enrichedAthleteIssues;
      // Expect empty options because it cannot generate a value from 'issue.id' and filters the invalid item out
      expect(openIssues.options).toEqual([]);
    });

    it('returns a populated options list when useOccurrenceId is true', async () => {
      const { result, waitForNextUpdate } = renderHook(() =>
        useEnrichedAthletesIssues({ athleteId: 1, useOccurrenceId: true })
      );
      await waitForNextUpdate();

      const [openIssues] = result.current.enrichedAthleteIssues;
      // Expect a valid option because it can use the top-level occurrence 'id' for the value
      expect(openIssues.options).toEqual([
        {
          value: 'Injury_101', // Value is correctly built from the occurrence ID
          label: 'Oct 15, 2025 - A problem without a nested issue object',
        },
      ]);
    });
  });

  describe('when includeGroupedHook is false', () => {
    it('returns the expected data when mounting the hook', async () => {
      const { result, waitForNextUpdate } = renderHook(() =>
        useEnrichedAthletesIssues({ athleteId: 1, includeGroupedHook: false })
      );
      await waitForNextUpdate();

      const [openIssues, closedIssues] = result.current.enrichedAthleteIssues;
      expect(openIssues.label).toBe('Open injury/ illness');
      expect(openIssues.options).toEqual([
        { value: 'Injury_1', label: 'Nov 11, 2020 - Ankle Fracture (Left)' },
        { value: 'Illness_2', label: 'Aug 6, 2020 - Asthma and/or allergy' },
      ]);
      expect(closedIssues.label).toBe('Prior injury/illness');
      expect(closedIssues.options).toEqual([
        {
          value: 'Injury_1',
          label:
            'Oct 27, 2020 - Fracture tibia and fibula at ankle joint - [Left]',
        },
        { value: 'Injury_2', label: 'Sep 13, 2020 - Ankle Fracture (Left)' },
      ]);
    });
  });
});
