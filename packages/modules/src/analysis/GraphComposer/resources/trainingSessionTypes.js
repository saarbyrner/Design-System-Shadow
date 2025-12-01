/* eslint-disable flowtype/require-valid-file-annotation */
import i18n from '@kitman/common/src/utils/i18n';

const trainingSessionTypes = (trainingSessionTypesArray) => {
  let trainingSessionSubTypes = [];
  if (trainingSessionTypesArray) {
    trainingSessionSubTypes = trainingSessionTypesArray.map(
      (trainingSessionType) => {
        return {
          id: trainingSessionType.id.toString(),
          name: trainingSessionType.name,
        };
      }
    );
  }
  return [
    {
      id: 'training_session',
      name: i18n.t('Training Session'),
      subItems: trainingSessionSubTypes,
    },
  ];
};

export default trainingSessionTypes;
