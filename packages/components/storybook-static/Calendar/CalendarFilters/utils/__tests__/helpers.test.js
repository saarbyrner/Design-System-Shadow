/** @typedef {import('../../redux/types').Filters} Filters */
/** @typedef {import('../../redux/types').FilterKey} FilterKey */
/** @typedef {import('../../redux/types').FiltersValue} FiltersValue */
/** @typedef {import('../../redux/types').SetFilterActionPayload} SetFilterActionPayload */
/** @typedef {import('@kitman/components/src/CheckboxList').CheckboxListItem} CheckboxListItem */

import { getIslocalStorageAvailable } from '@kitman/common/src/utils';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import {
  readFiltersFromLocalStorage,
  updateFiltersInLocalStorage,
  localStorageKey,
  getTypesOptions,
  getTypesLabelsTranslatedTexts,
  intersectPreSelectedSquadWithPermitted,
} from '../helpers';

jest.mock('@kitman/common/src/utils', () => {
  const originalModule = jest.requireActual('@kitman/common/src/utils');
  return {
    ...originalModule,
    getIslocalStorageAvailable: jest.fn(),
  };
});

describe('helpers', () => {
  /** @type {Filters} */
  const filtersMock = {
    athletes: [],
    competitions: [],
    locationNames: [],
    locationTypes: [],
    oppositions: [],
    squads: [],
    staff: [],
    types: [],
  };

  beforeAll(() => {
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => null),
        setItem: jest.fn(() => null),
      },
    });
  });

  describe('readFiltersFromLocalStorage', () => {
    it('should return null as there are no filters saved', () => {
      getIslocalStorageAvailable.mockReturnValueOnce(true);
      expect(readFiltersFromLocalStorage()).toEqual(null);
    });

    it('should return null as localStorage is not available', () => {
      getIslocalStorageAvailable.mockReturnValueOnce(false);

      expect(readFiltersFromLocalStorage()).toEqual(null);
    });

    it('should return filters', () => {
      getIslocalStorageAvailable.mockReturnValueOnce(true);
      jest
        .spyOn(window.localStorage, 'getItem')
        .mockReturnValue(JSON.stringify(filtersMock));
      expect(readFiltersFromLocalStorage()).toEqual(filtersMock);
    });
  });

  describe('updateFiltersInLocalStorage', () => {
    /** @type {FilterKey} */
    const filterKeyMock = 'athletes';
    /** @type {FiltersValue} */
    const filterValueMock = [234];

    /** @type {SetFilterActionPayload} */
    const filterUpdateInput = { key: filterKeyMock, value: filterValueMock };
    it('should return because localStorage is not available', () => {
      getIslocalStorageAvailable.mockReturnValueOnce(false);
      updateFiltersInLocalStorage(filterUpdateInput);

      const setItemSpy = jest.spyOn(window.localStorage, 'setItem');
      const getItemSpy = jest.spyOn(window.localStorage, 'getItem');
      expect(setItemSpy).toHaveBeenCalledTimes(1);
      expect(getItemSpy).toHaveBeenCalledTimes(1);
    });

    it('should update the existing filters', () => {
      getIslocalStorageAvailable.mockReturnValue(true);
      const currentFilters = { ...filtersMock, squads: [123] };
      jest
        .spyOn(window.localStorage, 'getItem')
        .mockReturnValueOnce(JSON.stringify(currentFilters));

      const setItemSpy = jest.spyOn(window.localStorage, 'setItem');
      updateFiltersInLocalStorage(filterUpdateInput);

      expect(setItemSpy).toHaveBeenCalledWith(
        localStorageKey,
        JSON.stringify({ ...currentFilters, [filterKeyMock]: filterValueMock })
      );
    });

    it('should use the initial filters and update them', () => {
      getIslocalStorageAvailable.mockReturnValue(true);
      jest
        .spyOn(window.localStorage, 'getItem')
        .mockReturnValueOnce(JSON.stringify(filtersMock));

      const setItemSpy = jest.spyOn(window.localStorage, 'setItem');
      updateFiltersInLocalStorage(filterUpdateInput);

      expect(setItemSpy).toHaveBeenCalledWith(
        localStorageKey,
        JSON.stringify({ ...filtersMock, [filterKeyMock]: filterValueMock })
      );
    });
  });

  describe('getTypesOptions', () => {
    const t = i18nextTranslateStub();
    const {
      treatments,
      trainingSessions,
      games,
      individualSessions,
      events,
      rehab,
      squadSessions,
    } = getTypesLabelsTranslatedTexts(t);
    const permissionsWithViewAndMedicalNotes = {
      notes: ['view', 'medical-notes'],
    };
    const permissionsWithoutViewAndMedicalNotes = {
      notes: [],
    };

    /**
     * @param {Array<CheckboxListItem>} typesOptions
     * @returns {Set<string>}
     */
    const getAllLabels = (typesOptions) =>
      new Set(typesOptions.map(({ label }) => label));

    it('should return the options not behind FF/permissions', () => {
      const typesOptions = getTypesOptions(
        permissionsWithViewAndMedicalNotes,
        t
      );
      const allLabels = getAllLabels(typesOptions);
      expect(allLabels.has(individualSessions)).toBeTruthy();
      expect(allLabels.has(games)).toBeTruthy();
      expect(allLabels.has(squadSessions)).toBeTruthy();

      expect(allLabels.has(treatments)).toBeFalsy();
      expect(allLabels.has(rehab)).toBeFalsy();
      expect(allLabels.has(events)).toBeFalsy();
      expect(allLabels.has(trainingSessions)).toBeFalsy();
    });

    it('should return only training sessions and games for FF', () => {
      window.featureFlags['calendar-hide-all-day-slot'] = true;
      const typesOptions = getTypesOptions(
        permissionsWithViewAndMedicalNotes,
        t
      );

      const allLabels = getAllLabels(typesOptions);
      expect(allLabels.has(trainingSessions)).toBeTruthy();
      expect(allLabels.has(games)).toBeTruthy();

      expect(allLabels.has(treatments)).toBeFalsy();
      expect(allLabels.has(rehab)).toBeFalsy();
      expect(allLabels.has(events)).toBeFalsy();
      expect(allLabels.has(individualSessions)).toBeFalsy();
      expect(allLabels.has(squadSessions)).toBeFalsy();
      window.featureFlags['calendar-hide-all-day-slot'] = false;
    });

    it('should return also events for custom-events FF', () => {
      window.featureFlags['custom-events'] = true;
      const typesOptions = getTypesOptions(
        permissionsWithViewAndMedicalNotes,
        t
      );

      const allLabels = getAllLabels(typesOptions);
      expect(allLabels.has(individualSessions)).toBeTruthy();
      expect(allLabels.has(games)).toBeTruthy();
      expect(allLabels.has(squadSessions)).toBeTruthy();
      expect(allLabels.has(events)).toBeTruthy();

      expect(allLabels.has(treatments)).toBeFalsy();
      expect(allLabels.has(rehab)).toBeFalsy();
      expect(allLabels.has(trainingSessions)).toBeFalsy();
    });

    describe('rehab', () => {
      beforeEach(() => {
        window.featureFlags['schedule-rehab'] = true;
      });

      afterEach(() => {
        window.featureFlags['schedule-rehab'] = false;
      });

      it('should return rehab option', () => {
        const typesOptions = getTypesOptions(
          permissionsWithViewAndMedicalNotes,
          t
        );

        expect(typesOptions.find((item) => item.label === rehab)).toBeDefined();
      });
      it('should not return rehab option - no permissions', () => {
        const typesOptions = getTypesOptions(
          permissionsWithoutViewAndMedicalNotes,
          t
        );
        expect(
          typesOptions.find((item) => item.label === rehab)
        ).not.toBeDefined();
      });

      it('should not return rehab option - FF is off', () => {
        window.featureFlags['schedule-rehab'] = false;
        const typesOptions = getTypesOptions(
          permissionsWithViewAndMedicalNotes,
          t
        );
        expect(
          typesOptions.find((item) => item.label === rehab)
        ).not.toBeDefined();
      });
    });
    describe('treatments', () => {
      beforeEach(() => {
        window.featureFlags['schedule-treatments'] = true;
      });

      afterEach(() => {
        window.featureFlags['schedule-treatments'] = false;
      });

      it('should return treatments option', () => {
        const typesOptions = getTypesOptions(
          permissionsWithViewAndMedicalNotes,
          t
        );

        expect(
          typesOptions.find((item) => item.label === treatments)
        ).toBeDefined();
      });
      it('should not return treatments option - no permissions', () => {
        const typesOptions = getTypesOptions(
          permissionsWithoutViewAndMedicalNotes,
          t
        );
        expect(
          typesOptions.find((item) => item.label === treatments)
        ).not.toBeDefined();
      });

      it('should not return treatments option - FF is off', () => {
        window.featureFlags['schedule-treatments'] = false;
        const typesOptions = getTypesOptions(
          permissionsWithViewAndMedicalNotes,
          t
        );
        expect(
          typesOptions.find((item) => item.label === treatments)
        ).not.toBeDefined();
      });
    });
  });

  describe('intersectPreSelectedSquadWithPermitted', () => {
    const permittedSquads = [
      { id: 1, name: '1' },
      { id: 2, name: '2' },
    ];
    const preSelectedSquadIds = ['1', '2', '3'];
    it('should filter non permitted squads', () => {
      expect(
        intersectPreSelectedSquadWithPermitted({
          permittedSquads,
          preSelectedSquadIds,
        })
      ).toEqual(['1', '2']);
    });

    it('should filter non permitted squads and the user current squad', () => {
      const userCurrentSquadId = '2';
      expect(
        intersectPreSelectedSquadWithPermitted({
          permittedSquads,
          preSelectedSquadIds,
          userCurrentSquadId,
        })
      ).toEqual(['1']);
    });
  });
});
