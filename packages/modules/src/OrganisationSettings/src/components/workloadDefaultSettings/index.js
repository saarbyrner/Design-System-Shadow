// @flow
import { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import {
  ToggleSwitch,
  Checkbox,
  ChooseNameModal,
  SettingWidget,
} from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { rpeCollection, ParticipationLevel } from '../../types';

type Props = {
  workloadType: 'GAME' | 'TRAINING_SESSION',
  rpeCollection: rpeCollection,
  participationLevels: Array<ParticipationLevel>,
  onChangeRpeCollection: Function,
  onParticipationLevelNameChange: Function,
  onIncludeInGroupCalculationChange: Function,
};

const WorkloadDefaultSettings = (props: I18nProps<Props>) => {
  const [renameModal, setRenameModal] = useState({
    isOpen: false,
    participationLevelId: null,
    value: '',
  });

  const closeRenameModal = () => {
    setRenameModal({
      isOpen: false,
      participationLevelId: null,
      value: '',
    });
  };

  const getWidgetTitle = () => {
    if (props.workloadType === 'GAME') {
      return props.t('Game defaults');
    }

    return props.t('Session defaults');
  };

  const getCanonicalParticipationLevelName = (canonicalParticipationLevel) => {
    switch (canonicalParticipationLevel) {
      case 'full':
        return props.t('Full');
      case 'partial':
        return props.t('Partial');
      case 'modified':
        return props.t('Modified');
      case 'none':
        return props.t('None');
      default:
        return '';
    }
  };

  const renderParticipationLevelRows = () => {
    return props.participationLevels.map((participationLevel) => (
      <tr key={participationLevel.id}>
        <td>
          {participationLevel.name}
          <button
            type="button"
            onClick={() => {
              setRenameModal({
                isOpen: true,
                participationLevelId: participationLevel.id,
                value: participationLevel.name,
              });
            }}
            className="icon-edit-name organisationWorkloadSettings__renamebutton"
          />
        </td>
        <td>
          {getCanonicalParticipationLevelName(
            participationLevel.canonical_participation_level
          )}
        </td>

        <td className="text-center">
          <ToggleSwitch
            isSwitchedOn={participationLevel.include_in_group_calculations}
            toggle={() =>
              props.onIncludeInGroupCalculationChange(
                props.workloadType,
                participationLevel.id
              )
            }
            isDisabled={
              participationLevel.canonical_participation_level === 'none'
            }
          />
        </td>
      </tr>
    ));
  };

  return (
    <SettingWidget title={getWidgetTitle()} kitmanDesignSystem>
      <table className="table km-table">
        <thead>
          <tr>
            <th>{props.t('Participation level')}</th>
            <th>{props.t('Participation')}</th>
            <th className="w-25 text-center">
              {props.t('Include in group calculations')}
            </th>
          </tr>
        </thead>
        <tbody>{renderParticipationLevelRows()}</tbody>
      </table>

      <div className="organisationWorkloadSettings__widgetContentDivider" />

      <h3 className="organisationWorkloadSettings__widgetSubSectionTitle">
        {props.t('RPE collection channels')}
      </h3>

      {props.t('How do you want to collect RPEs?')}

      <div className="organisationWorkloadSettings__rpeCollectionCheckbox">
        <Checkbox
          id="rpe_collection_kiosk"
          label={props.t('Kiosk app')}
          isChecked={props.rpeCollection.kioskApp}
          toggle={(checkbox) =>
            props.onChangeRpeCollection(
              props.workloadType,
              'KIOSK_APP',
              checkbox.checked
            )
          }
        />
      </div>

      <div className="organisationWorkloadSettings__rpeCollectionCheckbox">
        <Checkbox
          id="rpe_collection_athlete_app"
          label={props.t('Athlete app')}
          isChecked={props.rpeCollection.athleteApp}
          toggle={(checkbox) =>
            props.onChangeRpeCollection(
              props.workloadType,
              'ATHLETE_APP',
              checkbox.checked
            )
          }
        />
      </div>

      <ChooseNameModal
        title={props.t('Rename Participation')}
        label={props.t('Participation Name')}
        isOpen={renameModal.isOpen}
        closeModal={() => closeRenameModal()}
        value={renameModal.value}
        onChange={(value) =>
          setRenameModal({
            ...renameModal,
            value,
          })
        }
        onConfirm={(value) => {
          props.onParticipationLevelNameChange(
            props.workloadType,
            renameModal.participationLevelId,
            value
          );
          closeRenameModal();
        }}
        actionButtonText={props.t('Confirm')}
        customEmptyMessage={props.t('A name is required.')}
        maxLength={32}
        customValidations={[
          (text) => {
            const participationLevelsWithTheSameName =
              props.participationLevels.filter(
                (participationLevel) =>
                  participationLevel.id !== renameModal.participationLevelId &&
                  participationLevel.name === text
              );

            return {
              isValid: participationLevelsWithTheSameName.length === 0,
              message: props.t('Name already in use'),
            };
          },
        ]}
      />
    </SettingWidget>
  );
};

export const WorkloadDefaultSettingsTranslated = withNamespaces()(
  WorkloadDefaultSettings
);
export default WorkloadDefaultSettings;
