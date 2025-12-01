// @flow
import { useState } from 'react';
import { AsyncSelect } from '@kitman/components';
import type { CodingSystemKey } from '@kitman/common/src/types/Coding';
import { searchCoding, getPathologiesMultiCodingV2 } from '@kitman/services';
import { getCodingFieldOption } from '@kitman/modules/src/Medical/shared/utils';
import { colors } from '@kitman/common/src/variables';
import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';
import Panel from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/components/Panel/index';
import {
  useGetIllnessOsicsPathologiesQuery,
  useGetInjuryOsicsPathologiesQuery,
  useGetIllnessOsicsQuery,
  useGetInjuryOsicsQuery,
} from '@kitman/modules/src/analysis/Dashboard/redux/services/medical';
import { useGetPathologiesByIdsQuery } from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import { defaultDataProcessor, withSelectFilter } from './FilterDefinitions';

/**
 * Its worth making pathology its own case as it is the exception to the rule
 * For non OSICs coding systems it needs to use an AsyncSelect.
 * For Osics we should just do the standard Select we usually use
 */

const styles = {
  checkboxList: {
    display: 'flex',
    '&__item': {
      marginRight: '10px',
    },
  },
  iconButton: {
    padding: 0,
    minWidth: 'auto',
    width: '20px',
    height: '20px',
    fontWeight: 'bold',
    color: colors.grey_100,
    '::before': {
      fontSize: '16px',
    },
  },
};

type Props = {
  onChange: Function,
  onClickRemove: Function,
  value: Object,
  label: string,
  placeholder?: string,
  coding: CodingSystemKey,
  asyncLoadOptions?: (searchValue: string) => Promise<{
    coding: CodingSystemKey,
    filter: string,
    results: Array<any>,
  }>,
};

export const AsyncSelectFilter = (props: Props) => {
  const [options, setOptions] = useState([]);

  const processOptions = (res, callback) => {
    const currentOptions = res.results.map((co) => {
      const option = getCodingFieldOption({
        [`${props.coding}`]: co,
      });

      switch (props.coding) {
        case codingSystemKeys.ICD:
          return {
            value: option?.value?.icd_id,
            label: option?.label,
          };
        default:
          return {
            value: option?.value?.id,
            label: option?.label,
          };
      }
    });
    setOptions(currentOptions);
    callback(currentOptions);
  };

  const loadOptions = (searchValue, callback) => {
    if (props.asyncLoadOptions) {
      return props
        .asyncLoadOptions(searchValue)
        .then((res) => processOptions(res, callback))
        .catch(console.error);
    }

    return searchCoding({
      filter: searchValue,
      codingSystem: props.coding,
    })
      .then((res) => processOptions(res, callback))
      .catch(console.error);
  };

  return (
    <Panel.Field styles={styles}>
      <AsyncSelect
        label={props.label}
        value={props.value}
        placeholder={props?.placeholder ?? ''}
        onChange={props.onChange}
        onClickRemove={props.onClickRemove}
        defaultOptions={options}
        loadOptions={loadOptions}
        minimumLetters={3}
        appendToBody
        isMulti
      />
    </Panel.Field>
  );
};

const PathologySelectFilter = (props: Props) => {
  const pathologies = useGetPathologiesByIdsQuery(
    {
      ids: props.value,
    },
    {
      skip: !props.value || !props.value.length,
      selectFromResult: (result) => {
        return {
          ...result,
          data: result.data.map((pathology) => {
            return {
              value: pathology.id,
              label: pathology.pathology,
            };
          }),
        };
      },
    }
  );

  const loadOptions = (searchValue: string) => {
    return getPathologiesMultiCodingV2({
      searchExpression: searchValue,
      codingSystemName: props.coding,
    }).then((res) => {
      return {
        coding: props.coding,
        filter: searchValue,
        results: res,
      };
    });
  };

  return (
    <AsyncSelectFilter
      {...props}
      value={pathologies.data ?? []}
      asyncLoadOptions={loadOptions}
    />
  );
};

const processDataIds = (data) =>
  data
    ? data.map(({ id }) => ({
        label: id,
        value: id,
      }))
    : [];

const InjuryOsicsPathology = withSelectFilter({
  useQuery: useGetInjuryOsicsPathologiesQuery,
  dataProcessor: defaultDataProcessor,
});

const InjuryOsicsCode = withSelectFilter({
  useQuery: useGetInjuryOsicsQuery,
  dataProcessor: processDataIds,
});

const IllnessOsicsPathology = withSelectFilter({
  useQuery: useGetIllnessOsicsPathologiesQuery,
  dataProcessor: defaultDataProcessor,
});

const IllnessOsicsCode = withSelectFilter({
  useQuery: useGetIllnessOsicsQuery,
  dataProcessor: processDataIds,
});

export const InjuryPathology = (props: Props) => {
  return props.coding === codingSystemKeys.OSICS_10 ? (
    <InjuryOsicsPathology {...props} />
  ) : (
    <PathologySelectFilter {...props} />
  );
};

export const InjuryCode = (props: Props) => {
  return props.coding === codingSystemKeys.OSICS_10 ? (
    <InjuryOsicsCode {...props} />
  ) : (
    <AsyncSelectFilter {...props} />
  );
};

export const IllnessPathology = (props: Props) => {
  return props.coding === codingSystemKeys.OSICS_10 ? (
    <IllnessOsicsPathology {...props} />
  ) : (
    <PathologySelectFilter {...props} />
  );
};

export const IllnessCode = (props: Props) => {
  return props.coding === codingSystemKeys.OSICS_10 ? (
    <IllnessOsicsCode {...props} />
  ) : (
    <AsyncSelectFilter {...props} />
  );
};
