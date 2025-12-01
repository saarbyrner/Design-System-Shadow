// @flow

import { useState } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@kitman/playbook/components';
import { useGetProductAreasQuery } from '@kitman/services/src/services/formTemplates';
import type { ProductArea } from '@kitman/services/src/services/formTemplates/api/types';
import { getDrawerTranslations } from './utils/helpers';

type Props = {
  categoryName: string,
  setCategoryName: (categoryName: string) => void,
  productArea: string | null,
  setProductArea: (productArea: string) => void,
  isEditMode?: boolean,
};

const selectLabelId = 'category-select-input-id';
const DB_CHARACTER_LIMIT = 100;

const DrawerContent = ({
  categoryName,
  setCategoryName,
  productArea,
  setProductArea,
  isEditMode = false,
}: Props) => {
  const { data: productAreasOptions = [] }: { data?: Array<ProductArea> } =
    useGetProductAreasQuery();
  const {
    productAreaName,
    categoryName: categoryNameTranslation,
    maxCharacters100Message,
  } = getDrawerTranslations();
  const [titleHelperText, setTitleHelperText] = useState<string>('');

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        rowGap: '1rem',
        height: '54rem',
      }}
    >
      <Box>
        <FormControl sx={{ width: '100%' }}>
          <InputLabel id={selectLabelId}>{productAreaName}</InputLabel>
          <Select
            labelId={selectLabelId}
            label={productAreaName}
            value={productArea || ''}
            readOnly={isEditMode}
            onChange={(event) => setProductArea(event.target.value)}
          >
            {productAreasOptions.map(({ name, id }) => {
              return (
                <MenuItem key={id} value={id}>
                  {name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Box>
      <Box>
        <TextField
          sx={{ width: '100%' }}
          label={categoryNameTranslation}
          value={categoryName}
          onChange={(event) => setCategoryName(event.target.value)}
          onFocus={() => setTitleHelperText(maxCharacters100Message)}
          onBlur={() => setTitleHelperText('')}
          inputProps={{ maxLength: DB_CHARACTER_LIMIT }}
          helperText={titleHelperText}
          disabled={productArea === null}
        />
      </Box>
    </Box>
  );
};

export default DrawerContent;
