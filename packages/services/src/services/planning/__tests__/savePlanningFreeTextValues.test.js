import { axios } from '@kitman/common/src/utils/services';
import saveSessionEvaluationFeedback from '../savePlanningFreeTextValues';

describe('saveSessionEvaluationFeedback', () => {
  const eventId = 123;
  const args = {
    eventEvaluationWentWell: '<p>Nothing, it went great!</p>',
    eventEvaluationWentWrong: '<p>use weak foot next time!</p>',
  };

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('makes a back-end call to the correct URL with the correct HTTP verb and body', async () => {
    jest.spyOn(axios, 'post').mockResolvedValue({});

    await saveSessionEvaluationFeedback(eventId, [
      {
        name: 'event_evaluation_went_well',
        value: args.eventEvaluationWentWell,
      },
      {
        name: 'event_evaluation_went_wrong',
        value: args.eventEvaluationWentWrong,
      },
    ]);

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(
      `/planning_hub/events/${eventId}/freetext_values`,
      {
        freetext_components: [
          {
            name: 'event_evaluation_went_well',
            value: '<p>Nothing, it went great!</p>',
          },
          {
            name: 'event_evaluation_went_wrong',
            value: '<p>use weak foot next time!</p>',
          },
        ],
      }
    );
  });
});
