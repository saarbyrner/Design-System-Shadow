/* eslint-disable flowtype/require-valid-file-annotation */
import i18n from '@kitman/common/src/utils/i18n';

const eventTypes = () => {
  return [
    {
      id: 'game',
      name: i18n.t('Game'),
      subItems: [{ id: 'game', name: i18n.t('Game') }],
    },
  ];
};

export default eventTypes;
