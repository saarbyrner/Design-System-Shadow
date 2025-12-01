// @flow
import i18n from '@kitman/common/src/utils/i18n';
import { Typography } from '@kitman/playbook/components';

const getTranslatedText = () => ({
  title: i18n.t('Agreement'),
  content: (
    <>
      <Typography variant="body2">
        {i18n.t(
          'CPT copyright 2023 American Medical Association. All rights reserved'
        )}
      </Typography>
      <Typography variant="body2">
        {i18n.t(
          'Fee schedules, relative value units, conversion factors and/or related components are not assigned by the AMA, are not part of CPT, and the AMA is not recommending their use. The AMA does not directly or indirectly practice medicine or dispense medical services. The AMA assumes no liability for data contained or not contained herein.'
        )}
      </Typography>
      <Typography variant="body2">
        {i18n.t(
          'CPT is a registered trademark of the American Medical Association.'
        )}
      </Typography>
    </>
  ),
  actions: {
    ctaButton: i18n.t('I acknowledge'),
  },
});

export default getTranslatedText;
