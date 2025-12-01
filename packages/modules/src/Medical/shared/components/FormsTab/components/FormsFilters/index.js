// @flow
import { withNamespaces } from 'react-i18next';
import type { ComponentType } from 'react';
import { Select } from '@kitman/components';
import type { SelectOption as Option } from '@kitman/components/src/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import style from '../../../styles/filters';
import type { RequestStatus } from '../../../../types';

type Props = {
  selectedFormTypeId: ?number,
  formTypes: Array<Option>,
  onChangeSelectedFormTypeId: (formId: ?number) => void,
  initialDataRequestStatus: RequestStatus,
};

const FormFiltersTab = (props: I18nProps<Props>) => {
  const formFilter = (
    <div css={style.filter}>
      <Select
        name="FormFilterSelect"
        placeholder={props.t('Form Type')}
        value={props.selectedFormTypeId}
        options={props.formTypes}
        onChange={(value) => props.onChangeSelectedFormTypeId(value)}
        isClearable
        onClear={() => props.onChangeSelectedFormTypeId(undefined)}
        isDisabled={props.initialDataRequestStatus === 'PENDING'}
        showAutoWidthDropdown
        appendToBody
        inlineShownSelection
      />
    </div>
  );

  return <div css={style.tableFilters}>{formFilter}</div>;
};

export const FormFiltersTranslated: ComponentType<Props> =
  withNamespaces()(FormFiltersTab);
export default FormFiltersTab;
