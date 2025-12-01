// @flow
/* eslint-disable camelcase */
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import {
  Avatar,
  Checkbox,
  Stack,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  IconButton,
} from '@kitman/playbook/components';
import type { VenueType } from '@kitman/modules/src/LeagueOperations/MatchMonitorApp/MatchMonitorReport/src/shared/types';
import {
  getRegisteredPlayers,
  getIsRegisteredPlayerImageModalOpen,
} from '@kitman/modules/src/LeagueOperations/MatchMonitorApp/MatchMonitorReport/src/shared/redux/selectors';
import {
  onChangeRegisteredPlayer,
  onToggleRegisteredPlayerImageModal,
} from '@kitman/modules/src/LeagueOperations/MatchMonitorApp/MatchMonitorReport/src/shared/redux/slices/matchMonitorSlice';
import { RegisteredPlayerImageModalTranslated as RegisteredPlayerImageModal } from '@kitman/modules/src/LeagueOperations/MatchMonitorApp/MatchMonitorReport/src/components/RegisteredPlayerImageModal';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';

type Props = {
  activeTeam: VenueType,
  isReadOnly: boolean,
  onDelete: (id: number) => void,
};

const RegisteredPlayersTable = (props: I18nProps<Props>) => {
  const { t, activeTeam, isReadOnly } = props;
  const dispatch = useDispatch();
  const registeredPlayers = useSelector(getRegisteredPlayers);
  const registeredAthletesBySelectedTeam = (registeredPlayers ?? [])
    .filter(({ venue_type }) => venue_type === activeTeam)
    .sort((a, b) =>
      (a.athlete?.lastname ?? '').localeCompare(b.athlete?.lastname ?? '')
    );

  const [imageModalData, setImageModalData] = useState(null);
  const isRegisteredPlayerImageModalOpen = useSelector(
    getIsRegisteredPlayerImageModalOpen
  );
  const handleOnToggleRegisteredPlayerImageModal = (isOpen, athlete = null) => {
    if (isOpen) {
      setImageModalData({
        playerName: athlete?.fullname,
        playerImage: athlete?.avatar_url || '',
      });
    } else {
      setImageModalData(null);
    }
    dispatch(onToggleRegisteredPlayerImageModal({ isOpen }));
  };

  return (
    <>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>{t('Player')}</TableCell>
              <TableCell
                sx={{
                  width: 'auto',
                  whiteSpace: 'nowrap',
                }}
              >
                {t('Compliant')}
              </TableCell>
              <TableCell
                sx={{
                  width: 'auto',
                  whiteSpace: 'nowrap',
                }}
              >
                {t('Primary')}
              </TableCell>
              {!isReadOnly && <TableCell />}
            </TableRow>
          </TableHead>
          <TableBody>
            {registeredAthletesBySelectedTeam.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  align="center"
                  sx={{ borderBottom: 'none' }}
                >
                  {t(
                    'Click add existing player button (above) to add players who are not in the squad.'
                  )}
                </TableCell>
              </TableRow>
            )}
            {registeredAthletesBySelectedTeam.map(
              ({ athlete_id, athlete, primary_squad, compliant }) => (
                <TableRow
                  key={athlete_id}
                  sx={{
                    '& td': {
                      paddingTop: '6px',
                      paddingBottom: '6px',
                    },
                  }}
                >
                  <TableCell>
                    <Stack
                      direction="row"
                      gap={1}
                      sx={{
                        alignItems: 'center',
                      }}
                    >
                      <Avatar
                        src={athlete?.avatar_url || ''}
                        sx={{ cursor: 'pointer' }}
                        onClick={() =>
                          handleOnToggleRegisteredPlayerImageModal(
                            true,
                            athlete
                          )
                        }
                      />
                      <Typography variant="body2">
                        {athlete.fullname}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell
                    sx={{
                      paddingTop: 0,
                      paddingBottom: 0,
                      width: 'auto',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <Checkbox
                      checked={compliant}
                      sx={{ marginLeft: '-9px' }}
                      disabled={isReadOnly}
                      onChange={(e) => {
                        dispatch(
                          onChangeRegisteredPlayer({
                            athlete_id,
                            checked: e.target.checked,
                          })
                        );
                      }}
                    />
                  </TableCell>
                  <TableCell
                    sx={{
                      width: 'auto',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {primary_squad?.name || '-'}
                  </TableCell>
                  {!isReadOnly && (
                    <TableCell
                      align="right"
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
                        data-testid={`delete-athlete-${athlete_id}`}
                        onClick={() => props.onDelete(athlete_id)}
                      >
                        <KitmanIcon name={KITMAN_ICON_NAMES.DeleteOutline} />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {isRegisteredPlayerImageModalOpen && (
        <RegisteredPlayerImageModal
          imageModalData={imageModalData}
          onClose={() => handleOnToggleRegisteredPlayerImageModal(false)}
        />
      )}
    </>
  );
};

export const RegisteredPlayersTableTranslated = withNamespaces()(
  RegisteredPlayersTable
);
export default RegisteredPlayersTable;
