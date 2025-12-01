// @flow
import ajaxPromise from '@kitman/common/src/utils/ajaxPromise';

export type CoachingPrinciplesEnabled = {
  value: boolean,
};

const getAreCoachingPrinciplesEnabled =
  (): Promise<CoachingPrinciplesEnabled> =>
    ajaxPromise({
      method: 'GET',
      url: '/organisation_preferences/coaching_principles',
      contentType: 'application/json',
    });

export default getAreCoachingPrinciplesEnabled;
