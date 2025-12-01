// @flow
import { useEffect, useState, type ComponentType } from 'react';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { withNamespaces } from 'react-i18next';
import uniqBy from 'lodash/uniqBy';
import type { SxProps, Theme } from '@mui/material';
import type { Option } from '@kitman/playbook/types';
import type { SquadAthletes } from '@kitman/modules/src/ElectronicFiles/shared/types';
import type { Athlete } from '@kitman/modules/src/Medical/shared/types';
import type { PermissionsType } from '@kitman/common/src/contexts/PermissionsContext/types';
import {
  useGetPermissionsQuery,
  useGetSquadAthletesQuery,
} from '@kitman/common/src/redux/global/services/globalApi';
import { useSearchPastAthletesQuery } from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import {
  renderInput,
  renderCheckboxes as renderAutocompleteCheckboxes,
} from '@kitman/playbook/utils/Autocomplete';
import { mapSquadAthleteToOptions } from '@kitman/modules/src/ElectronicFiles/shared/utils';
import useDebouncedCallback from '@kitman/common/src/hooks/useDebouncedCallback';
import { Autocomplete } from '@kitman/playbook/components';

type Props = {
  label: string,
  placeholder?: string,
  value: Option | Array<Option>,
  onChange: (value: Option & Array<Option>) => void,
  multiple?: boolean,
  limitTags?: number,
  renderCheckboxes?: boolean,
  disabled?: boolean,
  error?: boolean,
  fullWidth?: boolean,
  disablePortal?: boolean,
  disableCloseOnSelect?: boolean,
  skipCurrentAthletes?: boolean,
  options?: Array<Option>,
  sx?: SxProps<Theme>,
};

type InitialSquadAthletesData = SquadAthletes;
type InitialPastAthletesData = { athletes: Array<Athlete> };

const initialSquadAthletesData: InitialSquadAthletesData = { squads: [] };
const initialPastAthletesData: InitialPastAthletesData = { athletes: [] };

const getValueToPrepopulate = (value: Option | Array<Option>) => {
  if (Array.isArray(value)) {
    return value;
  }
  return value ? [value] : [];
};

const AthleteSelector = ({
  label,
  placeholder,
  value,
  onChange,
  multiple = false,
  limitTags,
  renderCheckboxes = multiple,
  disabled = false,
  error = false,
  fullWidth = false,
  disablePortal = false,
  disableCloseOnSelect = multiple,
  skipCurrentAthletes = false,
  options,
  sx = {},
  t,
}: I18nProps<Props>) => {
  const [athleteDropdownOpen, setAthleteDropdownOpen] =
    useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [searchString, setSearchString] = useState<string>('');

  const {
    data: permissions = {},
    isSuccess: hasPermissionsDataLoaded = false,
  }: { data: PermissionsType, isSuccess: boolean } = useGetPermissionsQuery();

  const canViewPastAthletes =
    (hasPermissionsDataLoaded && permissions.general.pastAthletes.canView) ||
    false;

  const {
    data: squadAthletes = initialSquadAthletesData,
    isFetching: areSquadAthletesLoading,
  } = useGetSquadAthletesQuery(
    {
      athleteList: true,
      minimalAthleteListData: true,
    },
    { skip: skipCurrentAthletes || !athleteDropdownOpen }
  );

  const {
    data: pastAthletesResult = initialPastAthletesData,
    isFetching: arePastAthletesLoading,
  } = useSearchPastAthletesQuery(
    {
      searchString,
    },
    {
      skip:
        options ||
        !canViewPastAthletes ||
        !athleteDropdownOpen ||
        !searchString,
    }
  );

  const isLoading = areSquadAthletesLoading || arePastAthletesLoading;

  const currentAthletes = mapSquadAthleteToOptions(squadAthletes);

  const pastAthletes =
    pastAthletesResult?.athletes && Array.isArray(pastAthletesResult.athletes)
      ? pastAthletesResult.athletes.map(({ id, fullname }) => ({
          id,
          label: fullname,
          group: t('Past athletes'),
        }))
      : [];

  const shouldIncludePastAthletes =
    !options && ((value && value.length) || inputValue);

  const allAthletes = isLoading
    ? []
    : uniqBy(
        [
          ...currentAthletes,
          ...(shouldIncludePastAthletes ? pastAthletes : []),
          ...getValueToPrepopulate(value),
        ],
        ({ id, group }) => [id, group].join()
      );

  const onSearch = (newInputValue: string) => {
    setSearchString(newInputValue);
  };

  const onSearchDebounced = useDebouncedCallback(onSearch, 500);

  useEffect(() => {
    return () => {
      onSearchDebounced?.cancel?.();
    };
  }, [onSearchDebounced]);

  return (
    <Autocomplete
      multiple={multiple}
      limitTags={limitTags}
      fullWidth={fullWidth}
      disablePortal={disablePortal}
      disableCloseOnSelect={disableCloseOnSelect}
      disabled={disabled}
      size="small"
      loading={isLoading}
      onOpen={() => setAthleteDropdownOpen(true)}
      onClose={() => setAthleteDropdownOpen(false)}
      value={value}
      getOptionLabel={(option) => option.label ?? ''}
      onChange={(e, val) => {
        if (
          Array.isArray(val) &&
          val.length === 1 &&
          typeof val[0] === 'string'
        ) {
          return;
        }
        onChange(val);
      }}
      freeSolo={!!inputValue || skipCurrentAthletes}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
        onSearchDebounced(newInputValue);
      }}
      options={options || allAthletes}
      isOptionEqualToValue={({ id: optionId }, { id: valueId }) =>
        optionId === valueId
      }
      groupBy={!skipCurrentAthletes ? ({ group }) => group : undefined}
      renderInput={(params) =>
        renderInput({
          params,
          label,
          placeholder,
          loading: isLoading,
          error,
        })
      }
      renderOption={renderCheckboxes ? renderAutocompleteCheckboxes : null}
      noOptionsText={t('No athletes')}
      sx={sx}
    />
  );
};

export const AthleteSelectorTranslated: ComponentType<Props> =
  withNamespaces()(AthleteSelector);
export default AthleteSelector;
