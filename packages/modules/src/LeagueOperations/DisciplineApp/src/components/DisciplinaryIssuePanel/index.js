// @flow
import { useSelector, useDispatch } from 'react-redux';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { withNamespaces } from 'react-i18next';
import moment from 'moment';
import {
  Drawer,
  TextField,
  DatePicker,
  Grid2 as Grid,
  Stack,
  Divider,
  FormHelperText,
} from '@kitman/playbook/components';
import { useTheme } from '@kitman/playbook/hooks';
import { drawerMixin } from '@kitman/modules/src/UserMovement/shared/mixins';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import {
  onSetDisciplinaryIssueDetails,
  onReset,
} from '@kitman/modules/src/LeagueOperations/shared/redux/slices/disciplinaryIssueSlice';
import {
  getIsCreatePanelOpen,
  getIsUpdatePanelOpen,
  getDisciplineProfile,
  getCurrentDisciplinaryIssue,
  getDisciplinaryIssueMode,
} from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/disciplinaryIssueSelectors';
import ManageSectionLayout from '@kitman/modules/src/LeagueOperations/shared/layouts/ManageSectionLayout';
import type {
  DisciplineProfile,
  CreateDisciplinaryIssueParams,
  DisciplinaryIssueParam,
  DisciplinaryIssueMode,
} from '@kitman/modules/src/LeagueOperations/shared/types/discipline';
import { getOrganisation } from '@kitman/common/src/redux/global/selectors';
import { getSuspensionOptions } from '@kitman/modules/src/LeagueOperations/DisciplineApp/utils';
import { UPDATE_DISCIPLINARY_ISSUE } from '@kitman/modules/src/LeagueOperations/shared/consts';
import GenericRadioGroup from '../GenericRadioGroup/GenericRadioGroup';
import { DisciplineReasonsDropdownTranslated as DisciplineReasonsDropdown } from '../DisciplineReasonsDropdown';
import { DisciplineCompetitionDropdownTranslated as DisciplineCompetitionDropdown } from '../DisciplineCompetitionDropdown';
import DisciplineUserDropdown from '../DisciplineUserDropdown';
import SuspensionByNumberOfGames from '../SuspensionByNumberOfGames/SuspensionByNumberOfGames';
import { ActionsTranslated as Actions } from '../Actions';

type Props = {
  userType: 'athlete' | 'staff',
};

const DisciplinaryIssuePanel = (props: I18nProps<Props>) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { userType } = props;
  const currentOrganisation = useSelector(getOrganisation());

  const panelMode: DisciplinaryIssueMode = useSelector(
    getDisciplinaryIssueMode
  );
  const isUpdateMode = panelMode === UPDATE_DISCIPLINARY_ISSUE;
  const isOpen = useSelector(
    isUpdateMode ? getIsUpdatePanelOpen : getIsCreatePanelOpen
  );
  const profile: ?DisciplineProfile = useSelector(getDisciplineProfile);
  const issue: ?CreateDisciplinaryIssueParams = useSelector(
    getCurrentDisciplinaryIssue
  );
  const getLocaleFormate =
    window.getFlag('league-ops-discipline-area-v2') &&
    currentOrganisation?.locale === 'en-US'
      ? 'MM/DD/YYYY'
      : 'DD/MM/YYYY';

  const onIssueChange = (key: string, value: ?DisciplinaryIssueParam) => {
    dispatch(onSetDisciplinaryIssueDetails({ [(key: string)]: value }));
  };

  const handleOnClose = () => {
    dispatch(onReset());
  };

  const handleSuspensionTypeChange = (newValue) => {
    if (!newValue) return;
    // update the issue kind
    dispatch(
      onSetDisciplinaryIssueDetails({
        kind: newValue,
      })
    );
  };

  const getPanelTitle = () => {
    if (isUpdateMode) {
      return profile
        ? `${props.t('Edit Suspension')} ${profile?.name}`
        : props.t('Edit Suspension');
    }
    return profile
      ? `${props.t('Suspend')} ${profile?.name}`
      : props.t('Suspension');
  };

  const renderDatePickers = () => {
    return (
      issue && (
        <>
          <Grid xs={6}>
            <DatePicker
              label={props.t('Start date')}
              format={getLocaleFormate}
              value={
                issue.start_date &&
                moment(issue.start_date, DateFormatter.dateTransferFormat)
              }
              {...(issue.end_date ? { maxDate: moment(issue.end_date) } : {})}
              onChange={(newDate) => {
                if (!newDate) return;
                onIssueChange(
                  'start_date',
                  newDate.format(DateFormatter.dateTransferFormat)
                );
              }}
            />
          </Grid>
          <Grid xs={6}>
            <DatePicker
              label={props.t('End date')}
              value={
                issue.end_date &&
                moment(issue.end_date, DateFormatter.dateTransferFormat)
              }
              {...(issue.start_date
                ? {
                    minDate: moment(issue.start_date),
                  }
                : {})}
              onChange={(newDate) =>
                onIssueChange(
                  'end_date',
                  newDate.endOf('day').format(DateFormatter.dateTransferFormat)
                )
              }
              format={getLocaleFormate}
            />
            <FormHelperText
              sx={{ whiteSpace: 'normal', wordWrap: 'break-word' }}
            >
              {props.t(
                'Suspension will remain active until midnight on end date'
              )}
            </FormHelperText>
          </Grid>
        </>
      )
    );
  };

  const renderContent = () => {
    if (!isOpen) return null;
    return (
      <ManageSectionLayout>
        <ManageSectionLayout.Title
          title={getPanelTitle()}
          onClose={handleOnClose}
        />
        <ManageSectionLayout.Content>
          <Grid container spacing={2} sx={{ paddingLeft: '1rem' }}>
            {issue && (
              <>
                {profile === null && (
                  <Grid xs={12}>
                    <DisciplineUserDropdown
                      label={props.t('User')}
                      selectedAthleteId={issue.user_id}
                      userType={userType}
                      onChange={(id) => {
                        onIssueChange('user_id', id);
                      }}
                    />
                  </Grid>
                )}
                <Grid xs={12}>
                  <DisciplineReasonsDropdown
                    id="discipline-reasons-dropdown"
                    label={props.t('Reason')}
                    selectedDisciplinaryReasons={issue.reason_ids}
                    onChange={({ target }) => {
                      onIssueChange('reason_ids', target.value);
                    }}
                  />
                </Grid>
                {window.getFlag('league-ops-discipline-area-v2') && (
                  <Grid xs={12}>
                    <DisciplineCompetitionDropdown
                      id="discipline-competition-dropdown"
                      label={props.t('Competition')}
                      selectedDisciplineCompetitions={issue.competition_ids}
                      onChange={(values) =>
                        onIssueChange('competition_ids', values)
                      }
                    />
                  </Grid>
                )}
                {window.getFlag('league-ops-discipline-area-v2') ? (
                  <>
                    <Grid xs={12}>
                      <GenericRadioGroup
                        title={props.t('Suspension type')}
                        options={getSuspensionOptions()}
                        selectedValue={issue.kind || 'date_range'}
                        onChange={handleSuspensionTypeChange}
                      />
                    </Grid>

                    <Stack direction="row" gap={2} width="100%">
                      <Divider orientation="vertical" />
                      {issue.kind === 'date_range' && renderDatePickers()}
                      {issue.kind === 'number_of_games' && (
                        <SuspensionByNumberOfGames
                          onIssueChange={onIssueChange}
                          locale={currentOrganisation?.locale}
                          issue={issue}
                        />
                      )}
                    </Stack>
                  </>
                ) : (
                  renderDatePickers()
                )}
                <Grid xs={12}>
                  <TextField
                    label={props.t('Notes (optional)')}
                    value={issue.note}
                    fullWidth
                    onChange={(event) => {
                      onIssueChange('note', event.target.value);
                    }}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </ManageSectionLayout.Content>
        <ManageSectionLayout.Actions>
          <Actions />
        </ManageSectionLayout.Actions>
      </ManageSectionLayout>
    );
  };

  return (
    <Drawer
      open={isOpen}
      anchor="right"
      onClose={handleOnClose}
      sx={drawerMixin({ theme, isOpen })}
    >
      {renderContent()}
    </Drawer>
  );
};
export default DisciplinaryIssuePanel;

export const DisciplinaryIssuePanelTranslated = withNamespaces()(
  DisciplinaryIssuePanel
);
