import {
  getSquadOptions,
  getLabelOptions,
  getSegmentOptions,
} from '@kitman/components/src/Athletes/utils';
import { data as segmentData } from '@kitman/services/src/mocks/handlers/analysis/groups';
import { data as labelData } from '@kitman/services/src/mocks/handlers/analysis/labels';
import { EMPTY_SELECTION } from '../constants';

describe('utils', () => {
  const mockSquadOptions = [
    {
      id: 262,
      name: 'Test',
      options: [
        { type: 'position_groups', id: 25, name: 'Forward' },
        { type: 'positions', id: 71, name: 'Hooker' },
        {
          type: 'athletes',
          id: 43975,
          firstname: 'API',
          lastname: 'Tester',
          name: 'API Tester',
          fullname: 'API Tester',
        },
        {
          type: 'athletes',
          id: 27280,
          firstname: 'Gustavo',
          lastname: 'Lazaro Amendola',
          name: 'Gustavo Lazaro Amendola',
          fullname: 'Gustavo Lazaro Amendola',
        },
      ],
    },
  ];
  describe('getSquadOptions', () => {
    it('returns empty if no squads are in the population', () => {
      const result = getSquadOptions(
        mockSquadOptions,
        EMPTY_SELECTION,
        'squads'
      );
      expect(result).toEqual([]);
    });

    it('returns empty if no positions are in the population', () => {
      const result = getSquadOptions(
        mockSquadOptions,
        EMPTY_SELECTION,
        'positions'
      );
      expect(result).toEqual([]);
    });

    it('returns empty if no position groups are in the population', () => {
      const result = getSquadOptions(
        mockSquadOptions,
        EMPTY_SELECTION,
        'position_groups'
      );
      expect(result).toEqual([]);
    });

    it('returns empty if no athletes are in the population', () => {
      const result = getSquadOptions(
        mockSquadOptions,
        EMPTY_SELECTION,
        'athletes'
      );
      expect(result).toEqual([]);
    });

    it('returns correct label value for a single squad', () => {
      const result = getSquadOptions(
        mockSquadOptions,
        { ...EMPTY_SELECTION, squads: [mockSquadOptions[0].id] },
        'squads'
      );
      expect(result).toEqual([{ label: mockSquadOptions[0].name }]);
    });

    it('returns correct label value for a single position', () => {
      const result = getSquadOptions(
        mockSquadOptions,
        { ...EMPTY_SELECTION, positions: [mockSquadOptions[0].options[1].id] },
        'positions'
      );
      expect(result).toEqual([{ label: mockSquadOptions[0].options[1].name }]);
    });

    it('returns correct label value for a single position group', () => {
      const result = getSquadOptions(
        mockSquadOptions,
        {
          ...EMPTY_SELECTION,
          position_groups: [mockSquadOptions[0].options[0].id],
        },
        'position_groups'
      );
      expect(result).toEqual([{ label: mockSquadOptions[0].options[0].name }]);
    });

    it('returns correct label value for athletes', () => {
      const result = getSquadOptions(
        mockSquadOptions,
        {
          ...EMPTY_SELECTION,
          athletes: [
            mockSquadOptions[0].options[2].id,
            mockSquadOptions[0].options[3].id,
          ],
        },
        'athletes'
      );
      expect(result).toEqual([
        { label: mockSquadOptions[0].options[2].name },
        { label: mockSquadOptions[0].options[3].name },
      ]);
    });
  });

  describe('getLabelOptions', () => {
    it('returns empty if no labels are in the population', () => {
      const result = getLabelOptions(labelData, EMPTY_SELECTION, 'labels');
      expect(result).toEqual([]);
    });

    it('returns correct label value for a single label', () => {
      const result = getLabelOptions(
        labelData,
        { ...EMPTY_SELECTION, labels: [labelData[0].id] },
        'labels'
      );
      expect(result).toEqual([{ label: labelData[0].name }]);
    });

    it('returns correct label value for a multiple labels', () => {
      const result = getLabelOptions(
        labelData,
        {
          ...EMPTY_SELECTION,
          labels: [labelData[0].id, labelData[1].id, labelData[2].id],
        },
        'labels'
      );
      expect(result).toEqual([
        { label: labelData[0].name },
        { label: labelData[1].name },
        { label: labelData[2].name },
      ]);
    });
  });

  describe('getSegmentOptions', () => {
    it('returns empty if no segments are in the population', () => {
      const result = getSegmentOptions(
        segmentData,
        EMPTY_SELECTION,
        'segments'
      );
      expect(result).toEqual([]);
    });

    it('returns correct label value for a single segment', () => {
      const result = getSegmentOptions(
        segmentData,
        { ...EMPTY_SELECTION, segments: [segmentData[0].id] },
        'segments'
      );
      expect(result).toEqual([{ label: segmentData[0].name }]);
    });

    it('returns correct label value for a multiple segments', () => {
      const result = getSegmentOptions(
        segmentData,
        {
          ...EMPTY_SELECTION,
          segments: [segmentData[0].id, segmentData[1].id, segmentData[2].id],
        },
        'segments'
      );
      expect(result).toEqual([
        { label: segmentData[0].name },
        { label: segmentData[1].name },
        { label: segmentData[2].name },
      ]);
    });
  });
});
