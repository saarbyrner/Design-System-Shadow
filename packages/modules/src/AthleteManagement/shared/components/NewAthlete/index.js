// @flow
import { TextButton } from '@kitman/components';

import { withNamespaces } from 'react-i18next';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {};

const NewAthlete = (props: I18nProps<Props>) => {
  const locationAssign = useLocationAssign();

  return (
    <TextButton
      type="primary"
      text={props.t('New Athlete')}
      onClick={() => {
        locationAssign(`/administration/athletes/new`);
      }}
      kitmanDesignSystem
    />
  );
};

export const NewAthleteTranslated = withNamespaces()(NewAthlete);
export default NewAthlete;
