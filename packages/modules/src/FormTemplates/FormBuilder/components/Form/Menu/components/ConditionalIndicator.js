// @flow

import { type ComponentType } from 'react';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import { Box, Tooltip } from '@kitman/playbook/components';
import { withNamespaces } from 'react-i18next';

type Props = {
  marginRight: string,
};

const ConditionalIndicator = ({ marginRight, t }: I18nProps<Props>) => {
  return (
    <Tooltip title={t('Conditional')} placement="bottom">
      <Box
        sx={{
          mr: marginRight,
          display: 'inline-block',
          ml: 'auto',
        }}
      >
        <KitmanIcon name={KITMAN_ICON_NAMES.Link} />
      </Box>
    </Tooltip>
  );
};

export const ConditionalIndicatorTranslated: ComponentType<Props> =
  withNamespaces()(ConditionalIndicator);
export default ConditionalIndicator;
