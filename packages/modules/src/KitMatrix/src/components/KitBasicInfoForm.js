// @flow
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
  Stack,
} from '@kitman/playbook/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type {
  Kit,
  FieldName,
} from '@kitman/modules/src/KitMatrix/shared/types';
import style from '@kitman/modules/src/KitMatrix/style';
import type { LeagueSeason } from '@kitman/services/src/services/kitMatrix/getLeagueSeasons';
import ColorPicker from './ColorPicker';

type KitBasicInfoFormProps = {
  ...I18nProps<{}>,
  kit: Kit,
  seasonOptions: Array<LeagueSeason>,
  divisionsData?: Array<any>,
  clubsData?: Array<any>,
  playerTypesOptions: Array<any>,
  isKitManagementV2: boolean,
  onFieldChange: (name: string, value: string | number | null) => void,
  renderError: (
    fieldName: FieldName,
    equipmentFieldName?: string
  ) => ?React$Node,
};

// component to render the basic info form for the kit matrix
const KitBasicInfoForm = ({
  t,
  kit,
  seasonOptions,
  divisionsData,
  clubsData,
  playerTypesOptions,
  isKitManagementV2,
  onFieldChange,
  renderError,
}: KitBasicInfoFormProps) => {
  const playerTypes = {
    player: { value: 'player' },
    goalkeeper: { value: 'goalkeeper' },
    referee: { value: 'referee' },
  };

  return (
    <>
      <FormControl>
        <InputLabel id="division-label">{t('League')}</InputLabel>
        <Select
          labelId="division-label"
          id="division-field"
          displayEmpty
          value={
            divisionsData?.find((division) => division.id === kit.division?.id)
              ? kit.division?.id ?? ''
              : ''
          }
          onChange={(e) => onFieldChange('division', e.target.value)}
        >
          {divisionsData?.map((division) => {
            return (
              <MenuItem key={division.id} value={division.id}>
                {division.name}
              </MenuItem>
            );
          })}
        </Select>
        {renderError('division')}
      </FormControl>

      {isKitManagementV2 && (
        <FormControl>
          <InputLabel id="season-label">{t('Season added')}</InputLabel>
          <Select
            labelId="season-label"
            id="season-field"
            displayEmpty
            value={kit?.league_season?.id ?? ''}
            onChange={(e) => onFieldChange('league_season', e.target.value)}
          >
            {seasonOptions?.map((season) => (
              <MenuItem key={season.id} value={season.id}>
                {season.name}
              </MenuItem>
            ))}
          </Select>
          {renderError('league_season')}
        </FormControl>
      )}

      <FormControl>
        <InputLabel id="type-label">{t('Type')}</InputLabel>
        <Select
          labelId="type-label"
          id="type-field"
          displayEmpty
          value={kit.type ?? ''}
          onChange={(e) => onFieldChange('type', e.target.value)}
        >
          {playerTypesOptions.map((option) => {
            return (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            );
          })}
        </Select>
        {renderError('type')}
      </FormControl>

      {kit.type && kit.type !== playerTypes.referee.value && (
        <FormControl>
          <InputLabel id="club-label">{t('Club')}</InputLabel>
          <Select
            labelId="club-label"
            id="club-field"
            css={style.fillWidth}
            displayEmpty
            value={kit.organisation?.id ?? ''}
            onChange={(e) => onFieldChange('organisation', e.target.value)}
          >
            {clubsData?.map((club) => {
              return (
                <MenuItem key={club.id} value={club.id}>
                  {club.name}
                </MenuItem>
              );
            })}
          </Select>
          {renderError('organisation')}
        </FormControl>
      )}

      <Stack direction="column">
        <Stack direction="row" gap={2}>
          <FormControl>
            <TextField
              label={t('Kit Name')}
              value={kit.name ?? ''}
              onChange={(e) => onFieldChange('name', e.target.value)}
            />
          </FormControl>
          <Box>
            <InputLabel css={style.label}>{t('Kit color')}</InputLabel>
            <ColorPicker
              color={kit.color ?? ''}
              onChange={(color) => onFieldChange('color', color)}
            />
          </Box>
        </Stack>
        {renderError('name')}
        {renderError('color')}
      </Stack>
    </>
  );
};

export default KitBasicInfoForm;
