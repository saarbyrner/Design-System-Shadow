// @flow
import { useCallback, useMemo, useEffect } from 'react';
import _isNull from 'lodash/isNull';
import type { Option } from '@kitman/components/src/Select';
import {
  useGetActivityGroupsQuery,
  useGetInjuryClassificationsQuery,
  useGetIllnessClassificationsQuery,
  useGetSidesQuery,
  useGetSidesV2Query,
  useGetPositionsQuery,
  useGetIllnessOnsetQuery,
  useGetInjuryOnsetQuery,
  useGetGradesQuery,
  useGetCompetitionsQuery,
  useGetIllnessBodyAreasQuery,
  useGetInjuryBodyAreasQuery,
  useGetContactTypesQuery,
} from '@kitman/modules/src/analysis/Dashboard/redux/services/medical';
import { isValidOptionLength } from '@kitman/modules/src/analysis/Dashboard/components/PanelModules/utils';
import type { GetCodingSystemSidesResponse } from '@kitman/services/src/services/medical/getCodingSystemSides';
import SelectFilter from './SelectFilter';

type HOCInput = {
  useQuery: Function,
  dataProcessor: (data: Object) => Array<Object>,
};
type HOCProps = {
  label: string,
  onChange: Function,
  value: Object,
  onClickRemove: Function,
  queryArgs?: Array<string>,
};

export const withSelectFilter =
  ({ useQuery, dataProcessor }: HOCInput) =>
  (props: HOCProps) => {
    const queryArgs = props.queryArgs || [];
    const query = useQuery(...queryArgs);

    const options = useMemo(() => {
      return dataProcessor(query.data);
    }, [query.data, dataProcessor]);

    const handleChange = useCallback((newValue) => {
      props.onChange(newValue);
    }, []);

    const displaySelectors = isValidOptionLength(options);

    return (
      <SelectFilter
        untranslatedLabel={props.label}
        value={props.value}
        options={options}
        onClickRemove={props.onClickRemove}
        isLoading={query.isFetching}
        onChange={handleChange}
        allowClearAll={displaySelectors}
        allowSelectAll={displaySelectors}
      />
    );
  };

type BooleanOpt = { ...Option, value: ?boolean };
type BooleanFilterProps = {
  label: string,
  value: ?boolean,
  onChange: Function,
  onClickRemove: Function,
  options: [BooleanOpt, BooleanOpt],
};

export const BooleanFilter = ({
  value,
  label,
  onChange,
  options,
  onClickRemove,
}: BooleanFilterProps) => {
  const optArray: Array<Object> = Array.from(options);

  const handleChange = useCallback((updatedValue) => {
    const newValue = updatedValue.length ? updatedValue[0] : null;
    onChange(newValue);
  }, []);

  useEffect(() => {
    return () => {
      onChange([]);
    };
  }, []);

  return (
    <SelectFilter
      untranslatedLabel={label}
      value={[value].filter((val) => !_isNull(val))}
      options={optArray}
      onClickRemove={onClickRemove}
      isLoading={false}
      onChange={handleChange}
      singleSelect
    />
  );
};

export const defaultDataProcessor = (data: Object) =>
  data
    ? data.map(({ id, name }) => ({
        label: name,
        value: id,
      }))
    : [];

const sidesDataProcessorV2 = (data: GetCodingSystemSidesResponse) =>
  data
    ? data.map((side) => ({
        label: side.side_name,
        value: side.side_id,
      }))
    : [];

export const Activity = withSelectFilter({
  useQuery: useGetActivityGroupsQuery,
  dataProcessor: (data) =>
    data
      ? data.map(({ name, activities }) => ({
          label: name,
          options: activities.map(({ id, name: activityName }) => ({
            label: activityName,
            value: id,
          })),
        }))
      : [],
});

export const PositionWhenInjured = withSelectFilter({
  useQuery: useGetPositionsQuery,
  dataProcessor: (data) =>
    data
      ? data.map(({ name, positions }) => ({
          label: name,
          options: positions.map(({ id, name: positionName }) => ({
            label: positionName,
            value: id,
          })),
        }))
      : [],
});

export const SessionTypes = withSelectFilter({
  useQuery: useGetActivityGroupsQuery,
  dataProcessor: defaultDataProcessor,
});

export const IllnessOnset = withSelectFilter({
  useQuery: useGetIllnessOnsetQuery,
  dataProcessor: defaultDataProcessor,
});

export const InjuryOnset = withSelectFilter({
  useQuery: useGetInjuryOnsetQuery,
  dataProcessor: defaultDataProcessor,
});

export const Grades = withSelectFilter({
  useQuery: useGetGradesQuery,
  dataProcessor: defaultDataProcessor,
});

export const Sides = withSelectFilter({
  useQuery: useGetSidesQuery,
  dataProcessor: defaultDataProcessor,
});

export const SidesV2 = withSelectFilter({
  useQuery: useGetSidesV2Query,
  dataProcessor: sidesDataProcessorV2,
});

export const Competition = withSelectFilter({
  useQuery: useGetCompetitionsQuery,
  dataProcessor: defaultDataProcessor,
});

export const InjuryClassification = withSelectFilter({
  useQuery: useGetInjuryClassificationsQuery,
  dataProcessor: defaultDataProcessor,
});

export const IllnessClassification = withSelectFilter({
  useQuery: useGetIllnessClassificationsQuery,
  dataProcessor: defaultDataProcessor,
});

export const IllnessBodyArea = withSelectFilter({
  useQuery: useGetIllnessBodyAreasQuery,
  dataProcessor: defaultDataProcessor,
});

export const InjuryBodyArea = withSelectFilter({
  useQuery: useGetInjuryBodyAreasQuery,
  dataProcessor: defaultDataProcessor,
});

export const ContactTypes = withSelectFilter({
  useQuery: useGetContactTypesQuery,
  dataProcessor: defaultDataProcessor,
});
