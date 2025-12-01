// @flow
import { colors } from '@kitman/common/src/variables';
import { type Node } from 'react';
import { Grid, Box } from '@kitman/playbook/components';

import { StatusSelectTranslated as StatusSelect } from '@kitman/modules/src/LeagueOperations/shared/components/FormComponents/StatusSelect';
import { AnnotationNoteTranslated as AnnotationNote } from '@kitman/modules/src/LeagueOperations/shared/components/FormComponents/AnnotationNote';
import useRegistrationStatus from '@kitman/modules/src/LeagueOperations/shared/hooks/useRegistrationStatus';
import useManageSection from '../../hooks/useManageSection';

const ApprovalForm = (): Node => {
  const {
    isSectionApprovable,
    approvalOptions,
    onApplyStatus,
    onAddAnnotation,
  } = useManageSection();
  const { sectionStatuses, isSuccessSectionStatuses } = useRegistrationStatus(
    {}
  );

  if (!isSectionApprovable) return null;

  const statusOptions =
    (isSuccessSectionStatuses && sectionStatuses) || approvalOptions;

  return (
    <Box
      sx={{
        overflowY: 'auto',
        borderTop: `1px solid ${colors.neutral_300}`,
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
          onChange={({ status }) => onApplyStatus({ newStatus: status })}
        />

        <AnnotationNote
          onChange={({ annotation }) => onAddAnnotation({ annotation })}
        />
      </Grid>
    </Box>
  );
};

export default ApprovalForm;
