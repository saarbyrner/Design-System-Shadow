// @flow
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import moment from 'moment';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { TableCell, TableRow, Avatar } from '@kitman/playbook/components';
import type { HistoricalMovementRecord } from '../../redux/services/api/postMovementRecordHistory';

type Props = {
  record: HistoricalMovementRecord,
  showMovementType: boolean,
};

const HistoryMovementRecordRow = (props: I18nProps<Props>) => {
  return (
    <TableRow key={props.record.id} sx={{ 'td,th': { border: 0 } }}>
      <TableCell scope="row">
        {props.record?.joined_at
          ? DateFormatter.formatStandard({
              date: moment(props.record.joined_at),
            })
          : '-'}
      </TableCell>
      {props.showMovementType && (
        <TableCell align="left">{props.record.transfer_type}</TableCell>
      )}

      <TableCell
        component="th"
        align="left"
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: 1,
          alignItems: 'center',
        }}
      >
        <Avatar
          sx={{
            width: 24,
            height: 24,
          }}
          alt={props.record.organisation.name}
          src={props.record.organisation?.logo_full_path}
        />
        {props.record.organisation.name}
      </TableCell>
    </TableRow>
  );
};

export const HistoryMovementRecordRowTranslated = withNamespaces()(
  HistoryMovementRecordRow
);
export default HistoryMovementRecordRow;
