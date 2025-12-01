// @flow
import { useState, useEffect } from 'react';
import type { ComponentType, Node } from 'react';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { TextLink } from '@kitman/components';
import { css } from '@emotion/react';
import List from '@kitman/components/src/Athletes/components/List';
import type { LabelPopulation } from '@kitman/services/src/services/analysis/labels';
import { getLabel } from '@kitman/services/src/services/analysis/labels';
import { CircularProgress } from '@kitman/playbook/components';
import style from './style';
import { AthleteListTranslated as AthleteList } from '../AthleteList';
import { SearchBoxWrapperTranslated as SearchBoxWrapper } from '../SearchBoxWrapper';
import { searchListByKey } from '../utils';

function LabelAthleteData(props: {
  children: ({ data: LabelPopulation, isFetching: boolean }) => Node,
  labelId: number,
}) {
  const [label, setLabel] = useState<LabelPopulation>({});
  const [isLabelFetching, setIsLabelFetching] = useState<boolean>(false);

  useEffect(() => {
    if (props.labelId) {
      setIsLabelFetching(true);
      getLabel(props.labelId).then((response) => {
        setLabel(response);
        setIsLabelFetching(false);
      });
    }
  }, [props.labelId]);

  return props.children({
    data: label,
    isFetching: isLabelFetching,
  });
}

type LabelListProps = {
  onLabelSelect: Function,
  searchValue: string,
  labels: Array<LabelPopulation>,
  isFetching: boolean,
};

const LabelList = withNamespaces()(
  ({
    onLabelSelect,
    searchValue,
    labels,
    isFetching,
    t,
  }: I18nProps<LabelListProps>) => {
    const filteredLabels = searchListByKey(searchValue, labels, 'name');

    return (
      <>
        {!isFetching && labels.length === 0 && (
          <p
            css={css`
              padding: 10px;
              text-align: center;
            `}
          >
            {t('No Labels created. To create Groups and Labels go to the ')}
            <br />
            <TextLink
              text={t('Labels section')}
              href="/administration/labels/manage"
              kitmanDesignSystem
            />
          </p>
        )}
        {isFetching && (
          <div css={style.loading}>
            <CircularProgress />
          </div>
        )}
        {filteredLabels.map((label) => (
          <List.Option
            key={label.id}
            onClick={() => onLabelSelect(label)}
            renderTitle={() => (
              <div css={style.labelListName(label.color)}>{label.name}</div>
            )}
            renderRight={() => (
              <i css={style.labelListIcon} className="icon-next-right" />
            )}
          />
        ))}
      </>
    );
  }
);

type Props = {
  isInAthleteSelect?: boolean,
  labels: Array<LabelPopulation>,
  isFetching: boolean,
};

function LabelSelector({
  isInAthleteSelect,
  labels,
  isFetching,
}: I18nProps<Props>) {
  const [selectedLabel, setSelectedLabel] = useState<LabelPopulation>({});
  const showAthleteList = !!selectedLabel?.id;

  return (
    <SearchBoxWrapper isInAthleteSelect={isInAthleteSelect}>
      {({ searchValue, setSearchValue }) => (
        <>
          {!showAthleteList && (
            <LabelList
              searchValue={searchValue}
              onLabelSelect={(label) => {
                setSelectedLabel(label);
                setSearchValue('');
              }}
              labels={labels}
              isFetching={isFetching}
            />
          )}
          {showAthleteList && (
            <LabelAthleteData labelId={selectedLabel.id}>
              {({ isFetching: isLabelFetching, data }) => {
                const athletes = data?.athletes || [];
                const filteredAthletes = searchListByKey(
                  searchValue,
                  athletes,
                  'fullname'
                );

                return (
                  <AthleteList
                    groupType="labels"
                    isLoading={isLabelFetching}
                    selectedGrouping={selectedLabel}
                    athletes={filteredAthletes}
                    onBack={() => {
                      setSearchValue('');
                      setSelectedLabel({});
                    }}
                    isInAthleteSelect={isInAthleteSelect}
                  />
                );
              }}
            </LabelAthleteData>
          )}
        </>
      )}
    </SearchBoxWrapper>
  );
}

export const LabelSelectorTranslated: ComponentType<Props> =
  withNamespaces()(LabelSelector);
export default LabelSelector;
