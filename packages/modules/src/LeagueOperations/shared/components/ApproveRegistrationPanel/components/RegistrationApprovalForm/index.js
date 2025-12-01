// @flow
import { colors } from '@kitman/common/src/variables';
import { type Node } from 'react';
import { Grid, Box } from '@kitman/playbook/components';
import useApproveRegistration from '@kitman/modules/src/LeagueOperations/shared/components/ApproveRegistrationPanel/hooks/useApproveRegistration';
import { StatusSelectTranslated as StatusSelect } from '@kitman/modules/src/LeagueOperations/shared/components/FormComponents/StatusSelect';
import useRegistrationStatus from '@kitman/modules/src/LeagueOperations/shared/hooks/useRegistrationStatus';

import { AnnotationNoteTranslated as AnnotationNote } from '@kitman/modules/src/LeagueOperations/shared/components/FormComponents/AnnotationNote';

const RegistrationApprovalForm = (): Node => {
  const { onAddAnnotation, onApplyStatus, approvalOptions } =
    useApproveRegistration();
  const {
    registrationApplicationStatus,
    isSuccessRegistrationApplicationStatuses,
  } = useRegistrationStatus({});
  const HARDCODED_STYLES_UNTIL_HISTORY_IS_READY = {
    display: 'flex',
    alignItems: 'end',
    mt: 'auto',
  };

  const statusOptions =
    (isSuccessRegistrationApplicationStatuses &&
      registrationApplicationStatus) ||
    approvalOptions;

  return (
    <Box
      sx={{
        flex: 1,
        overflowY: 'auto',
        borderTop: `1px solid ${colors.neutral_300}`,
        ...HARDCODED_STYLES_UNTIL_HISTORY_IS_READY,
      }}
    >
      <Grid
        container
        spacing={2}
        columns={4}
        p={0}
        m={0}
        sx={{
          maxWidth: '100%',
          overflowX: 'hidden',
          whiteSpace: 'normal',
        }}
      >
        <StatusSelect
          options={statusOptions}
          onChange={({ status }) => onApplyStatus({ status })}
        />
        <AnnotationNote
          onChange={({ annotation }) => onAddAnnotation({ annotation })}
        />
      </Grid>
    </Box>
  );
};

export default RegistrationApprovalForm;
