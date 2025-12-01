// @flow
import { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import type { GroupedDropdownItem } from '@kitman/components/src/types';
import {
  AppStatus,
  GroupedDropdown,
  SettingWidget,
  TextButton,
} from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { WorkloadDefaultSettingsTranslated as WorkloadDefaultSettings } from '../workloadDefaultSettings';
import type { rpeCollection, ParticipationLevel } from '../../types';

type Props = {
  groupedWorkloadOptions: Array<GroupedDropdownItem>,
  primaryWorkloadVariableId: $PropertyType<GroupedDropdownItem, 'id'>,
  secondaryWorkloadVariableId: $PropertyType<GroupedDropdownItem, 'id'>,
  gameParticipationLevels: Array<ParticipationLevel>,
  trainingParticipationLevels: Array<ParticipationLevel>,
  onChangePrimaryVariable: Function,
  onChangeSecondaryVariable: Function,
  gameRpeCollection: rpeCollection,
  trainingRpeCollection: rpeCollection,
  onChangeRpeCollection: Function,
  onParticipationLevelNameChange: Function,
  onIncludeInGroupCalculationChange: Function,
  onRestoreDefaults: Function,
  onSaveForm: Function,
};

const WorkloadSettings = (props: I18nProps<Props>) => {
  const [feedbackModalStatus, setFeedbackModalStatus] = useState(null);
  const [feedbackModalMessage, setFeedbackModalMessage] = useState(null);

  const secondaryWorkloadVariables = [
    {
      name: 'None',
      id: '',
      isGroupOption: false,
    },
    ...props.groupedWorkloadOptions,
  ];

  return (
    <>
      <div className="organisationWorkloadSettings">
        <div className="organisationWorkloadSettings__title">
          <h6>{props.t('Game - Participation & RPE collection')}</h6>
        </div>

        <WorkloadDefaultSettings
          workloadType="GAME"
          rpeCollection={props.gameRpeCollection}
          participationLevels={props.gameParticipationLevels}
          onChangeRpeCollection={props.onChangeRpeCollection}
          onParticipationLevelNameChange={props.onParticipationLevelNameChange}
          onIncludeInGroupCalculationChange={
            props.onIncludeInGroupCalculationChange
          }
        />

        <div className="organisationWorkloadSettings__title">
          <h6>{props.t('Session - Participation & RPE collection')}</h6>
        </div>

        <WorkloadDefaultSettings
          workloadType="TRAINING_SESSION"
          rpeCollection={props.trainingRpeCollection}
          participationLevels={props.trainingParticipationLevels}
          onChangeRpeCollection={props.onChangeRpeCollection}
          onParticipationLevelNameChange={props.onParticipationLevelNameChange}
          onIncludeInGroupCalculationChange={
            props.onIncludeInGroupCalculationChange
          }
        />

        <div className="organisationWorkloadSettings__title">
          <h6>{props.t('Workload')}</h6>
        </div>

        <SettingWidget
          title={props.t('Workload variables')}
          onClickRestore={() => {
            setFeedbackModalStatus('warning');
            setFeedbackModalMessage('Restore Defaults?');
          }}
          kitmanDesignSystem
        >
          <ul className="organisationWorkloadSettings__info">
            <li>
              {props.t('Choose what metrics define workload in the system.')}
            </li>
            <li>
              {props.t(
                'The changes you make here will be reflected for all the users across your organisation.'
              )}
            </li>
            <li>
              {props.t('No impact on your data, simply how you look at it.')}
            </li>
          </ul>
          <div className="organisationWorkloadSettings__form">
            <div className="col-md-6 organisationWorkloadSettings__formRow">
              <GroupedDropdown
                label={props.t('Primary workload variable')}
                options={props.groupedWorkloadOptions}
                onChange={(value) => {
                  props.onChangePrimaryVariable(value.id);
                }}
                value={props.primaryWorkloadVariableId}
                searchable
              />
            </div>
            <div className="col-md-6 organisationWorkloadSettings__formRow">
              <GroupedDropdown
                label={props.t('Secondary workload variable')}
                options={secondaryWorkloadVariables}
                onChange={(value) => {
                  props.onChangeSecondaryVariable(value.id);
                }}
                value={props.secondaryWorkloadVariableId}
                searchable
              />
            </div>
          </div>
        </SettingWidget>
        <div className="organisationWorkloadSettings__stickyFooter">
          <TextButton
            type="primary"
            text={props.t('Save')}
            onClick={props.onSaveForm}
          />
        </div>
      </div>
      <AppStatus
        status={feedbackModalStatus}
        message={feedbackModalMessage}
        deleteAllButtonText={props.t('Restore')}
        hideConfirmation={() => {
          setFeedbackModalStatus(null);
          setFeedbackModalMessage(null);
        }}
        close={() => {
          setFeedbackModalStatus(null);
          setFeedbackModalMessage(null);
        }}
        confirmAction={() => {
          setFeedbackModalStatus(null);
          setFeedbackModalMessage(null);
          props.onRestoreDefaults();
        }}
      />
    </>
  );
};

export const WorkloadSettingsTranslated = withNamespaces()(WorkloadSettings);
export default WorkloadSettings;
