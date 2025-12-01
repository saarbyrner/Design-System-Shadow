// @flow

import GenericApp from '@kitman/modules/src/shared/GenericApp';
import useAppHeaderHeight from '@kitman/common/src/hooks/useAppHeaderHeight';
import useGenericFormAnswersSet from '@kitman/modules/src/HumanInput/hooks/useGenericFormAnswersSet';
import { GenericFormRendererTranslated as GenericFormRenderer } from '@kitman/modules/src/HumanInput/pages/genericFormRenderer/GenericFormRenderer';
import { colors } from '@kitman/common/src/variables';
import { Box } from '@kitman/playbook/components';

const AssignedFormCompletionApp = () => {
  const headerHeight = useAppHeaderHeight();

  return (
    <GenericApp customHooks={[useGenericFormAnswersSet]}>
      <Box
        sx={{
          backgroundColor: colors.white,
          height: `calc(100dvh - ${headerHeight}px)`,
        }}
      >
        <GenericFormRenderer />
      </Box>
    </GenericApp>
  );
};

export default AssignedFormCompletionApp;
