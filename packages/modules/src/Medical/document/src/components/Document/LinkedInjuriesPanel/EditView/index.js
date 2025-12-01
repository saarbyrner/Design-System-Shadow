// @flow
import { type ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { Autocomplete } from '@kitman/playbook/components';
import { getGroupedAthleteIssues } from '@kitman/modules/src/Medical/shared/utils';
import {
  renderInput,
  renderCheckboxes,
} from '@kitman/playbook/utils/Autocomplete';

// Types:
import type { LegalDocument } from '@kitman/modules/src/Medical/shared/types/medical';
import type {
  LinkedIssues,
  IssueOccurrenceFDetail,
  ChronicIssue,
} from '@kitman/modules/src/Medical/shared/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { AthleteIssues } from '@kitman/services/src/services/medical/getAthleteIssues';
import { type Option } from '@kitman/components/src/Select';

type Props = {
  issues: Array<IssueOccurrenceFDetail | ChronicIssue>,
  document: LegalDocument,
  isChronic?: boolean,
  athleteIssues: AthleteIssues,
  isLoading: boolean,
  setEditedIssues: (editedIssues: LinkedIssues) => void,
};

const EditView = (props: I18nProps<Props>) => {
  const handleEditedIssues = (updatedIssues: Array<Option>) => {
    const updatedInjuries = updatedIssues.filter(
      (issue) => issue.type && issue.type === 'Injury'
    );
    const updatedIllnesses = updatedIssues.filter(
      (issue) => issue.type && issue.type === 'Illness'
    );
    const updatedChronicConditions = updatedIssues.filter(
      (issue) => issue.type && issue.type === 'ChronicCondition'
    );

    props.setEditedIssues((prevIssues) => ({
      ...prevIssues,
      ...(!props.isChronic && {
        injury_occurrence_ids: updatedInjuries.map(
          (selectedOption) => selectedOption.id
        ),
        illness_occurrence_ids: updatedIllnesses.map(
          (selectedOption) => selectedOption.id
        ),
      }),
      // $FlowIgnore[exponential-spread] need to conditionally add multiple objects here
      ...(props.isChronic && {
        chronic_issue_ids: updatedChronicConditions.map(
          (selectedOption) => selectedOption.id
        ),
      }),
    }));
  };

  const groupedAthleteIssues = getGroupedAthleteIssues({
    issues: props.athleteIssues,
  }).filter((issue) =>
    props.isChronic
      ? issue.type === 'ChronicCondition'
      : issue.type !== 'ChronicCondition'
  );

  return (
    <Autocomplete
      multiple
      disableCloseOnSelect
      sx={{ mt: 1 }}
      options={groupedAthleteIssues}
      onChange={(event, selectedOptions) => handleEditedIssues(selectedOptions)}
      fullWidth
      limitTags={2}
      size="small"
      defaultValue={groupedAthleteIssues.filter((issue) =>
        props.issues.some((item) => issue.id === item.id)
      )}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      loading={props.isLoading}
      getOptionLabel={(option) => option.label}
      renderOption={renderCheckboxes}
      renderInput={(params) =>
        renderInput({
          params,
          label: props.isChronic
            ? props.t('Chronic conditions')
            : props.t('Injury/illness'),
        })
      }
      {...(!props.isChronic && { groupBy: (option) => option.group })}
    />
  );
};

export const EditViewTranslated: ComponentType<Props> =
  withNamespaces()(EditView);
export default EditView;
