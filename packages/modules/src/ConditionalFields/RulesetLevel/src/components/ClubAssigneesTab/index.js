// @flow
import { useSelector, useDispatch } from 'react-redux';
import { css } from '@emotion/react';
import { withNamespaces } from 'react-i18next';

import { AppStatus, TextButton } from '@kitman/components';

import { add as createToast } from '@kitman/modules/src/Toasts/toastsSlice';

import TabLayout from '@kitman/components/src/TabLayout';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import {
  selectEditMode,
  selectFetchedAssignments,
  selectAssignments,
  updateEditMode,
  resetAssignees,
} from '../../../../shared/redux/slices/assigneesSlice';

import {
  useFetchRulesetQuery,
  useUpdateAssigneesMutation,
} from '../../../../shared/services/conditionalFields';

import ConditionalFieldsGrid from '../../../../shared/components/ConditionalFieldsGrid';

import useAssigneesGrid from '../../../../shared/hooks/useAssigneesGrid';

import type { RulesetLevelProps } from '../../../../shared/types';

const style = {
  actions: css`
    display: flex;
    gap: 0.5rem;
    margin-right: 24px;
  `,
};

const ClubAssigneesTab = ({ rulesetId, t }: I18nProps<RulesetLevelProps>) => {
  const dispatch = useDispatch();
  const editMode = useSelector(selectEditMode);
  const fetchedAssignments = useSelector(selectFetchedAssignments);
  const assignments = useSelector(selectAssignments);

  const {
    data: {
      versions: rulesetVersions = [],
      current_version: rulesetCurrentVersion,
    } = {
      current_version: null,
    },
    isFetching: isRulesetFetching,
  } = useFetchRulesetQuery(rulesetId, {
    skip: !rulesetId,
  });

  const rulesetCurrentVersionId = rulesetVersions.filter(
    (rulesetVersion) => rulesetVersion.version === rulesetCurrentVersion
  )[0]?.id;

  const { grid, isAssigneesError, areAssigneesFetching } = useAssigneesGrid({
    rulesetCurrentVersionId,
  });

  const [updateAssignees, { isLoading: isUpdating }] =
    useUpdateAssigneesMutation();

  // filter out assignments that haven't changed since the last fetch
  const changesOnly = assignments.filter(({ squad_id: squadId, active }) => {
    return !fetchedAssignments.some(
      ({ squad_id: fetchedSquadId, active: fetchedActive }) =>
        squadId === fetchedSquadId && active === fetchedActive
    );
  });

  const handleUpdateAssignees = () => {
    updateAssignees({
      rulesetCurrentVersionId,
      assignments: changesOnly,
    }).then(({ data: { screening_ruleset_version_id: id } }) => {
      dispatch(updateEditMode(false));
      dispatch(
        createToast({
          id: `updateAssignees_${id}`,
          title: t('Assignees updated successfully'),
          status: 'SUCCESS',
        })
      );
    });
  };

  const renderContent = () => {
    if (isAssigneesError) {
      return <AppStatus status="error" />;
    }
    if (isRulesetFetching || areAssigneesFetching) {
      return <TabLayout.Loading />;
    }
    return (
      <ConditionalFieldsGrid
        gridId={grid.id}
        grid={grid}
        isFullyLoaded
        emptyTableText={grid.emptyTableText}
        rowActions={null}
        isLoading={areAssigneesFetching}
      />
    );
  };

  return (
    <TabLayout>
      <TabLayout.Body>
        <TabLayout.Header>
          <TabLayout.Title>{t('Assignees')}</TabLayout.Title>
          <div css={style.actions}>
            {!editMode && (
              <TextButton
                type="secondary"
                text={t('Edit')}
                isDisabled={!assignments.length}
                onClick={() => {
                  dispatch(updateEditMode(true));
                }}
                kitmanDesignSystem
              />
            )}
            {editMode && (
              <>
                <TextButton
                  type="primary"
                  text={isUpdating ? t('Saving...') : t('Save')}
                  isDisabled={isUpdating || changesOnly.length === 0}
                  onClick={handleUpdateAssignees}
                  kitmanDesignSystem
                />
                <TextButton
                  type="secondary"
                  text={t('Discard changes')}
                  isDisabled={isUpdating || changesOnly.length === 0}
                  onClick={() => {
                    dispatch(resetAssignees());
                  }}
                  kitmanDesignSystem
                />
              </>
            )}
          </div>
        </TabLayout.Header>
        <TabLayout.Content>{renderContent()}</TabLayout.Content>
      </TabLayout.Body>
    </TabLayout>
  );
};

export const ClubAssigneesTabTranslated = withNamespaces()(ClubAssigneesTab);
export default ClubAssigneesTab;
