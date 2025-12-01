// @flow
import { type ComponentType, useMemo } from 'react';
import { withNamespaces } from 'react-i18next';
import { colors } from '@kitman/common/src/variables';
import {
  Grid2 as Grid,
  SelectWrapper,
  Typography,
} from '@kitman/playbook/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type {
  SelectedGroupingsItem,
  SelectedPopulationItems,
} from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/types';
import type { ID, OptionType } from '@kitman/components/src/Athletes/types';

type Props = {
  groupingOptions: Array<{ label: string, value: string }>,
  selectedPopulation: SelectedPopulationItems,
  selectedGroupings: SelectedGroupingsItem,
  onSelectedGrouping: (params: Object) => void,
};

export const getGroupingKey = (id: ID, type: OptionType, squadId: ?ID) =>
  `${id}-${type}-${squadId || ''}`;

function EditGroupingData({
  groupingOptions,
  selectedPopulation,
  selectedGroupings,
  onSelectedGrouping,
  t,
}: I18nProps<Props>) {
  const filteredOptions = useMemo(() => {
    return selectedPopulation.filter((opt) => !opt.historic);
  }, [selectedPopulation]);

  return (
    <div
      css={{
        margin: '24px 16px',
      }}
    >
      <div
        css={{
          position: 'sticky',
          top: '0',
          backgroundColor: `${colors.white}`,
          zIndex: '1',
          margin: '20px 0',
        }}
      >
        <Typography
          variant="subtitle2"
          component="p"
          sx={{ color: 'text.primary' }}
        >
          {t('Groupings')}
        </Typography>
      </div>

      {filteredOptions.map((opt) => {
        const groupingKey = getGroupingKey(opt.id, opt.type, opt.squadId);
        const value = selectedGroupings?.[groupingKey];

        return (
          <Grid
            key={`${opt.id}`}
            container
            spacing={4}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Grid xs={5}>
              <Typography
                variant="body1"
                component="p"
                sx={{ color: 'text.primary' }}
              >
                {opt.option?.name}
              </Typography>
            </Grid>
            <Grid xs={7}>
              <SelectWrapper
                label={t('Group by')}
                value={value?.grouping || ''}
                // $FlowIgnore - string type is allowed
                options={groupingOptions}
                onChange={(e) => {
                  onSelectedGrouping({
                    id: opt.id,
                    type: opt.type,
                    squadId: opt.squadId,
                    grouping: e.target.value,
                  });
                }}
                minWidth={0}
              />
            </Grid>
          </Grid>
        );
      })}
    </div>
  );
}

export const EditGroupingDataTranslated: ComponentType<Props> =
  withNamespaces()(EditGroupingData);
export default EditGroupingData;
