// @flow
import type { Node } from 'react';
import { Box, Stack } from '@kitman/playbook/components';
import { HeaderStartTranslated as HeaderStart } from '@kitman/modules/src/HumanInput/shared/components/HeaderStart';
import { headerContainerSx } from '@kitman/modules/src/HumanInput/shared/utils/styles';
import { AutosaveStatusTranslated as AutosaveStatus } from './components/AutosaveStatus';

type AthleteData = {
  availability: string,
  avatar_url: string,
  firstname: string,
  fullname: string,
  id: number,
  lastname: string,
  position: {
    id: number,
    name: string,
    order: number,
  },
};

type Props = {
  title: string,
  athlete: AthleteData,
  handleBack: () => void,
  actionButtons?: Array<Node>,
  isAutosaving?: boolean,
  lastSaved?: ?string,
  autosaveError?: ?string,
  isAutosaveEnabled?: boolean,
};

const Header = ({
  title,
  athlete,
  handleBack,
  actionButtons,
  isAutosaving,
  lastSaved,
  autosaveError,
  isAutosaveEnabled = false,
}: Props) => {
  let athleteName = null;
  if (athlete && athlete.firstname && athlete.lastname) {
    athleteName = `${athlete.firstname} ${athlete.lastname}`;
  }

  return (
    <Box sx={headerContainerSx}>
      <HeaderStart
        title={title}
        handleBack={handleBack}
        showStatus={false}
        avatarUrl={athlete?.avatar_url}
        userName={athleteName}
      />
      <Stack spacing={2} direction="row">
        {isAutosaveEnabled && (
          <AutosaveStatus
            isAutosaving={isAutosaving}
            lastSaved={lastSaved}
            autosaveError={autosaveError}
          />
        )}
        {actionButtons && actionButtons?.length > 0 && actionButtons}
      </Stack>
    </Box>
  );
};

export default Header;
