// @flow
import { useSelector } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { getId } from '@kitman/modules/src/UserMovement/shared/redux/selectors/movementProfileSelectors';
import {
  Box,
  Stack,
  Typography,
  Table,
  TableBody,
  Skeleton,
  TableContainer,
} from '@kitman/playbook/components';
import { getMovementHistory } from '../../redux/selectors/movementHistorySelectors';
import { HistoryMovementRecordRowTranslated as HistoryMovementRecordRow } from '../HistoryMovementRecordRow';

type Props = {
  isLoading: boolean,
};

const HistoryMovementRecords = (props: I18nProps<Props>) => {
  const userId = useSelector(getId);

  const history = useSelector(getMovementHistory({ userId }));

  const renderContent = () => {
    if (props.isLoading) {
      return (
        <Box
          sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}
          data-testid="HistoryMovementRecords|LoadingState"
        >
          <Skeleton variant="text" width="25%" />
          <Skeleton variant="text" width="25%" />
          <Skeleton variant="circular" height={24} width={24} />
          <Skeleton variant="text" width="25%" />
        </Box>
      );
    }
    return (
      <TableContainer sx={{ pt: 0 }}>
        <Table>
          <TableBody>
            {history.map((record) => (
              <HistoryMovementRecordRow
                key={record.id}
                record={record}
                showMovementType
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stack spacing={2}>
        <Typography
          variant="subtitle1"
          component="div"
          sx={{ color: 'text.primary', fontWeight: 600 }}
        >
          {props.t('Activity')}
        </Typography>

        {renderContent()}
      </Stack>
    </Box>
  );
};

export const HistoryMovementRecordsTranslated = withNamespaces()(
  HistoryMovementRecords
);
export default HistoryMovementRecords;
