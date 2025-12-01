/* eslint-disable camelcase */
// @flow
import { useState, useEffect } from 'react';
import type { ComponentType } from 'react';
import ReactDOM from 'react-dom';
import { withNamespaces } from 'react-i18next';
import {
  ExpandingPanel,
  TextButton,
  InputTextField,
  AppStatus,
  ColorPicker,
} from '@kitman/components';
import addGroupsToRehabSessionExercise from '@kitman/services/src/services/rehab/addGroupsToRehabSessionExercise';
import createRehabGroup from '@kitman/services/src/services/rehab/createRehabGroup';
import getRehabGroups from '@kitman/services/src/services/rehab/getRehabGroups';
import removeGroupFromRehabSessionExercise from '@kitman/services/src/services/rehab/removeGroupFromRehabSessionExercise';
import type { RehabGroupAssociationData } from '@kitman/services/src/services/rehab/addGroupsToRehabSessionExercise';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import RehabGroup from './Components/RehabGroup';

import type {
  CreateRehabGroup,
  RehabGroup as RehabGroupType,
} from '../../types';

import useRehabGroupExercisesForm from './hooks/useRehabGroupExercisesForm';
import type { RequestStatus } from '../../../../types';
import style from './style';

export type Props = {
  onClose: Function,
  isOpen: boolean,
  selectedExercises: Array<number>,
};

const RehabGroupsSidePanel = (props: I18nProps<Props>) => {
  const [requestStatus, setRequestStatus] = useState<RequestStatus>(null);
  const [rehabGroups, setRehabGroups] = useState<Array<RehabGroupType>>([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [rehydrateGroups, setRehydrateGroups] = useState(false);
  const { formState, dispatch } = useRehabGroupExercisesForm();

  useEffect(() => {
    getRehabGroups()
      .then((data) => {
        setRehabGroups(data);
      })
      .catch(() => {
        setErrorMessage('Failed to retrieve Groups');
      });
  }, [rehydrateGroups]);

  const onSaveRehabGroups = async () => {
    const groupAlreadyExists = !!formState.tag_ids.length; // If true just hit one endpoint (associate group with exercise)
    setRequestStatus('PENDING');
    setErrorMessage('Error saving Group');

    // Create a new group/tag
    const newGroupData: CreateRehabGroup = {
      name: formState.group.name || '',
      theme_colour: formState.group.theme_colour || '',
      scope: 'Default',
    };

    // Associate group (new or existing) with an exercise
    const data: RehabGroupAssociationData = {
      session_exercise_ids: props.selectedExercises || [],
      tag_ids: [],
    };

    // eslint-disable-next-line no-unused-expressions
    groupAlreadyExists
      ? addGroupsToRehabSessionExercise({
          ...data,
          tag_ids: formState.tag_ids,
        })
          .then(() => {
            setRequestStatus('SUCCESS');
          })
          .catch(() => {
            setErrorMessage('Unable to group exercises');
            setRequestStatus('FAILURE');
          })
      : createRehabGroup(newGroupData)
          .then((newGroup) => {
            addGroupsToRehabSessionExercise({
              ...data,
              tag_ids: [...data.tag_ids, newGroup.id],
            })
              .then(() => {
                setRequestStatus('SUCCESS');
              })
              .catch(() => {
                setErrorMessage('Unable to group exercises');
                setRequestStatus('FAILURE');
              });
          })
          .catch(() => {
            setRequestStatus('FAILURE');
          });
    props.onClose();
  };

  // Used for existing groups/tags
  const onSelectedGroupChange = (id: number) => {
    const checkboxAlreadySelected = formState.tag_ids[0] === id;
    dispatch({
      type: 'SET_REHAB_GROUP_ID',
      tag_ids: checkboxAlreadySelected ? [] : [id],
    });
  };

  const onSelectedGroupArchive = (id: number) => {
    removeGroupFromRehabSessionExercise(id)
      .then(() => {
        setRequestStatus('SUCCESS');
        setRehydrateGroups((prev) => !prev); // Groups data is re-requested when this state flips
      })
      .catch(() => {
        setErrorMessage('Unable to archive group');
        setRequestStatus('FAILURE');
      });
  };

  // Used for new Group creation
  const onNameChange = ({ name }: { name: string }) => {
    dispatch({
      type: 'SET_REHAB_GROUP_NAME',
      group: { ...formState.group, name },
    });
  };

  const onColorChange = ({ theme_colour }: { theme_colour: string }) => {
    dispatch({
      type: 'SET_REHAB_GROUP_COLOR',
      group: {
        ...formState.group,
        theme_colour,
      },
    });
  };

  const getInnerContent = () => {
    const checkboxIsSelected = formState.tag_ids[0]; // Indicates that one of the checkboxes is selected
    const newGroupInProgress = formState.group.name; // Indicates text was inputted into new group input
    return (
      <>
        <div
          css={[
            style.rehabGroupsContainer,
            checkboxIsSelected && style.disabledContent,
          ]}
        >
          <InputTextField
            label={props.t('New group')}
            value={formState.group.name}
            onChange={(name) => onNameChange({ name: name.target.value })}
            kitmanDesignSystem
          />
          <ColorPicker
            onDeleteColor={() => {}}
            onChange={(colour) => onColorChange({ theme_colour: colour })}
          />
        </div>

        <div
          data-testid="RehabGroupContainer"
          css={newGroupInProgress && style.disabledContent}
        >
          {rehabGroups?.map(
            (group, index) =>
              index < 3 && (
                <RehabGroup
                  key={group.name}
                  data={group}
                  t={props.t}
                  isSelected={formState.tag_ids[0]}
                  onGroupSelected={onSelectedGroupChange}
                  onSelectedGroupArchive={onSelectedGroupArchive}
                />
              )
          )}
        </div>
      </>
    );
  };

  return ReactDOM.createPortal(
    <div css={style.rehabGroupsPanel} data-testid="Rehab|GroupsPanel">
      <ExpandingPanel
        width={436}
        isOpen={props.isOpen}
        onClose={props.onClose}
        title={props.t('Groups')}
      >
        {getInnerContent()}
        <div
          css={style.panelActionStyles}
          data-testid="RehabGroups|Actions|save"
        >
          <TextButton
            onClick={onSaveRehabGroups}
            text={props.t('Save')}
            type="primary"
            kitmanDesignSystem
            isDisabled={requestStatus === 'PENDING'}
          />
        </div>

        {requestStatus === 'FAILURE' && (
          <AppStatus status="error" message={errorMessage} />
        )}
      </ExpandingPanel>
    </div>,
    document.getElementById('issueMedicalProfile-Slideout')
  );
};
export const RehabGroupsSidePanelTranslated: ComponentType<Props> =
  withNamespaces()(RehabGroupsSidePanel);
export default RehabGroupsSidePanel;
