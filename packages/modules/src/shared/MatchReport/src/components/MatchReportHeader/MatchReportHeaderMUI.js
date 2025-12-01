// @flow
import moment from 'moment-timezone';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { Game } from '@kitman/common/src/types/Event';
import { Stack, Typography, Button } from '@kitman/playbook/components';
import colors from '@kitman/common/src/variables/colors';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import useWindowSize from '@kitman/common/src/hooks/useWindowSize';
import { KitmanIcon } from '@kitman/playbook/icons';

import {
  formatMatchReportDate,
  getMatchReportEventName,
} from '../../utils/matchReportUtils';

type Props = {
  event: ?Game,
  areHeaderButtonsDisabled?: boolean,
  isEditMode?: boolean,
  enableEditMode: () => void,
  handleOnSaveReport: ({ isSubmit: boolean }) => void,
  handleRevertingReportChanges: () => void,
};
const MatchReportHeaderMUI = (props: I18nProps<Props>) => {
  const { permissions } = usePermissions();
  const { isLeague } = useLeagueOperations();
  const { windowWidth, tabletSize } = useWindowSize();

  const isSmallDevice = windowWidth < tabletSize;

  const subTitleStyling = {
    fontSize: '14px',
    fontWeight: '400',
    color: colors.grey_200,
  };

  const mobileButtonStyling = {
    minWidth: '40px',
    width: '40px',
    height: '40px',
    padding: '0',
  };
  const headerButtonStyling = {
    fontSize: '14px',
    fontWeight: '600',
    width: '65px',
    height: '36px',
  };

  const getEventDateTimeInfo = () => {
    const startOrgDate = moment.tz(
      props.event?.start_date,
      props.event?.local_timezone
    );
    return `${formatMatchReportDate(startOrgDate, true)} ${
      props.event?.local_timezone ? props.event?.local_timezone : ''
    }`;
  };

  const renderReportTitle = () => {
    return (
      <Stack
        sx={{
          flexDirection: 'column',
          width: isSmallDevice ? '222px' : 'auto',
        }}
      >
        <Typography
          sx={{
            ...subTitleStyling,
            fontSize: '24px',
          }}
        >
          {getMatchReportEventName(props.event)}
        </Typography>
        <Typography sx={{ ...subTitleStyling }}>
          {getEventDateTimeInfo()} | {props.event?.event_location} | Match no.{' '}
          {props.event?.mls_game_key}
        </Typography>
      </Stack>
    );
  };

  const renderSubmitButton = ({ adminView }: { adminView: boolean }) => {
    const submitButtonStyling = adminView
      ? headerButtonStyling
      : { ...headerButtonStyling, width: '83px', marginLeft: '10px' };

    const buttonStyling = isSmallDevice
      ? mobileButtonStyling
      : submitButtonStyling;

    const buttonText = adminView ? props.t('Save') : props.t('Submit');
    const buttonIcon = adminView ? (
      <KitmanIcon name="SaveOutlined" fontSize="small" />
    ) : (
      <KitmanIcon name="SendOutlined" fontSize="small" />
    );

    return (
      <Button
        sx={buttonStyling}
        onClick={() => props.handleOnSaveReport({ isSubmit: true })}
        variant="contained"
        color="primary"
        disabled={props.areHeaderButtonsDisabled}
      >
        {isSmallDevice ? buttonIcon : buttonText}
      </Button>
    );
  };

  const renderLeagueEditButtons = () => {
    if (props.isEditMode) {
      const cancelButtonStyling = isSmallDevice
        ? mobileButtonStyling
        : { ...headerButtonStyling, width: '79px' };

      return (
        <Stack sx={{ flexDirection: 'row' }}>
          <Button
            sx={{ ...cancelButtonStyling, marginRight: '10px' }}
            variant="contained"
            color="secondary"
            onClick={props.handleRevertingReportChanges}
          >
            {isSmallDevice ? (
              <KitmanIcon name="Close" fontSize="small" />
            ) : (
              props.t('Cancel')
            )}
          </Button>
          {renderSubmitButton({ adminView: true })}
        </Stack>
      );
    }

    return (
      <Button
        sx={
          isSmallDevice
            ? mobileButtonStyling
            : { ...headerButtonStyling, width: '60px' }
        }
        variant="contained"
        color="primary"
        onClick={props.enableEditMode}
      >
        {isSmallDevice ? (
          <KitmanIcon name="Edit" fontSize="small" />
        ) : (
          props.t('Edit')
        )}
      </Button>
    );
  };

  const renderOfficialsHeaderButtons = () => {
    const saveButtonStyling = isSmallDevice
      ? mobileButtonStyling
      : headerButtonStyling;
    return (
      <Stack sx={{ flexDirection: 'row' }}>
        <Button
          sx={{ ...saveButtonStyling, marginRight: '10px' }}
          onClick={props.handleOnSaveReport}
          variant="contained"
          color="secondary"
          disabled={props.areHeaderButtonsDisabled}
        >
          {isSmallDevice ? (
            <KitmanIcon name="SaveOutlined" fontSize="small" />
          ) : (
            props.t('Save')
          )}
        </Button>
        {renderSubmitButton({ adminView: false })}
      </Stack>
    );
  };

  const renderReportHeaderButtons = () => {
    if (!permissions.leagueGame?.manageMatchReport) return null;
    if (isLeague) return renderLeagueEditButtons();

    return renderOfficialsHeaderButtons();
  };

  return (
    <Stack
      sx={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: '16px 24px',
        borderBottom: `1px solid ${colors.grey_200_12}`,
        marginBottom: '5px',
      }}
    >
      {renderReportTitle()}
      {renderReportHeaderButtons()}
    </Stack>
  );
};

export const MatchReportHeaderMUITranslated: ComponentType<Props> =
  withNamespaces()(MatchReportHeaderMUI);

export default MatchReportHeaderMUI;
