// @flow

import { useDispatch } from 'react-redux';
import { Autocomplete, TextField } from '@kitman/playbook/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import type { ProductArea } from '@kitman/services/src/services/formTemplates/api/types';
import { useState } from 'react';
import { useGetProductAreasQuery } from '@kitman/services/src/services/formTemplates';
import { setProductAreaFilter } from '@kitman/modules/src/FormTemplates/redux/slices/formTemplateSettingsSlice';

type Props = {
  multiple?: boolean,
};

const ProductAreaSelector = ({ t, multiple = false }: I18nProps<Props>) => {
  const dispatch = useDispatch();
  const [productAreaSelected, setProductAreaSelected] = useState('');
  const {
    data: apiProductAreas,
    isLoading: productAreasLoading,
  }: { data: ?Array<ProductArea>, isLoading: boolean } =
    useGetProductAreasQuery();

  const formProductAreas = apiProductAreas || [];

  return (
    <Autocomplete
      inputValue={productAreaSelected}
      value={productAreaSelected}
      onChange={(event, value) => {
        setProductAreaSelected(value?.label || '');
        dispatch(setProductAreaFilter(value?.value || null));
      }}
      disabled={productAreasLoading}
      options={formProductAreas.map(({ id, name }) => {
        return {
          value: id,
          label: name,
        };
      })}
      renderInput={(params) => (
        <TextField {...params} label={t('Product area')} />
      )}
      size="small"
      sx={{ width: '20rem' }}
      onInputChange={(event, value, reason) => {
        if (reason === 'clear') setProductAreaSelected('');
      }}
      multiple={multiple}
    />
  );
};

export const ProductAreaSelectorTranslated: ComponentType<{}> =
  withNamespaces()(ProductAreaSelector);

export default ProductAreaSelector;
