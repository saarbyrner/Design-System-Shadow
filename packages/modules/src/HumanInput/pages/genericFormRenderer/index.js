// @flow

import GenericApp from '@kitman/modules/src/shared/GenericApp';
import useGenericFormAnswersSet from '@kitman/modules/src/HumanInput/hooks/useGenericFormAnswersSet';
import useAppHeaderHeight from '@kitman/common/src/hooks/useAppHeaderHeight';
import { colors } from '@kitman/common/src/variables';
import { Box } from '@kitman/playbook/components';
import { GenericFormRendererTranslated as GenericFormRenderer } from './GenericFormRenderer';

const HumanInputGenericFormRendererApp = () => {
  const headerHeight = useAppHeaderHeight();

  return (
    <GenericApp customHooks={[useGenericFormAnswersSet]}>
      <Box
        sx={{
          backgroundColor: `${colors.white}`,
          height: `calc(100dvh - ${headerHeight}px)`,
        }}
      >
        <GenericFormRenderer />
      </Box>
    </GenericApp>
  );
};

export default HumanInputGenericFormRendererApp;
