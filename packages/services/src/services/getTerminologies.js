// @flow
import $ from 'jquery';
import i18n from '@kitman/common/src/utils/i18n';

export type CustomTerminology = {
  key: string,
  value: ?string,
};

export type Terminology = {
  key: string,
  originalName: string,
  customName: ?string,
};
export type Terminologies = Array<Terminology>;

const getTerminologies = (): Promise<Terminologies> => {
  const terminologies = [
    {
      key: 'development_goal',
      originalName: i18n.t('Development goal'),
      customName: null,
    },
  ];

  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: '/ui/terminologies',
    })
      .done((customTerminologies: Array<CustomTerminology>) => {
        resolve(
          terminologies.map((terminology) => ({
            ...terminology,
            customName:
              customTerminologies.find(
                (customTerminology) => customTerminology.key === terminology.key
              )?.value || null,
          }))
        );
      })
      .fail(reject);
  });
};

export default getTerminologies;
