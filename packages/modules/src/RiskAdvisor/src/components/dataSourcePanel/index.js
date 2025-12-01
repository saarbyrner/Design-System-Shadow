// @flow
import { useState, useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import { css } from '@emotion/react';
import {
  AppStatus,
  InputText,
  SlidingPanel,
  TextButton,
  DelayedLoadingFeedback,
  Checkbox,
} from '@kitman/components';
import { colors } from '@kitman/common/src/variables';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  isOpen: boolean,
  requestStatus: 'PENDING' | 'FAILURE' | 'SUCCESS',
  dataSources: { [string]: string },
  excludedSources: Array<string>,
  toggleDataSourcePanel: Function,
  onSaveDataSources: Function,
};

const DataSourcePanel = (props: I18nProps<Props>) => {
  const [excludedSources, setExcludedSources] = useState<Array<string>>(
    props.excludedSources || []
  );
  const [searchFilterChars, setSearchFilterChars] = useState<string>('');
  const [filteredDataSources, setFilteredDataSources] = useState<Array<string>>(
    []
  );

  useEffect(() => {
    setFilteredDataSources(Object.keys(props.dataSources));
  }, [props.dataSources]);

  const style = {
    container: css`
      height: calc(100vh - 157px);
      padding: 0 24px;
      overflow: auto;
    `,
    row: css`
      margin-bottom: 20px;
      width: 100%;

      h4 {
        font-size: 16px;
      }
    `,
    checkbox: css`
      margin-bottom: 5px;
    `,
    actions: css`
      border-top: 1px solid ${colors.s14};
      bottom: 0;
      display: flex;
      justify-content: space-between;
      left: 0;
      padding: 30px;
      position: absolute;
      width: 100%;
    `,
  };

  const updateExcludedDataSources = (checkbox: {
    id: string,
    checked: boolean,
  }) => {
    setExcludedSources((prevExcludedSources) => {
      const newExcludedSources = [...prevExcludedSources];
      if (checkbox.checked) {
        // checkbox checked, we are going to INCLUDE this source in calculations
        // remove it from excludedSources
        const index = newExcludedSources.indexOf(checkbox.id);
        newExcludedSources.splice(index, 1);
      } else {
        // checkbox unchecked, we are going to EXCLUDE this source from calculations
        // add it to excludedSources
        newExcludedSources.push(checkbox.id);
      }

      return newExcludedSources;
    });
  };

  const isDataSourceExcluded = (source: string) => {
    return excludedSources.indexOf(source) !== -1;
  };

  const renderSourceCheckboxes = () => {
    // when checkbox is checked, the source is INCLUDED in the calculation
    return filteredDataSources
      ? filteredDataSources.map((source) => (
          <div css={style.checkbox} key={source}>
            <Checkbox
              id={source}
              label={props.dataSources[source]}
              isChecked={!isDataSourceExcluded(source)}
              toggle={(checkbox) => updateExcludedDataSources(checkbox)}
              kitmanDesignSystem
            />
          </div>
        ))
      : null;
  };

  const isSavingDisabled =
    Object.keys(props.dataSources).length === excludedSources.length;

  const filterDataSources = (searchValue: string) => {
    const newFilteredSources = Object.keys(props.dataSources).filter((source) =>
      props.dataSources[source]
        .toLowerCase()
        .includes(searchValue.toLowerCase())
    );
    setFilteredDataSources(newFilteredSources);
  };

  const onSearchByNameChange = (value) => {
    setSearchFilterChars(value);
    filterDataSources(value);
  };

  const renderContent = () => {
    return (
      <div css={style.container}>
        <div css={style.row}>
          <InputText
            placeholder={props.t('Search')}
            onValidation={({ value }) => onSearchByNameChange(value)}
            value={searchFilterChars}
            kitmanDesignSystem
            searchIcon
          />
        </div>
        <div css={style.row}>
          <h4>{props.t('Data sources and variables')}</h4>
          <p>
            {props.t('Selected data sources will be included.')}
            <br />
            {props.t('At least one data source should be selected.')}
          </p>
        </div>
        <div css={style.row}>{renderSourceCheckboxes()}</div>
        <div css={style.actions}>
          <TextButton
            text={props.t('Cancel')}
            type="subtle"
            onClick={props.toggleDataSourcePanel}
            kitmanDesignSystem
          />
          <TextButton
            text={props.t('Save')}
            type="primary"
            kitmanDesignSystem
            onClick={() => {
              props.onSaveDataSources(excludedSources);
              props.toggleDataSourcePanel();
            }}
            isDisabled={isSavingDisabled}
          />
        </div>
      </div>
    );
  };

  const getContent = () => {
    switch (props.requestStatus) {
      case 'FAILURE':
        return <AppStatus status="error" isEmbed />;
      case 'PENDING':
        return <DelayedLoadingFeedback />;
      case 'SUCCESS':
        return renderContent();
      default:
        return null;
    }
  };

  return (
    <SlidingPanel
      isOpen={props.isOpen}
      togglePanel={props.toggleDataSourcePanel}
      title={props.t('Edit data sources')}
      cssTop={50}
      width={460}
    >
      {getContent()}
    </SlidingPanel>
  );
};

export const DataSourcePanelTranslated = withNamespaces()(DataSourcePanel);
export default DataSourcePanel;
