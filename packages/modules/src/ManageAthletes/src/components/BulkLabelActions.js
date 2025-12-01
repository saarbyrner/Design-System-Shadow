// @flow
import { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import { TextButton, Select } from '@kitman/components';
import { useGetAllLabelsQuery } from '@kitman/modules/src/OrganisationSettings/src/components/DynamicCohorts/ManageLabels/redux/services/labelsApi';
import type { Translation } from '@kitman/common/src/types/i18n';
import style from '@kitman/modules/src/ManageAthletes/src/style';
import { useManageAthletes } from '../contexts/manageAthletesContext';

const BulkLabelActions = ({ t }: { t: Translation }) => {
  const [labelsToAdd, setLabelsToAdd] = useState<Array<number>>([]);
  const [labelsToRemove, setLabelsToRemove] = useState<Array<number>>([]);

  const { data: labelOptions = [], isFetching: isLabelQueryFetching } =
    // using undefined because this endpoint does not except arguments, but we do want to pass the skip query option
    useGetAllLabelsQuery(undefined, {
      skip: !window.getFlag('labels-and-groups'),
    });

  const { selectedAthleteIds, bulkUpdateLabels } = useManageAthletes();

  return selectedAthleteIds?.length ? (
    <div css={style.bulkActions}>
      <p>
        {t('{{numSelected}} selected', {
          numSelected: selectedAthleteIds.length,
        })}
      </p>
      <div css={style.selectLength} data-testid="AssignLabelsSelect">
        <Select
          label={t('Labels to assign')}
          options={labelOptions.map((label) => ({
            value: label.id,
            label: label.name,
          }))}
          value={labelsToAdd}
          onChange={(selection) => setLabelsToAdd(selection)}
          isMulti
          isLoading={isLabelQueryFetching}
          menuPosition="fixed"
          menuPlacement="top"
          appendToBody
        />
      </div>
      <div css={style.selectLength} data-testid="RemoveLabelsSelect">
        <Select
          label={t('Labels to remove')}
          options={labelOptions.map((label) => ({
            value: label.id,
            label: label.name,
          }))}
          value={labelsToRemove}
          onChange={(selection) => setLabelsToRemove(selection)}
          isMulti
          isLoading={isLabelQueryFetching}
          menuPosition="fixed"
          menuPlacement="top"
          appendToBody
        />
      </div>

      <TextButton
        text={t('Apply')}
        type="primary"
        onClick={() => {
          bulkUpdateLabels(labelsToAdd, labelsToRemove);
          setLabelsToAdd([]);
          setLabelsToRemove([]);
        }}
        kitmanDesignSystem
      />
    </div>
  ) : null;
};

export const BulkLabelActionsTranslated = withNamespaces()(BulkLabelActions);
export default BulkLabelActions;
