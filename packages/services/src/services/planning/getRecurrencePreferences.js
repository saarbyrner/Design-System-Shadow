// @flow
import { axios } from '@kitman/common/src/utils/services';

export type RecurrencePreferencesOptions = Array<{
  id: number,
  preference_name: string,
  perma_id: string,
}>;
type RecurrencePreferencesOptionsResponse = {
  preferences: RecurrencePreferencesOptions,
};

const getRecurrencePreferences =
  async (): Promise<RecurrencePreferencesOptionsResponse> => {
    const { data } = await axios.get(
      '/ui/planning_hub/events_recurrence_preferences'
    );
    return data;
  };

export default getRecurrencePreferences;
