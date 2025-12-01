// @flow
import { useState, useEffect } from 'react';
import type { ComponentType, Node } from 'react';
import { css } from '@emotion/react';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { TextLink } from '@kitman/components';
import List from '@kitman/components/src/Athletes/components/List';
import type { GroupPopulation } from '@kitman/services/src/services/analysis/groups';
import { getGroup } from '@kitman/services/src/services/analysis/groups';
import { CircularProgress } from '@kitman/playbook/components';
import { AthleteListTranslated as AthleteList } from '../AthleteList';
import style from './style';
import { SearchBoxWrapperTranslated as SearchBoxWrapper } from '../SearchBoxWrapper';
import { searchListByKey } from '../utils';

function GroupAthleteData(props: {
  children: ({ data: GroupPopulation, isFetching: boolean }) => Node,
  groupId: number,
}) {
  const [group, setGroup] = useState<GroupPopulation>({});
  const [isGroupFetching, setIsGroupFetching] = useState<boolean>(false);

  useEffect(() => {
    if (props.groupId) {
      setIsGroupFetching(true);
      getGroup(props.groupId).then((response) => {
        setGroup(response);
        setIsGroupFetching(false);
      });
    }
  }, [props.groupId]);

  return props.children({
    data: group,
    isFetching: isGroupFetching,
  });
}

type GroupListProps = {
  searchValue: string,
  onGroupSelect: Function,
  groups: Array<GroupPopulation>,
  isFetching: boolean,
};

const GroupList = withNamespaces()(
  ({
    searchValue,
    onGroupSelect,
    groups,
    isFetching,
    t,
  }: I18nProps<GroupListProps>) => {
    const filteredGroups = searchListByKey(searchValue, groups, 'name');

    return (
      <>
        {!isFetching && groups.length === 0 && (
          <p
            css={css`
              padding: 10px;
              text-align: center;
            `}
          >
            {t('No Groups created. To create Groups and Labels go to the ')}
            <br />
            <TextLink
              text={t('Groups section')}
              href="/administration/groups"
              kitmanDesignSystem
            />
          </p>
        )}
        {isFetching && (
          <div css={style.loading}>
            <CircularProgress />
          </div>
        )}
        {filteredGroups.map((group) => (
          <List.Option
            key={group.id}
            title={group.name}
            onClick={() => onGroupSelect(group)}
            renderRight={() => (
              <i css={style.groupListIcon} className="icon-next-right" />
            )}
          />
        ))}
      </>
    );
  }
);

type Props = {
  isInAthleteSelect?: boolean,
  groups: Array<GroupPopulation>,
  isFetching: boolean,
};

function GroupSelector({
  isInAthleteSelect,
  groups,
  isFetching,
}: I18nProps<Props>) {
  const [selectedGroup, setSelectedGroup] = useState<GroupPopulation>({});

  const showAthleteList = selectedGroup?.id;

  return (
    <SearchBoxWrapper isInAthleteSelect={isInAthleteSelect}>
      {({ searchValue, setSearchValue }) => (
        <>
          {!showAthleteList && (
            <GroupList
              onGroupSelect={(group) => {
                setSearchValue('');
                setSelectedGroup(group);
              }}
              searchValue={searchValue}
              groups={groups}
              isFetching={isFetching}
            />
          )}
          {showAthleteList && (
            <GroupAthleteData groupId={selectedGroup.id}>
              {({ isFetching: isGroupFetching, data }) => {
                const athletes = data?.athletes || [];
                const filteredAthletes = searchListByKey(
                  searchValue,
                  athletes,
                  'fullname'
                );

                return (
                  <AthleteList
                    groupType="segments"
                    isLoading={isGroupFetching}
                    selectedGrouping={selectedGroup}
                    athletes={filteredAthletes}
                    onBack={() => {
                      setSearchValue('');
                      setSelectedGroup({});
                    }}
                    isInAthleteSelect={isInAthleteSelect}
                  />
                );
              }}
            </GroupAthleteData>
          )}
        </>
      )}
    </SearchBoxWrapper>
  );
}

export const GroupSelectorTranslated: ComponentType<Props> =
  withNamespaces()(GroupSelector);
export default GroupSelector;
