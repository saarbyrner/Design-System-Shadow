// @flow
import { withNamespaces } from 'react-i18next';
import moment from 'moment';
import { formatStandard } from '@kitman/common/src/utils/dateFormatter';
import { DatePicker, FormControl } from '@kitman/playbook/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';

import type { Mode } from '../../../../types';
import { VIEW } from '../../../../constants';
import FormItem from '../FormItem';

type Props = {
  value: string,
  mode: Mode,
};

const StartDate = (props: I18nProps<Props>) => {
  if (props.mode === VIEW) {
    return (
      <FormItem
        primary={props.t('Sharing start date')}
        secondary={formatStandard({ date: moment(props.value) })}
      />
    );
  }

  return (
    <FormControl size="small">
      <DatePicker
        id="medical-trial-form-sharing-start-date"
        label={props.t('Sharing start date')}
        value={props.value}
        readOnly
      />
    </FormControl>
  );
};

export const StartDateTranslated = withNamespaces()(StartDate);
export default StartDate;
