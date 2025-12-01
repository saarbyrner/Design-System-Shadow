// @flow
import { useMemo } from 'react';
import { withNamespaces } from 'react-i18next';

import { GroupedVirtuoso } from 'react-virtuoso';

import { colors } from '@kitman/common/src/variables';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type {
  ID,
  ItemLeftRenderer,
  SelectorOption,
  OptionType,
} from '../types';
import { useAthleteContext, useOptions, useOptionSelect } from '../hooks';
import List from './List';
import Avatar from './Avatar';
import Checkbox from '../../Checkbox';

type Props = {
  selectedSquadId: ID,
  onClickBack: Function,
  renderItemLeft?: ItemLeftRenderer,
  hiddenTypes: Array<OptionType>,
  enableAllGroupSelection?: boolean,
  subtitle?: string,
};

function AthleteList(props: I18nProps<Props>) {
  const { onClick, isSelected, selectMultiple, deselectMultiple } =
    useOptionSelect();
  const { isMulti, squadAthletes, onSelectAllClick, onClearAllClick } =
    useAthleteContext();
  const { renderItemLeft, t, selectedSquadId, hiddenTypes } = props;
  const { data: positionGroups } = useOptions({
    squadId: selectedSquadId,
    hiddenTypes,
  });
  const subtitle = props.subtitle || `(${t('Group')})`;

  const selectedSquad = useMemo(() => {
    if (props.selectedSquadId === null) {
      return null;
    }

    return squadAthletes.find(({ id }) => id === selectedSquadId);
  }, [squadAthletes, selectedSquadId]);

  const renderLeftFactory = (option: SelectorOption) => () => {
    if (isMulti && selectedSquad) {
      return (
        <Checkbox
          id={`${option.type}|${option.id}`}
          isChecked={isSelected(option.id, option.type, selectedSquad?.id)}
          kitmanDesignSystem
        />
      );
    }

    if (typeof renderItemLeft === 'function') {
      return renderItemLeft(option);
    }

    return (
      <Avatar
        type={option.type}
        firstname={option.firstname}
        lastname={option.lastname}
        url={option.avatar_url}
      />
    );
  };

  const fullOptions = positionGroups.flatMap(({ options }) => [...options]);
  const allAthletesOptions = fullOptions.filter((option) => {
    if (props?.enableAllGroupSelection) {
      return !hiddenTypes?.includes(option.type);
    }
    return option.type === 'athletes';
  });
  const isHiddenSquads = hiddenTypes?.includes('squads');

  return (
    <>
      {squadAthletes.length > 1 && (
        <a
          data-testid="AthleteList|Back"
          css={{
            margin: '8px 14px 24px',
            color: colors.grey_200,
            fontWeight: 600,
            fontSize: '12px',
            cursor: 'pointer',
          }}
          onClick={props.onClickBack}
        >
          <i
            className="icon-next-left"
            style={{
              fontWeight: 'bold',
            }}
          />
          {t('Squads')}
        </a>
      )}

      <GroupedVirtuoso
        data-testid="AthleteList|Virtuoso"
        style={{
          width: '100%',
          height: 'calc(100% - 20px)',
        }}
        components={{
          Header: () => (
            <>
              <List.GroupHeading
                title={selectedSquad?.name || ''}
                actions={
                  isMulti
                    ? [
                        {
                          label: t('Select all'),
                          onClick: () =>
                            (onSelectAllClick ?? selectMultiple)?.(
                              allAthletesOptions,
                              selectedSquadId
                            ),
                        },
                        {
                          label: t('Clear all'),
                          onClick: () =>
                            (onClearAllClick ?? deselectMultiple)?.(
                              allAthletesOptions,
                              selectedSquadId
                            ),
                        },
                      ]
                    : []
                }
              />
              {selectedSquad && !isHiddenSquads && (
                <List.Option
                  title={selectedSquad.name}
                  subTitle={subtitle}
                  isBolder
                  renderLeft={renderLeftFactory({
                    type: 'squads',
                    id: selectedSquad.id,
                    name: selectedSquad.name,
                  })}
                  onClick={() =>
                    onClick(selectedSquad.id, 'squads', selectedSquad?.id, {
                      id: selectedSquad.id,
                      name: selectedSquad.name,
                      type: 'squads',
                    })
                  }
                />
              )}
            </>
          ),
        }}
        groupCounts={positionGroups.map(({ options }) => options.length)}
        groupContent={(index) => {
          const positionGroup = positionGroups[index];
          const options = positionGroup.options.filter(({ type }) => {
            if (props?.enableAllGroupSelection) {
              return !hiddenTypes?.includes(type);
            }
            return type === 'athletes';
          });

          return (
            <List.GroupHeading
              title={positionGroup.name}
              actions={
                isMulti
                  ? [
                      {
                        label: t('Select all'),
                        onClick: () =>
                          (onSelectAllClick ?? selectMultiple)?.(
                            options,
                            selectedSquadId
                          ),
                      },
                      {
                        label: t('Clear all'),
                        onClick: () =>
                          (onClearAllClick ?? deselectMultiple)?.(
                            options,
                            selectedSquadId
                          ),
                      },
                    ]
                  : []
              }
              isSubheading
              isSticky
            />
          );
        }}
        itemContent={(index) => {
          const option = fullOptions[index];
          const isGroupOption = option.type !== 'athletes';
          const isHiddenOptionType = hiddenTypes?.includes(option?.type);

          return (
            selectedSquad &&
            !isHiddenOptionType && (
              <List.Option
                key={option.id}
                title={option.name}
                isBolder={isGroupOption && isHiddenOptionType}
                renderLeft={renderLeftFactory(option)}
                subTitle={isGroupOption ? subtitle : option.position?.name}
                onClick={() =>
                  onClick(option.id, option.type, selectedSquad.id, option)
                }
              />
            )
          );
        }}
      />
    </>
  );
}

export const AthleteListTranslated = withNamespaces()(AthleteList);
export default AthleteList;
