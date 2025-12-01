// @flow
/* eslint-disable camelcase */
import { useDispatch, useSelector } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import moment from 'moment';
import {
  IconButton,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@kitman/playbook/components';
import { KitmanIcon } from '@kitman/playbook/icons';
import { getUnregisteredPlayers } from '@kitman/modules/src/LeagueOperations/MatchMonitorApp/MatchMonitorReport/src/shared/redux/selectors';
import { onRemoveUnregisteredPlayer } from '@kitman/modules/src/LeagueOperations/MatchMonitorApp/MatchMonitorReport/src/shared/redux/slices/matchMonitorSlice';
import { registrationOptions } from '@kitman/modules/src/LeagueOperations/MatchMonitorApp/MatchMonitorReport/src/shared/consts';
import type { MatchInformation } from '@kitman/modules/src/LeagueOperations/MatchMonitorApp/MatchMonitorReport/src/shared/types';

type Props = {
  matchInformation: MatchInformation,
  isReadOnly: boolean,
};

const UnregisteredPlayersTable = (props: I18nProps<Props>) => {
  const { t, matchInformation, isReadOnly } = props;
  const dispatch = useDispatch();
  const unregisteredPlayers = useSelector(getUnregisteredPlayers);
  const sortedUnregisteredPlayers = [...(unregisteredPlayers ?? [])].sort(
    (a, b) => (a?.lastname ?? '').localeCompare(b?.lastname ?? '')
  );

  const tableCellStyle = {
    width: 'auto',
    whiteSpace: 'nowrap',
  };

  return (
    <TableContainer>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>{t('Player')}</TableCell>
            <TableCell sx={tableCellStyle}>{t('DOB')}</TableCell>
            <TableCell sx={tableCellStyle}>{t('Club')}</TableCell>
            <TableCell sx={tableCellStyle}>{t('Registration')}</TableCell>
            <TableCell sx={tableCellStyle}>{t('Notes')}</TableCell>
            {!isReadOnly && <TableCell sx={{ width: '20px' }} />}
          </TableRow>
        </TableHead>
        <TableBody>
          {unregisteredPlayers.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={6}
                align="center"
                sx={{ borderBottom: 'none' }}
              >
                {t(
                  'Click add new player button (above) to add players who are not in the squad.'
                )}
              </TableCell>
            </TableRow>
          )}
          {sortedUnregisteredPlayers.map(
            (
              {
                firstname,
                lastname,
                date_of_birth,
                registration_status,
                venue_type,
                notes,
              },
              index
            ) => (
              <TableRow
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                sx={{
                  '& td': {
                    paddingTop: '6px',
                    paddingBottom: '6px',
                  },
                }}
              >
                <TableCell>{`${firstname} ${lastname}`}</TableCell>
                <TableCell sx={tableCellStyle}>
                  {moment(date_of_birth).format('DD/MM/YYYY')}
                </TableCell>
                <TableCell sx={tableCellStyle}>
                  {matchInformation[venue_type].name}
                </TableCell>
                <TableCell sx={tableCellStyle}>
                  {registrationOptions[registration_status]}
                </TableCell>
                <TableCell>{notes || '-'}</TableCell>

                {!isReadOnly && (
                  <TableCell
                    sx={{
                      position: 'sticky',
                      right: 0,
                      backgroundColor: 'white',
                      zIndex: 1,
                      width: '20px',
                      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={() =>
                        dispatch(onRemoveUnregisteredPlayer(index))
                      }
                    >
                      <KitmanIcon name="DeleteOutline" />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export const UnregisteredPlayersTableTranslated = withNamespaces()(
  UnregisteredPlayersTable
);
export default UnregisteredPlayersTable;
