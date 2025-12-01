// @flow
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { zIndices } from '@kitman/common/src/variables';
import { type Node } from 'react';
import {
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@kitman/playbook/components';
import { type ApprovalOption } from '@kitman/modules/src/LeagueOperations/technicalDebt';

type Props = {
  onChange: ({ status: string }) => void,
  options: Array<ApprovalOption>,
};

const StatusSelect = (props: I18nProps<Props>): Node => {
  return (
    <Grid item xs={12} sx={{ p: 2 }}>
      <FormControl fullWidth>
        <InputLabel id="status-label">{props.t('Status')}</InputLabel>
        <Select
          id="status-select"
          label={props.t('Status')}
          labelId="status-label"
          defaultValue=""
          MenuProps={{
            style: { zIndex: zIndices.drawer },
          }}
          onChange={(e) => {
            props.onChange({ status: e.target.value });
          }}
        >
          {props.options.map((option) => {
            return (
              <MenuItem value={option.value} key={option.value}>
                {option.label}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Grid>
  );
};

export default StatusSelect;
export const StatusSelectTranslated = withNamespaces()(StatusSelect);
