import {
  getCalendarEventData,
  getCalendarFilterData,
  getDeleteEventData,
} from '@kitman/common/src/utils/TrackingData/src/data/calendar/getCalendarEventData';
import { mockEventData } from '@kitman/common/src/utils/TrackingData/src/mocks/calendar';
import { getIsRepeatEvent } from '@kitman/common/src/utils/events';

jest.mock('@kitman/common/src/utils/events');

describe('getCalendarEventData', () => {
  const mockAdditionalData = {
    areParticipantsDuplicated: true,
    isSessionPlanDuplicated: true,
    drillsCount: 7,
  };

  const mockEventDataWithRecurrence = {
    ...mockEventData,
    recurrence: {
      rule: 'FREQ=WEEKLY',
      preferences: [
        { id: 1, preference_name: 'Surface type', perma_id: 'surface_type' },
      ],
    },
  };

  describe('game_event', () => {
    it('should return EDIT game event details if event type is game_event and panel mode is EDIT', () => {
      expect(
        getCalendarEventData({
          eventType: 'game_event',
          panelMode: 'EDIT',
          eventToTrack: mockEventData,
          additionalMixpanelSessionData: mockAdditionalData,
          isRepeatEvent: false,
        })
      ).toMatchSnapshot();
    });

    it('should return ADD game event details if event type is game_event and panel mode is not EDIT', () => {
      expect(
        getCalendarEventData({
          eventType: 'game_event',
          panelMode: 'CREATE',
          eventToTrack: mockEventData,
          additionalMixpanelSessionData: mockAdditionalData,
          isRepeatEvent: false,
        })
      ).toMatchSnapshot();
    });
  });

  describe('session_event', () => {
    it('should return EDIT session event details if event type is session_event and panel mode is EDIT', () => {
      expect(
        getCalendarEventData({
          eventType: 'session_event',
          panelMode: 'EDIT',
          eventToTrack: mockEventDataWithRecurrence,
          additionalMixpanelSessionData: mockAdditionalData,
          isRepeatEvent: false,
        })
      ).toMatchSnapshot();
    });

    it('should return ADD session event details if event type is session_event and panel mode is CREATE', () => {
      expect(
        getCalendarEventData({
          eventType: 'session_event',
          panelMode: 'CREATE',
          eventToTrack: mockEventDataWithRecurrence,
          additionalMixpanelSessionData: mockAdditionalData,
          isRepeatEvent: false,
          createWithNoParticipants: true,
        })
      ).toMatchSnapshot();
    });

    it('should return DUPLICATE session event details if event type is session_event and panel mode is not DUPLICATE', () => {
      expect(
        getCalendarEventData({
          eventType: 'session_event',
          panelMode: 'DUPLICATE',
          eventToTrack: mockEventDataWithRecurrence,
          additionalMixpanelSessionData: mockAdditionalData,
          isRepeatEvent: false,
        })
      ).toMatchSnapshot();
    });
  });

  describe('custom_event', () => {
    it('should return EDIT custom event details if event type is custom_event and panel mode is EDIT', () => {
      expect(
        getCalendarEventData({
          eventType: 'custom_event',
          panelMode: 'EDIT',
          eventToTrack: mockEventDataWithRecurrence,
          additionalMixpanelSessionData: mockAdditionalData,
          isRepeatEvent: true,
        })
      ).toMatchSnapshot();
    });

    it('should call mixpanel track event with ADD custom event details if event type is custom_event and panel mode is not EDIT', () => {
      expect(
        getCalendarEventData({
          eventType: 'custom_event',
          panelMode: 'CREATE',
          eventToTrack: mockEventDataWithRecurrence,
          additionalMixpanelSessionData: mockAdditionalData,
          isRepeatEvent: true,
        })
      ).toMatchSnapshot();
    });
  });

  it('getCalendarFilterDataToTrack', () => {
    const mockFilters = ['types', 'locations', 'something_else'];

    expect(getCalendarFilterData(mockFilters)).toMatchSnapshot();
  });

  it('getDeleteEventData', () => {
    getIsRepeatEvent.mockReturnValue(true);
    const mockScope = 'this';

    expect(
      getDeleteEventData(mockEventDataWithRecurrence, mockScope)
    ).toMatchSnapshot();
  });
});
