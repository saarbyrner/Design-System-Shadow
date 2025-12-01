// @flow
import { useEffect, useMemo } from 'react';
import { withNamespaces } from 'react-i18next';
import { Select } from '@kitman/components';
import eventTypes from '@kitman/modules/src/analysis/GraphComposer/resources/eventTypes';
import { useGetSessionTypesQuery } from '@kitman/modules/src/analysis/Dashboard/redux/services/dashboard';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { isValidOptionLength } from '@kitman/modules/src/analysis/Dashboard/components/PanelModules/utils';

import Panel from '../../Panel';

type IconConfig = {
  iconName: string,
  onClick: Function,
};

type Props = {
  onSelectSessionTypes: Function,
  onSelectEventTypes: Function,
  selectedSessionTypes: Array<number>,
  selectedEventTypes: Array<string>,
  noChangeOnUnload?: boolean, // If true don't trigger setting selections to empty array
  includeIconConfig?: IconConfig,
};

const makeValue = (type, id) => `${type}|${id}`;
const parseValue = (value) => {
  const splitValue = value.split('|');

  return {
    type: splitValue[0],
    value: splitValue[1],
  };
};

function SessionTypeFilter(props: I18nProps<Props>) {
  const { data: sessionTypes = [], isFetching } = useGetSessionTypesQuery();

  const options = useMemo(() => {
    return [
      ...eventTypes().map(({ name, subItems }) => ({
        label: name,
        options: subItems?.map((subItem) => ({
          value: makeValue('event_type', subItem.id),
          label: subItem.name,
        })),
      })),
      {
        label: props.t('Training Session'),
        options: sessionTypes?.map(({ id, name }) => ({
          label: name,
          value: makeValue('training_session_type', id),
        })),
      },
    ];
  }, [sessionTypes]);

  const selectedOptions = useMemo(() => {
    const mapperFactory = (type) => (value) => makeValue(type, value);
    return [
      ...props.selectedSessionTypes.map(mapperFactory('training_session_type')),
      ...props.selectedEventTypes.map(mapperFactory('event_type')),
    ];
  }, [props.selectedEventTypes, props.selectedSessionTypes]);

  const onChange = (values) => {
    const newSessionTypes = [];
    const newEventTypes = [];

    if (values.length === 0) {
      props.onSelectSessionTypes([]);
      props.onSelectEventTypes([]);
    } else {
      values.forEach((value) => {
        if (!value) {
          return;
        }
        const parsedValue = parseValue(value);

        if (parsedValue.type === 'training_session_type') {
          newSessionTypes.push(parseInt(parsedValue.value, 10));
        }

        if (parsedValue.type === 'event_type') {
          newEventTypes.push(parsedValue.value);
        }

        props.onSelectSessionTypes([...newSessionTypes]);
        props.onSelectEventTypes([...newEventTypes]);
      });
    }
  };

  const displaySelectors = isValidOptionLength(options);

  useEffect(() => {
    return () => {
      if (!props.noChangeOnUnload) {
        onChange([]);
      }
    };
  }, [props.noChangeOnUnload]);

  return (
    <Panel.Field data-testid="SessionTypeFilter|PanelField">
      <Select
        data-testid="SessionTypeFilter|SessionSelect"
        label={props.t('Session Type')}
        value={selectedOptions}
        options={options}
        onChange={onChange}
        isLoading={isFetching}
        menuPosition="fixed"
        minMenuHeight={300}
        inlineShownSelectionMaxWidth={380}
        inlineShownSelection
        isMulti
        appendToBody
        labelIcon={props.includeIconConfig?.iconName}
        onClickIcon={props.includeIconConfig?.onClick}
        allowClearAll={displaySelectors}
        allowSelectAll={displaySelectors}
        selectAllGroups
        hideOnSearch
      />
    </Panel.Field>
  );
}

export const SessionTypeFilterTranslated = withNamespaces()(SessionTypeFilter);
export default SessionTypeFilter;
