// @flow
import { useState } from 'react';
import { FormFiltersTranslated as FormFilters } from '@kitman/modules/src/Medical/shared/components/FormsTab/components/FormsFilters';
import { useGetFormTypesQuery } from '@kitman/modules/src/Medical/shared/redux/services/medical';

// Types:
import type { FormAnswersSetsFilters } from '@kitman/services/src/services/formAnswerSets/api/types';

type Props = {
  athleteId?: number,
  category: string,
  onChangeFilter: (alteredFilter: FormAnswersSetsFilters) => void,
};

const FormsFiltersContainer = (props: Props) => {
  const {
    data: forms = [],
    error: getFormsErrors,
    isLoading: areFormsLoading,
  } = useGetFormTypesQuery({ category: props.category });

  const [selectedFormTypeId, setSelectedFormTypeId] = useState<?number>(null);

  const getInitialDataRequestStatus = () => {
    if (getFormsErrors) {
      return 'FAILURE';
    }
    if (areFormsLoading) {
      return 'PENDING';
    }
    return null;
  };

  return (
    <FormFilters
      {...props}
      selectedFormTypeId={selectedFormTypeId}
      formTypes={forms.map(({ id, name }) => ({
        value: id,
        label: name,
      }))}
      onChangeSelectedFormTypeId={(id: ?number) => {
        setSelectedFormTypeId(id);
        if (id != null) {
          const selectedFormData = forms.find((form) => form.id === id);
          if (selectedFormData) {
            props.onChangeFilter({
              athlete_id: props.athleteId,
              category: selectedFormData.category,
              group: selectedFormData.group,
              form_type: selectedFormData.form_type,
              key: selectedFormData.key,
            });
            return;
          }
        }
        props.onChangeFilter({
          athleteId: props.athleteId,
          category: props.category,
        });
      }}
      initialDataRequestStatus={getInitialDataRequestStatus()}
    />
  );
};

export default FormsFiltersContainer;
