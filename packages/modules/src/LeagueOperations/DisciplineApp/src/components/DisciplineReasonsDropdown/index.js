// @flow
import { useState, useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import fetchDisciplineReasons from '@kitman/modules/src/LeagueOperations/shared/services/fetchDisciplineReasons';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@kitman/playbook/components';
import { getTranslatedDisciplineReasons } from '@kitman/modules/src/LeagueOperations/DisciplineApp/utils';

type Props = {
  id: string,
  label: string,
  selectedDisciplinaryReasons: Array<number>,
  onChange: () => void,
};

const DisciplineReasonsDropdown = (props: I18nProps<Props>) => {
  const { id, label, selectedDisciplinaryReasons, onChange } = props;
  const [disciplinaryReasons, setDisciplinaryReasons] = useState([]);

  useEffect(() => {
    fetchDisciplineReasons().then(({ data }) => {
      if (data) {
        const reasons = data.map(({ id: reasonId, reason_name: reason }) => {
          // Fallback if reason is not found in predefined list of reasons for translation
          return {
            value: reasonId,
            label:
              getTranslatedDisciplineReasons()[reason.toUpperCase()] || reason,
          };
        });
        setDisciplinaryReasons(reasons);
      }
    });
  }, []);

  return (
    <FormControl>
      <InputLabel id={`${id}-label`}>{label}</InputLabel>
      <Select
        labelId={`${id}-label`}
        id={id}
        multiple
        fullWidth
        value={selectedDisciplinaryReasons}
        onChange={onChange}
      >
        {disciplinaryReasons?.map((option) => {
          return (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default DisciplineReasonsDropdown;
export const DisciplineReasonsDropdownTranslated = withNamespaces()(
  DisciplineReasonsDropdown
);
