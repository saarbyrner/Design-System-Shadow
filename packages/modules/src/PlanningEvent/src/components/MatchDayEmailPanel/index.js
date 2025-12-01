// @flow
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import escape from 'lodash/escape';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import {
  Drawer,
  Grid2 as Grid,
  Divider,
  Box,
  Button,
  Switch,
  FormControlLabel,
  ConfirmationModal,
  DialogContentText,
} from '@kitman/playbook/components';
import { InputTextField, Textarea } from '@kitman/components';
import { sendMatchNoticeEmail, createMatchDayPdf } from '@kitman/services';
import { useTheme } from '@kitman/playbook/hooks';
import { drawerMixin } from '@kitman/playbook/mixins/drawerMixins';
import copyToClipboard from 'copy-to-clipboard';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import {
  onReset,
  onTogglePanel,
} from '@kitman/modules/src/PlanningEvent/src/redux/slices/matchDayEmailSlice';
import type { MatchDayEmailPanelMode } from '@kitman/modules/src/PlanningEvent/src/redux/slices/matchDayEmailSlice';
import { getIsPanelOpen } from '@kitman/modules/src/PlanningEvent/src/redux/selectors/matchDayEmailSelectors';
import DrawerLayout from '@kitman/playbook/layouts/Drawer';
import { MatchDayEmailRecipientsDropdownTranslated as MatchDayEmailRecipientsDropdown } from '@kitman/modules/src/PlanningEvent/src/components/MatchDayEmailRecipientDropdown';
import { toastStatusEnumLike } from '@kitman/components/src/Toast/enum-likes';
import { add } from '@kitman/modules/src/Toasts/toastsSlice';
import { Printable } from '@kitman/printing/src/renderers';
import {
  MatchDayRosterReport,
  MatchDayNoticeReport,
} from '@kitman/printing/src/templates';
import { getActiveSquad } from '@kitman/common/src/redux/global/selectors';
import usePdfTemplate from '@kitman/modules/src/PlanningEvent/src/hooks/usePdfTemplate';
import {
  planningEventApi,
  TAGS as planningEventTags,
} from '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/planningEventApi';
import saveEvent from '@kitman/modules/src/PlanningEvent/src/services/saveEvent';
import { type SetState } from '@kitman/common/src/types/react';
import type { Event } from '@kitman/common/src/types/Event';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';
import { useGetOrganisationQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { colors } from '@kitman/common/src/variables';

import { getViewerPageLink } from '../../helpers/utils';
import { getMatchDayView } from '../../redux/selectors/planningEventSelectors';

type Props = {
  eventId: number,
  leagueEvent: Event,
  homeTeam: string,
  awayTeam: string,
  startDate: string,
  roundNumber: string,
  mlsGameKey: string,
  onUpdateLeagueEvent: SetState<Event>,
};

const dmrEmailStates = {
  disabled: 'disabled',
  enabled: 'enabled',
  disableConfirmation: 'disableConfirmation',
  pending: 'pending',
};

const MatchDayEmailPanel = ({
  t,
  eventId,
  leagueEvent,
  homeTeam,
  awayTeam,
  startDate,
  roundNumber,
  mlsGameKey,
  onUpdateLeagueEvent,
}: I18nProps<Props>) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { isAssociationAdmin } = useLeagueOperations();
  const { division } = useSelector(getActiveSquad());
  const { preferences } = usePreferences();

  const matchDayMode: MatchDayEmailPanelMode = useSelector(
    getMatchDayView()
  ).toUpperCase();

  const { data: organisation } = useGetOrganisationQuery();

  const orgName = organisation?.name.replace(' ', '-').toLowerCase();
  const divisionName = division[0]?.name?.replace(' ', '-').toLowerCase();

  const currentDivision = division && division.length && division[0].name;
  const roundNumberString = roundNumber ? `${roundNumber} - ` : '';
  const gameKeyString = mlsGameKey ? `${mlsGameKey} ` : '';
  const { getTemplateData, templateData, isTemplateDataLoading } =
    usePdfTemplate();

  const isDmn = matchDayMode === 'DMN';
  const emailConfig = [
    {
      // is DMN
      condition: isDmn,
      subject: `${currentDivision} ${roundNumberString}${gameKeyString}– ${homeTeam} vs ${awayTeam} Notice`,
      message: t(
        [
          'All,',
          'Please find attached the MLS Match Notice for MLS{{roundNumber}} - {{startDate}} – {{homeTeam}} vs {{awayTeam}}.',
          'Clubs that fail to adhere to the kit designations in the attached MLS Match Notice are subject to sanctions.',
          'Inquiries regarding kit designations can be directed to MLS Match Notice (matchnotice@mlssoccer.com) with Alfonso Mondelo (alfonso.mondelo@mlssoccer.com) copied.',
          'Inquiries regarding operations can be directed to MLS Operations (mls.ops@mlssoccer.com).',
          'Inquiries regarding broadcast (e.g., kick times) can be directed to MLS Broadcasting (mlsbroadcast@mlssoccer.com).',
          'Thank you.',
        ].join('\n\n'),
        {
          homeTeam,
          awayTeam,
          startDate,
          roundNumber: roundNumber ? ` Matchday ${roundNumber}` : '',
        }
      ),
    },
    {
      // is DMR and viewer_page
      condition: !isDmn && preferences?.viewer_page,
      subject: `${currentDivision} ${gameKeyString}– ${homeTeam} vs ${awayTeam} Roster`,
      message: t(
        [
          'Please find the Match Roster attached for {{currentDivision}} {{mlsGameKey}}– {{homeTeam}} vs {{awayTeam}}.',
          'Roster information can also be found here:',
          '{{viewerPageLink}}',
        ].join('\n'),
        {
          currentDivision,
          mlsGameKey: gameKeyString,
          homeTeam,
          awayTeam,
          viewerPageLink: getViewerPageLink(divisionName, orgName),
          interpolation: { escapeValue: false },
        }
      ),
    },
    {
      // is DMR and league_game_team_notifications
      condition: !isDmn && preferences?.league_game_team_notifications,
      subject: `${currentDivision} ${gameKeyString}– ${homeTeam} vs ${awayTeam} Roster`,
      message: t(
        'Please find the Match Roster attached for {{currentDivision}} {{mlsGameKey}}– {{homeTeam}} vs {{awayTeam}}.',
        {
          currentDivision,
          mlsGameKey: gameKeyString,
          homeTeam,
          awayTeam,
          interpolation: { escapeValue: false },
        }
      ),
    },

    {
      // is DMR with no preferences
      condition: !isDmn,
      subject: '',
      message: '',
    },
  ].find(({ condition }) => condition) ?? { subject: '', message: '' };

  const initialSubject = emailConfig.subject;
  const initialMessage = emailConfig.message;

  const initialDmrEmailState = (): $Keys<typeof dmrEmailStates> => {
    return [null, false].includes(leagueEvent?.skip_automatic_game_team_email)
      ? dmrEmailStates.enabled
      : dmrEmailStates.disabled;
  };

  const isOpen = useSelector(getIsPanelOpen);
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [subject, setSubject] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [dmrEmailState, setDmrEmailState] = useState<
    $Keys<typeof dmrEmailStates>
  >(initialDmrEmailState());

  const shouldPrefillEmailTemplate =
    isDmn || preferences?.league_game_team_notifications;
  const shouldShowDisableEmailButton =
    !isDmn && isAssociationAdmin && preferences?.league_game_team_notifications;
  const shouldShowPreviewButton =
    window.featureFlags['league-ops-match-day-email-preview'] &&
    shouldPrefillEmailTemplate;

  const isSendButtonDisabled =
    isSendingEmail ||
    selectedRecipients.length === 0 ||
    message.length === 0 ||
    (shouldShowDisableEmailButton && dmrEmailState === dmrEmailStates.disabled);

  useEffect(() => {
    setMessage(initialMessage);
    setSubject(initialSubject);
  }, [matchDayMode, initialSubject, initialMessage]);

  const sendMatchDayEmail = (attachmentId) => {
    const attachmentIds = attachmentId ? [attachmentId] : [];
    const escapedMessage = escape(message);

    sendMatchNoticeEmail({
      eventId,
      matchNoticeType: matchDayMode.toLowerCase(),
      recipients: selectedRecipients,
      subject,
      // We need to replace the escape character with the <br> tags to update the email body.
      message: escapedMessage.replace(/\n/g, '<br>'),
      attachmentIds,
    })
      .then(() => {
        setMessage(initialMessage);
        setSubject(initialSubject);
        setIsSendingEmail(false);
        dispatch(
          planningEventApi.util.invalidateTags([
            planningEventTags.GAME_INFORMATION,
          ])
        );
        dispatch(
          add({
            status: toastStatusEnumLike.Success,
            title: t('Emails sent successfully'),
          })
        );
        dispatch(onTogglePanel({ isOpen: false }));
      })
      .catch(() => {
        setIsSendingEmail(false);
        dispatch(
          add({
            status: toastStatusEnumLike.Error,
            title: t('Failed to send emails'),
          })
        );
      });
  };

  const handleSendEmailAction = () => {
    setIsSendingEmail(true);
    createMatchDayPdf({
      eventId: Number(eventId),
      kind: matchDayMode.toLowerCase(),
    })
      .then(({ id: attachmentId }) => {
        sendMatchDayEmail(attachmentId);
      })
      .catch(() => {
        setIsSendingEmail(false);
        dispatch(
          add({
            status: toastStatusEnumLike.Error,
            title: t('Failed to send emails'),
          })
        );
      });
  };

  const handleOnClose = () => {
    dispatch(onReset());
  };

  const onChangeSelectedRecipients = (value) => {
    if (Array.isArray(value)) {
      setSelectedRecipients(value);
    } else {
      const emailNeedsAdded = !selectedRecipients.includes(value);
      if (emailNeedsAdded) {
        setSelectedRecipients([...selectedRecipients, value]);
      } else {
        setSelectedRecipients(
          selectedRecipients.filter((email) => email !== value)
        );
      }
    }
  };

  const handleDisableEmail = async (disable: boolean) => {
    try {
      setDmrEmailState(dmrEmailStates.pending);
      const updatedEvent = await saveEvent({
        event: {
          id: eventId,
          skip_automatic_game_team_email: disable,
        },
      });

      const isEmailDisabled = Boolean(
        updatedEvent?.skip_automatic_game_team_email
      );

      onUpdateLeagueEvent({
        ...leagueEvent,
        skip_automatic_game_team_email: isEmailDisabled,
      });

      setDmrEmailState(
        isEmailDisabled ? dmrEmailStates.disabled : dmrEmailStates.enabled
      );
      dispatch(
        add({
          status: toastStatusEnumLike.Success,
          title: isEmailDisabled
            ? t('DMR email is disabled')
            : t('DMR email is enabled'),
        })
      );
    } catch {
      setDmrEmailState(initialDmrEmailState());
    }
  };

  const handleCopyContacts = () => {
    const emailList = selectedRecipients.join('; ');
    copyToClipboard(emailList);
  };

  const renderContent = () => {
    if (!isOpen) return null;

    return (
      <>
        <DrawerLayout.Title title={t('Email')} onClose={handleOnClose} />
        <Divider
          sx={{ borderBottomWidth: 2, borderColor: colors.neutral_300 }}
        />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            overflow: 'auto',
            flex: '1 1 0%',
            p: 2,
          }}
        >
          <Box
            sx={{
              pb: '40px',
            }}
          >
            <MatchDayEmailRecipientsDropdown
              eventId={eventId}
              selectedRecipients={selectedRecipients}
              mode={matchDayMode}
              isTeamNotificationsFlow={
                preferences?.league_game_team_notifications ?? false
              }
              onChange={onChangeSelectedRecipients}
            />
            <Button
              color="secondary"
              onClick={handleCopyContacts}
              sx={{
                marginTop: '8px',
                display: 'flex',
                gap: '8px',
              }}
            >
              <KitmanIcon name={KITMAN_ICON_NAMES.CopyAll} />
              <span>{t('Copy contacts')}</span>
            </Button>
          </Box>
          <Divider
            sx={{
              borderBottomWidth: 2,
              borderColor: colors.neutral_300,
              mb: 2,
            }}
          />
          <Grid container spacing={1}>
            <Grid xs={12}>
              <InputTextField
                value={subject}
                label={t('Subject')}
                readonly={shouldPrefillEmailTemplate}
                onChange={(e) => {
                  if (shouldPrefillEmailTemplate) {
                    return;
                  }
                  setSubject(e.target.value);
                }}
                kitmanDesignSystem
              />
            </Grid>
            <Grid xs={12}>
              <Textarea
                value={message}
                label={t('Message')}
                name="match_day_message"
                onChange={(text) => setMessage(text)}
                kitmanDesignSystem
                style={{
                  height: isDmn ? '375px' : '100px',
                  paddingTop: '8px',
                }}
              />
            </Grid>
            {shouldShowPreviewButton && (
              <Button
                disabled={isTemplateDataLoading}
                sx={{ width: 'auto', marginTop: '8px', marginLeft: '4px' }}
                onClick={() => getTemplateData(eventId)}
              >
                {isTemplateDataLoading
                  ? `${t('Loading')}...`
                  : t('Preview attachment')}
              </Button>
            )}
          </Grid>
        </Box>
        <Divider
          sx={{ borderBottomWidth: 2, borderColor: colors.neutral_300 }}
        />
        <DrawerLayout.Actions>
          <Box
            sx={{
              display: 'flex',
              justifyContent: shouldShowDisableEmailButton
                ? 'space-between'
                : 'flex-end',
              width: '100%',
            }}
          >
            {shouldShowDisableEmailButton && (
              <FormControlLabel
                control={
                  <Switch
                    size="small"
                    disabled={dmrEmailState === dmrEmailStates.pending}
                    checked={dmrEmailState === dmrEmailStates.disabled}
                    onChange={(ev) => {
                      if (ev.target.checked) {
                        // If the switch is checked, show the confirmation modal
                        setDmrEmailState(dmrEmailStates.disableConfirmation);
                      } else {
                        handleDisableEmail(false);
                      }
                    }}
                  />
                }
                label={t('Disable email')}
              />
            )}
            <Button
              disabled={isSendButtonDisabled}
              onClick={handleSendEmailAction}
            >
              {isSendingEmail ? `${t('Sending')}...` : t('Send')}
            </Button>
          </Box>
          {window.featureFlags['league-ops-match-day-email-preview'] &&
            templateData && (
              <Printable>
                {isDmn && (
                  <MatchDayNoticeReport
                    templateData={templateData}
                    preferences={preferences}
                  />
                )}
                {!isDmn && (
                  <MatchDayRosterReport
                    templateData={templateData}
                    preferences={preferences}
                  />
                )}
              </Printable>
            )}
        </DrawerLayout.Actions>
      </>
    );
  };

  return (
    <Drawer
      open={isOpen}
      anchor="right"
      onClose={handleOnClose}
      sx={drawerMixin({ theme, isOpen, drawerWidth: 660 })}
    >
      {renderContent()}
      <ConfirmationModal
        isModalOpen={
          shouldShowDisableEmailButton &&
          dmrEmailState === dmrEmailStates.disableConfirmation
        }
        dialogContent={
          <DialogContentText>
            {t(
              'By disabling email, DMR emails will not go out and all contacts will receive an email stating that DMRs will be distributed on paper. Click disable to continue. '
            )}
          </DialogContentText>
        }
        translatedText={{
          title: t('Disable email'),
          actions: {
            ctaButton: t('Disable'),
            cancelButton: t('Cancel'),
          },
        }}
        onConfirm={() => handleDisableEmail(true)}
        onCancel={() => setDmrEmailState(initialDmrEmailState())}
        onClose={() => setDmrEmailState(initialDmrEmailState())}
        isLoading={dmrEmailState === dmrEmailStates.pending}
      />
    </Drawer>
  );
};

export default MatchDayEmailPanel;
export const MatchDayEmailPanelTranslated =
  withNamespaces()(MatchDayEmailPanel);
