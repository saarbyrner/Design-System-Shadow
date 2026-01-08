// @flow

import { useMemo } from 'react';
import { SelectTranslated as Select } from '../../index';
import withSelectServiceSuppliedOptions from './index';

type Props = {
  service: Function,
  dataId: string,
  onDataLoadingStatusChanged: Function,
  label: string,
  onChange: Function,
  value: ?string | ?number | ?Array<number>,
  invalid?: boolean,
  performServiceCall?: boolean,
};

const ServiceSelect = (props: Props) => {
  const RenderServiceSelect = useMemo(
    () =>
      withSelectServiceSuppliedOptions(Select, props.service, {
        dataId: props.dataId,
        onStatusChangedCallback: props.onDataLoadingStatusChanged,
      }),
    []
  );

  return (
    <RenderServiceSelect
      label={props.label}
      onChange={props.onChange}
      value={props.value}
      invalid={props.invalid}
      performServiceCall={props.performServiceCall}
    />
  );
};

export default ServiceSelect;
