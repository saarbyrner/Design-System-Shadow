import { stripMarkup, getDynamicGroupingOptions } from '../utils';

describe('RosterOverview|ReportManager|utils', () => {
  describe('stripMarkup', () => {
    it('strips markup from a string with html markup in it', () => {
      const textWithMarkup =
        '<p>This is some text with markup.</p><div>And some more text.</div>';

      expect(stripMarkup(textWithMarkup)).toBe(
        'This is some text with markup.And some more text.'
      );
    });
  });
});

describe('getDynamicGroupingOptions', () => {
  it('returns expected options when coachesReportV2 true', () => {
    expect(getDynamicGroupingOptions(true)).toEqual([
      {
        value: null,
        label: 'No grouping',
      },
      {
        value: 'position',
        label: 'By Position',
      },
      {
        value: 'availability_asc',
        label: 'Availability ascending',
      },
      {
        value: 'availability_desc',
        label: 'Availability descending',
      },
    ]);
  });
  it('returns expected options when coachesReportV2 false', () => {
    expect(getDynamicGroupingOptions(false)).toEqual([
      {
        value: 'no_grouping',
        label: 'No grouping',
      },
      {
        value: 'position_group_position',
        label: 'By Position',
      },
      {
        value: 'position_group',
        label: 'Offense / Defense',
      },
      {
        value: 'injury_status',
        label: 'Out / Limited / Full',
      },
      {
        value: 'injury_status_reverse',
        label: 'Full / Limited / Out',
      },
    ]);
  });
});
