// @flow
import { useEffect, useState, type AbstractComponent } from 'react';
import { defaultMapToOptions } from '@kitman/components/src/Select/utils';
import type { Option } from '@kitman/components/src/Select';

export type OptionsService = Promise<Array<Object>>;
export type Status = 'LOADING' | 'SUCCESS' | 'FAILURE';
export type StatusChangedCallback = (
  status: Status,
  dataId: ?string,
  rejectionReason: ?any
) => void;

export type ServiceConfig = {
  enableWhileLoading?: boolean,
  dataId?: string,
  onStatusChangedCallback?: StatusChangedCallback,
  mapToOptions?: (Array<Object>) => Array<Option>,
};

const withServiceSuppliedOptions = (
  Component: AbstractComponent<*>,
  service: () => Promise<Array<Object>>,
  serviceConfig: ServiceConfig
): AbstractComponent<*> => {
  return (props: Object) => {
    const [options, setOptions] = useState([]);
    const [status, setStatus] = useState<Status>('LOADING');
    const { performServiceCall = true } = props;

    useEffect(() => {
      let mounted = true;
      if (performServiceCall) {
        service().then(
          (serviceData: Array<Object>) => {
            if (mounted) {
              setStatus('SUCCESS');
              setOptions(
                serviceConfig.mapToOptions
                  ? serviceConfig.mapToOptions(serviceData)
                  : defaultMapToOptions(serviceData)
              );
              serviceConfig.onStatusChangedCallback?.(
                'SUCCESS',
                serviceConfig.dataId,
                null
              );
            }
          },
          (rejectionReason) => {
            if (mounted) {
              setStatus('FAILURE');
              serviceConfig.onStatusChangedCallback?.(
                'FAILURE',
                serviceConfig.dataId,
                rejectionReason
              );
            }
          }
        );
      }

      return () => {
        mounted = false;
      };
    }, [performServiceCall]);

    if (props.onChangeFullOptionObject !== undefined) {
      return (
        <Component
          {...props}
          options={options}
          onChange={(value) => {
            props.onChangeFullOptionObject(
              options.find((option) => option.value === value)
            );
          }}
          isLoading={status === 'LOADING' || props.isLoading}
          isDisabled={
            !serviceConfig.enableWhileLoading && status === 'LOADING'
              ? true
              : props.isDisabled
          }
        />
      );
    }
    return (
      <Component
        {...props}
        options={options}
        isLoading={status === 'LOADING'}
        isDisabled={
          !serviceConfig.enableWhileLoading && status === 'LOADING'
            ? true
            : props.isDisabled
        }
      />
    );
  };
};

export default withServiceSuppliedOptions;
