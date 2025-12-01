/** @typedef {import('../types').IdToEventTypeMap} IdToEventTypeMap */
/* eslint-disable jest/no-mocks-import */
import 'core-js/stable/structured-clone';

import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import * as mocks from '../__mocks__/groups-helpers';
import * as scopedSquadsMocks from '../__mocks__/groups-helpers-scoped-squads';
import {
  prepareEventsInGroups,
  reduceGroupsIntoEventNames,
  getNewAndUpdatedEvents,
  mapResponseEventTypeToIP,
} from '../groups-helpers';

describe('groups-helpers', () => {
  const t = i18nextTranslateStub();

  describe('mapResponseEventTypeToIP', () => {
    it('should map the response event type to one for iP', () => {
      expect(mapResponseEventTypeToIP(mocks.responseEvent)).toEqual(
        mocks.iPEvent
      );
    });

    describe(`with the squad-scoped-custom-events FF on`, () => {
      beforeEach(() => {
        window.featureFlags['squad-scoped-custom-events'] = true;
      });

      afterEach(() => {
        window.featureFlags['squad-scoped-custom-events'] = false;
      });

      it('should map the response event type to one for iP', () => {
        expect(
          mapResponseEventTypeToIP(scopedSquadsMocks.responseEvent)
        ).toEqual(scopedSquadsMocks.iPEvent);
      });
    });
  });
  describe('prepareEventsInGroups', () => {
    it('should return an empty array for archivedGroups and all events in groups', () => {
      const { groups, archivedGroups } = prepareEventsInGroups(
        mocks.rawEvents,
        t
      );
      expect(groups).toEqual(mocks.groupedEvents);
      expect(archivedGroups).toEqual([]);
    });

    it('should return an empty array for archivedGroups and no ungrouped events in groups', () => {
      const { groups, archivedGroups } = prepareEventsInGroups(
        mocks.rawEventsNoUngrouped,
        t
      );
      expect(groups).toEqual(mocks.groupedEventsNoUngrouped);
      expect(archivedGroups).toEqual([]);
    });

    it('should return an array with parent1 and parent1Child1 in archivedGroups and the rest of the events in groups', () => {
      const { groups, archivedGroups } = prepareEventsInGroups(
        mocks.rawEventsParent1Child1Archived,
        t
      );
      expect(groups).toEqual(mocks.groupedEventsParent1Child1Archived);
      expect(archivedGroups).toEqual(
        mocks.archivedGroupedEventsParent1Child1Archived
      );
    });

    it(`should return an array with parent1 and its children in archivedGroups and the rest of the events in groups - parent1 will be there without any children`, () => {
      const { groups, archivedGroups } = prepareEventsInGroups(
        mocks.rawEventsParent1ChildrenArchived,
        t
      );
      expect(groups).toEqual(mocks.groupedEventsParent1ChildrenArchived);
      expect(archivedGroups).toEqual(
        mocks.archivedGroupedEventsParent1ChildrenArchived
      );
    });
    it(`should return archived ungrouped event in archivedGroups and an array with parent1 and its children in groups`, () => {
      const { groups, archivedGroups } = prepareEventsInGroups(
        mocks.rawEventsArchivedUngrouped,
        t
      );
      expect(groups).toEqual(mocks.groupedEventsArchivedUngrouped);
      expect(archivedGroups).toEqual(
        mocks.archivedGroupedEventsUngroupedArchived
      );
    });
  });

  describe('reduceGroupsIntoEventNames', () => {
    it('should not find any duplicates', () => {
      const { duplicatesExist, eventNamesSet } = reduceGroupsIntoEventNames(
        mocks.groupedEvents,
        mocks.archivedGroupedEventsWithoutDuplicateNames
      );
      expect(duplicatesExist).toBe(false);
      expect(eventNamesSet).toEqual(mocks.eventNameSetMock);
    });

    it('should find duplicates in parent names', () => {
      const { duplicatesExist, eventNamesSet } = reduceGroupsIntoEventNames(
        mocks.groupedEventsWithDuplicateInParentNames,
        mocks.archivedGroupedEventsWithoutDuplicateNames
      );
      expect(duplicatesExist).toBe(true);
      expect(eventNamesSet).toEqual(mocks.eventNameSetMock);
    });

    it('should find duplicates in child names inside the same parent', () => {
      const { duplicatesExist, eventNamesSet } = reduceGroupsIntoEventNames(
        mocks.groupedEventsWithDuplicateInChildrenNamesSameParent,
        mocks.archivedGroupedEventsWithoutDuplicateNames
      );
      expect(duplicatesExist).toBe(true);
      expect(eventNamesSet).toEqual(
        mocks.eventNameSetMockDuplicateChildrenNameSameParent
      );
    });

    it('should find duplicates in child names in another parent', () => {
      const { duplicatesExist, eventNamesSet } = reduceGroupsIntoEventNames(
        mocks.groupedEventsWithDuplicateInChildrenNamesDifferentParent,
        mocks.archivedGroupedEventsWithoutDuplicateNames
      );
      expect(duplicatesExist).toBe(true);
      expect(eventNamesSet).toEqual(
        mocks.eventNameSetMockDuplicateChildrenNameDifferentParent
      );
    });

    it('should find duplicates in event names with ungrouped events', () => {
      const { duplicatesExist, eventNamesSet } = reduceGroupsIntoEventNames(
        mocks.groupedEventsWithDuplicateNameInUngroupedEvents,
        mocks.archivedGroupedEventsWithoutDuplicateNames
      );
      expect(duplicatesExist).toBe(true);
      expect(eventNamesSet).toEqual(
        mocks.eventNameSetMockDuplicatesInUngroupedEvents
      );
    });

    it('should find duplicates in archived event names', () => {
      const { duplicatesExist, eventNamesSet } = reduceGroupsIntoEventNames(
        mocks.groupedEventsWithDuplicateNameInUngroupedEvents,
        mocks.archivedGroupedEventsWithDuplicateNames
      );
      expect(duplicatesExist).toBe(true);
      expect(eventNamesSet).toEqual(
        mocks.eventNameSetMockDuplicatesInArchivedEvents
      );
    });
    it('should find duplicates in archived group names (parent is archived)', () => {
      const { duplicatesExist, eventNamesSet } = reduceGroupsIntoEventNames(
        mocks.groupedEventsWithDuplicateNamesInArchivedParent,
        mocks.archivedGroupedEventsWithDuplicateNamesInArchivedParent
      );
      expect(duplicatesExist).toBe(true);
      expect(eventNamesSet).toEqual(
        mocks.eventNameSetMockDuplicatesInEventsWithArchivedParent
      );
    });
    it('should NOT find duplicates in archived group names (parent is not archived)', () => {
      const { duplicatesExist, eventNamesSet } = reduceGroupsIntoEventNames(
        mocks.groupedEventsWithoutDuplicateNamesInNonArchivedParent,
        mocks.archivedGroupedEventsWithoutDuplicateNamesInNonArchivedParent
      );
      expect(duplicatesExist).toBe(false);
      expect(eventNamesSet).toEqual(
        mocks.eventNameSetMockDuplicatesInEventsWithNonArchivedParent
      );
    });

    it('should find duplicates in names - case insensitive', () => {
      const { duplicatesExist, eventNamesSet } = reduceGroupsIntoEventNames(
        mocks.groupedEventsDuplicateCaseInsensitive,
        mocks.archivedGroupedEventsDuplicateCaseInsensitive
      );
      expect(duplicatesExist).toBe(true);
      expect(eventNamesSet).toEqual(
        mocks.eventNameSetMockDuplicatesCaseInsensitive
      );
    });
  });

  describe('getNewAndUpdatedEvents', () => {
    /** @type {IdToEventTypeMap} */
    const eventTypes = new Map();

    mocks.rawEvents.forEach((event) => {
      eventTypes.set(event.id, event);
    });
    it('should recognize that nothing has changed', () => {
      const { newEvents, updatedEvents, newGroups } = getNewAndUpdatedEvents({
        formData: mocks.groupedEvents,
        eventTypes,
      });
      expect(newEvents).toEqual([]);
      expect(newGroups).toEqual([]);
      expect(updatedEvents).toEqual([]);
    });

    it('should recognize the new events, new groups and updated events', () => {
      const { newEvents, updatedEvents, newGroups } = getNewAndUpdatedEvents({
        formData: mocks.clonedOriginalFormData,
        eventTypes,
      });
      expect(newEvents).toEqual(mocks.expectedNewEvents);
      expect(updatedEvents).toEqual(mocks.expectedUpdatedEvents);
      expect(newGroups).toEqual(mocks.expectedNewGroups);
    });

    describe(`with the squad-scoped-custom-events FF on`, () => {
      /** @type {IdToEventTypeMap} */
      const eventTypesScopedSquads = new Map();

      scopedSquadsMocks.rawEvents.forEach((event) => {
        eventTypesScopedSquads.set(event.id, event);
      });

      beforeEach(() => {
        window.featureFlags['squad-scoped-custom-events'] = true;
      });
      afterEach(() => {
        window.featureFlags['squad-scoped-custom-events'] = false;
      });

      it('should recognize that nothing has changed - with scoped squads FF on', () => {
        const { newEvents, updatedEvents, newGroups } = getNewAndUpdatedEvents({
          formData: scopedSquadsMocks.groupedEvents,
          eventTypes: eventTypesScopedSquads,
        });
        expect(newEvents).toEqual([]);
        expect(newGroups).toEqual([]);
        expect(updatedEvents).toEqual([]);
      });
      it('should recognize the new events, new groups and updated events - with scoped squads FF on', () => {
        const { newEvents, updatedEvents, newGroups } = getNewAndUpdatedEvents({
          formData: scopedSquadsMocks.clonedOriginalFormData,
          eventTypes: eventTypesScopedSquads,
        });
        expect(newEvents).toEqual(scopedSquadsMocks.expectedNewEvents);
        expect(updatedEvents).toEqual(scopedSquadsMocks.expectedUpdatedEvents);
        expect(newGroups).toEqual(scopedSquadsMocks.expectedNewGroups);
      });
    });
  });
});
