// @flow
import { type ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';

import { AppStatus } from '@kitman/components';
import { CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material';
import { validateURL } from '@kitman/common/src/utils';
import {
  useGetDashboardsQuery,
  useGetDevelopmentGoalStandardNamesQuery,
  useGetDevelopmentGoalTypesQuery,
  useGetPrinciplesQuery,
} from '@kitman/modules/src/AthleteReviews/src/shared/redux/developmentGoals';

import {
  Autocomplete,
  Box,
  Checkbox,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@kitman/playbook/components';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import type {
  DevelopmentGoal,
  Link,
  FormModeEnumLikeValues,
} from '@kitman/modules/src/AthleteReviews/src/shared/types';
import styles from '@kitman/modules/src/AthleteReviews/src/shared/style';

type Props = {
  goal: DevelopmentGoal,
  formMode: ?FormModeEnumLikeValues,
  index: number,
  isValidationTriggered: boolean,
  squadId: ?number,
  onAddUrl: (developmentGoalIndex: number) => void,
  onRemoveGoal: (goalRemovalIndex: number) => void,
  onUpdateGoal: (
    goalId: number,
    key: string,
    value: string | Array<Link>
  ) => void,
};

const CheckBoxOutlineIcon = <CheckBoxOutlineBlank fontSize="small" />;
const CheckedIcon = <CheckBox fontSize="small" />;

const GoalForm = ({
  goal,
  index,
  isValidationTriggered,
  squadId,
  onUpdateGoal,
  onAddUrl,
  onRemoveGoal,
  t,
}: I18nProps<Props>) => {
  const {
    data: developmentGoalTypes = [],
    error: developmentGoalTypesError,
    isLoading: areDevelopmentGoalTypesLoading,
  } = useGetDevelopmentGoalTypesQuery();
  const {
    data: principles = [],
    error: principlesError,
    isLoading: isPrinciplesLoading,
  } = useGetPrinciplesQuery();

  const {
    data: developmentGoalStandardNames = [],
    error: developmentGoalStandardNamesError,
    isLoading: isDevelopmentGoalStandardNamesLoading,
  } = useGetDevelopmentGoalStandardNamesQuery();

  const {
    data: dashboards = [],
    error: dashboardsError,
    isLoading: isDashboardsLoading,
  } = useGetDashboardsQuery({ squadId }, { skip: !squadId });

  const {
    analytical_dashboard_ids: analyticalDashboardIds,
    additional_name: goalName,
    attached_links: attachedLinks,
    description,
    development_goal_types: selectedGoalTypes,
    development_goal_standard_name_id: developmentGoalStandardNameId,
    principles: selectedPrinciples,
  } = goal;

  const isError =
    dashboardsError ||
    developmentGoalStandardNamesError ||
    developmentGoalTypesError ||
    principlesError;

  if (isError) {
    return <AppStatus status="error" />;
  }

  return (
    <Stack sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" mb={2}>
        <Typography variant="h6">
          {t('Goal')} {index + 1}
        </Typography>
        {/* first goal cannot be deleted */}
        {index > 0 && (
          <IconButton
            edge="end"
            size="small"
            onClick={() => onRemoveGoal(index)}
          >
            <KitmanIcon name={KITMAN_ICON_NAMES.DeleteOutline} />
          </IconButton>
        )}
      </Stack>

      <Stack spacing={1}>
        {/* BE have made development_goal_types an array
              but user can only add one creating dev goal */}
        <Autocomplete
          value={
            developmentGoalTypes.length > 0
              ? developmentGoalTypes.find(
                  ({ id: devGoalId }) => devGoalId === selectedGoalTypes[0]?.id
                ) || null
              : null
          }
          onChange={(e, value) => {
            // currently we receive development_goal_types (Array) due the reusability/legacy of 'development goals'
            // However BE is expecting 'development_goal_type_id' a singular id (number) for creation/edit leaving us to
            // update both fields
            onUpdateGoal(index, 'development_goal_type_id', value?.id);
            onUpdateGoal(index, 'development_goal_types', value ? [value] : []);
          }}
          options={developmentGoalTypes}
          disableCloseOnSelect
          getOptionLabel={(option) => option.name}
          renderOption={(props, option) => (
            <li {...props} key={option.id}>
              {option.name}
            </li>
          )}
          sx={styles.formField}
          renderInput={(params) => (
            <TextField
              {...params}
              label={t('Type (required)')}
              error={isValidationTriggered && !selectedGoalTypes[0]?.id}
            />
          )}
          disabled={areDevelopmentGoalTypesLoading}
          loading={areDevelopmentGoalTypesLoading}
        />

        <Stack direction="row" spacing={1}>
          {/* user is able to save an arbitrary value or select one from the saved developmentGoalStandardNames */}
          <Autocomplete
            freeSolo
            value={
              // developmentGoalStandardNameId takes preference over goalName.
              developmentGoalStandardNameId &&
              developmentGoalStandardNames.length > 0
                ? developmentGoalStandardNames.find(
                    ({ id: devGoalNameId }) =>
                      devGoalNameId === developmentGoalStandardNameId
                  )
                : goalName
            }
            onChange={(e, value) => {
              onUpdateGoal(
                index,
                'development_goal_standard_name_id',
                value?.id
              );
              onUpdateGoal(index, 'additional_name', value?.standard_name);
            }}
            options={developmentGoalStandardNames}
            getOptionLabel={(option) => option.standard_name ?? goalName}
            renderOption={(props, option) => (
              <li {...props} key={option.id}>
                {option.standard_name}
              </li>
            )}
            sx={styles.formField}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t('Goal (required)')}
                onChange={(e) =>
                  // sets the goalName while user types
                  // selected developmentGoalStandardNameId takes preference over types value
                  onUpdateGoal(index, 'additional_name', e.target.value)
                }
                error={isValidationTriggered && goalName}
              />
            )}
            disabled={isDevelopmentGoalStandardNamesLoading}
            loading={isDevelopmentGoalStandardNamesLoading}
          />

          <Autocomplete
            value={
              selectedPrinciples.length > 0
                ? principles.find(
                    ({ id: principleId }) =>
                      principleId === selectedPrinciples[0]?.id
                  )
                : null
            }
            onChange={(e, value) => {
              // currently we receive principles (Array) due the reusability/legacy of 'principles'
              // However BE is expecting 'principle_id' a singular id (number) for creation/edit leaving us to
              // update both fields
              onUpdateGoal(index, 'principle_id', value?.id);
              onUpdateGoal(index, 'principles', value ? [value] : []);
            }}
            options={principles}
            disableCloseOnSelect
            getOptionLabel={(option) => option.name}
            renderOption={(props, option) => <li {...props}>{option.name}</li>}
            sx={styles.formField}
            renderInput={(params) => (
              <TextField {...params} label={t('Principle')} />
            )}
            disabled={isPrinciplesLoading}
            loading={isPrinciplesLoading}
          />
        </Stack>
        <Box sx={{ maxWidth: 420 }}>
          <TextField
            label={t('Description (required)')}
            value={description}
            onChange={(e) => onUpdateGoal(index, 'description', e.target.value)}
            multiline
            fullWidth
            error={isValidationTriggered && !description}
          />
        </Box>
        <Stack direction="row" spacing={1}>
          <Autocomplete
            value={
              dashboards
                ? dashboards.filter(({ id: dashboardId }) =>
                    analyticalDashboardIds.includes(dashboardId)
                  )
                : []
            }
            onChange={(e, values) =>
              onUpdateGoal(
                index,
                'analytical_dashboard_ids',
                values.map(({ id }) => id)
              )
            }
            multiple
            options={dashboards}
            disableCloseOnSelect
            getOptionLabel={(option) => option.name}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox
                  icon={CheckBoxOutlineIcon}
                  checkedIcon={CheckedIcon}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                {option.name}
              </li>
            )}
            sx={styles.formField}
            renderInput={(params) => (
              <TextField {...params} label={t('Link to measurement')} />
            )}
            disabled={isDashboardsLoading}
            loading={isDashboardsLoading}
          />
        </Stack>
        {attachedLinks.map((attachedLink, attachedLinkIndex) => {
          const { id, title, uri } = attachedLink;
          const isUrlInvalid = uri && !validateURL(uri);

          const isUrlEmptyAndTitleIsPresent = !uri && title;

          const isTitleInvalid = isValidationTriggered && uri && !title;
          return (
            <Stack direction="row" spacing={1} key={id}>
              <TextField
                label={t('URL link')}
                value={uri}
                onChange={(e) => {
                  // send back the entire attached_links with the updated value
                  onUpdateGoal(index, 'attached_links', [
                    ...attachedLinks.slice(0, attachedLinkIndex),
                    {
                      ...attachedLinks[attachedLinkIndex],
                      uri: e.target.value,
                    },
                    ...attachedLinks.slice(attachedLinkIndex + 1),
                  ]);
                }}
                sx={styles.formField}
                error={
                  isValidationTriggered &&
                  (isUrlInvalid || isUrlEmptyAndTitleIsPresent)
                }
                helperText={isUrlInvalid && t('Invalid URL link')}
              />
              <TextField
                label={t('Title')}
                value={title}
                onChange={(e) => {
                  // TODO: remove e.persist() if React version is 17+.
                  e.persist();
                  // send back the entire attached_links with the updated value
                  onUpdateGoal(index, 'attached_links', [
                    ...attachedLinks.slice(0, attachedLinkIndex),
                    {
                      ...attachedLinks[attachedLinkIndex],
                      title: e.target.value,
                    },
                    ...attachedLinks.slice(attachedLinkIndex + 1),
                  ]);
                }}
                sx={styles.formField}
                error={isTitleInvalid}
                helperText={isTitleInvalid && t('All URLs should have a title')}
              />

              <IconButton
                edge="end"
                size="small"
                onClick={() => {
                  const attachmentLinks = attachedLinks.slice();
                  attachmentLinks.splice(attachedLinkIndex, 1);
                  onUpdateGoal(index, 'attached_links', attachmentLinks);
                }}
              >
                <KitmanIcon name={KITMAN_ICON_NAMES.DeleteOutline} />
              </IconButton>
            </Stack>
          );
        })}
        {attachedLinks.length < 5 && (
          <Box>
            <IconButton
              size="large"
              aria-label={t('Add URL')}
              onClick={() => onAddUrl(index)}
            >
              <KitmanIcon name={KITMAN_ICON_NAMES.Add} />
            </IconButton>
          </Box>
        )}
      </Stack>
    </Stack>
  );
};

export const GoalFormTranslated: ComponentType<Props> =
  withNamespaces()(GoalForm);
export default GoalForm;
