// @flow

import { Stack } from '@kitman/playbook/components';
import FallbackCrest from '@kitman/modules/src/shared/FixtureScheduleView/FallbackCrest';
import i18next from 'i18next';
import { withNamespaces } from 'react-i18next';
import style from './style';

type Props = {
  imageSrc?: string,
  name: string,
};

const Club = ({ t, imageSrc, name }: i18next<Props>) => {
  return (
    <Stack direction="row" gap={1} alignItems="center">
      {imageSrc ? (
        <img css={style.teamFlag} src={imageSrc} alt={`${name} ${t('flag')}`} />
      ) : (
        <FallbackCrest />
      )}
      <span css={style.club}>{name}</span>
    </Stack>
  );
};

export default withNamespaces()(Club);
