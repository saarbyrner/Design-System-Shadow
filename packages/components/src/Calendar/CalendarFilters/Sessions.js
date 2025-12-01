// @flow

import { withNamespaces } from 'react-i18next';
// $FlowFixMe React-select has type errors with recent Flow versions https://github.com/JedWatson/react-select/issues/3612
import { components as SelectComponents } from 'react-select';

import { Accordion, Select } from '@kitman/components';
import type { Translation } from '@kitman/common/src/types/i18n';

import {
  accordionOverrideStyles,
  createAccordionContentStyles,
} from './utils/styles';
import { useGetSessionTypesQuery } from './redux/services/filters';
import { useFilter } from './utils/hooks';
import AccordionTitle from './AccordionTitle';

const accordionContent = createAccordionContentStyles({
  includeBorderBottom: false,
  rowGapRem: 1,
});

const CustomGroupHeading = (props: { data: { label: string } }) => {
  const {
    data: { label },
    ...rest
  } = props;
  return (
    <SelectComponents.GroupHeading {...rest}>
      {label}
    </SelectComponents.GroupHeading>
  );
};

const Sessions = ({ t }: { t: Translation }) => {
  const { filter: sessionsFilter = [], setFilter: setSessionsFilter } =
    useFilter('session_type_names') || {};

  const { data: sessionTypes = [], isError: sessionTypesIsError } =
    useGetSessionTypesQuery();

  const title = t('Sessions');
  const sessionOptions = sessionTypesIsError
    ? []
    : sessionTypes.map((sessionType) => ({
        label: sessionType,
        value: sessionType,
      }));

  const groupedOptions = [
    {
      label: t('Session types'),
      options: sessionOptions,
    },
  ];

  const onChange = (newValues: Array<string> | null) => {
    setSessionsFilter(newValues || ([]: Array<string>));
  };

  return (
    <Accordion
      title={
        <AccordionTitle
          translatedTitle={title}
          numberOfActiveFilters={sessionsFilter?.length}
        />
      }
      isOpen
      overrideStyles={accordionOverrideStyles}
      content={
        <div css={accordionContent}>
          <Select
            options={groupedOptions}
            value={sessionsFilter}
            onChange={onChange}
            isMulti
            placeholder={t('Search session types')}
            components={{
              GroupHeading: CustomGroupHeading,
            }}
          />
        </div>
      }
    />
  );
};

export const SessionsTranslated = withNamespaces()(Sessions);
export default Sessions;
