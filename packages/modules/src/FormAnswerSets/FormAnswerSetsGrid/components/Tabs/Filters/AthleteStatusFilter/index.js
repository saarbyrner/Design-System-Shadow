// @flow
import { useState } from 'react';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setAthleteStatusFilter } from '@kitman/modules/src/FormAnswerSets/redux/slices/formAnswerSetsSlice';
import { Autocomplete, TextField } from '@kitman/playbook/components';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type AthleteStatus = 'active' | 'free_agent';

type Props = {
  isPlayerUsage: boolean,
  onChange?: (AthleteStatus) => void,
};

const AthleteStatusFilter = ({
  isPlayerUsage,
  onChange,
  t = (key) => key,
}: I18nProps<Props>) => {
  const dispatch = useDispatch();
  const { trackEvent } = useEventTracking();

  const playerTypeOptions = [
    { id: 'active', label: t('Active') },
    { id: 'free_agent', label: t('Free agent') },
  ];

  const [selectedType, setSelectedType] = useState<{
    id: 'active' | 'free_agent',
    label: string,
  }>(
    playerTypeOptions[0] // Default to translated 'Active'
  );

  const handleChange = (
    event: any,
    value: { id: AthleteStatus, label: string } | null
  ) => {
    // Ensure we always have a value selected
    const newValue = value || playerTypeOptions[0];
    setSelectedType(newValue);
    // TODO: Review with Benny. This is odd to set a redux state but for the value display to be driven internally ( use state).
    // Blurring lines of managed component
    dispatch(setAthleteStatusFilter(newValue.id));
    // TODO: review would suggest using events file
    trackEvent(
      isPlayerUsage
        ? 'Player - Completed Forms Filter Athlete Type Used'
        : 'Staff - Completed Forms Filter Athlete Type Used'
    );
    onChange?.(newValue.id);
  };

  return (
    <Autocomplete
      options={playerTypeOptions}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      value={selectedType}
      onChange={handleChange}
      disableClearable
      renderInput={(params) => (
        <TextField {...params} label={t('Athlete status')} />
      )}
      sx={{ width: '15rem' }}
      size="small"
    />
  );
};

export const AthleteStatusFilterTranslated: ComponentType<Props> =
  withNamespaces()(AthleteStatusFilter);

export default AthleteStatusFilter;
