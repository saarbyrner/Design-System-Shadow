// @flow
import { type ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { Virtuoso } from 'react-virtuoso';

import { Checkbox } from '@kitman/components';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import { Button, CircularProgress } from '@kitman/playbook/components';
import List from '@kitman/components/src/Athletes/components/List';
import type { LabelPopulation } from '@kitman/services/src/services/analysis/labels';
import type { GroupPopulation } from '@kitman/services/src/services/analysis/groups';
import type { Athlete } from '@kitman/common/src/types/Athlete';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import {
  useAthleteContext,
  useOptionSelect,
} from '@kitman/components/src/Athletes/hooks';

import style from './style';

type SelectedGrouping = LabelPopulation | GroupPopulation;

type Props = {
  groupType: 'labels' | 'segments',
  selectedGrouping: SelectedGrouping,
  isLoading: boolean,
  athletes: Athlete[],
  onBack: Function,
  isInAthleteSelect?: boolean,
};

const SQUAD_ID = null;
const ATHLETE_TYPE = 'athletes';

function AthleteList(props: I18nProps<Props>) {
  const isAthletesAvailable = !!props.athletes.length;
  const { onClick, isSelected, selectMultiple, deselectMultiple } =
    useOptionSelect();
  const { onSelectAllClick, onClearAllClick, isMulti } = useAthleteContext();
  const athletesAsOptions = props.athletes.map(({ fullname, id }) => ({
    id,
    type: 'athletes',
    name: fullname,
  }));

  const isAthleteSelected = (id) => isSelected(id, ATHLETE_TYPE, SQUAD_ID);

  const onAthleteClick = (athlete: Athlete) => {
    onClick(athlete.id, ATHLETE_TYPE, SQUAD_ID, {
      id: athlete.id,
      name: athlete.fullname,
      type: ATHLETE_TYPE,
    });
  };

  const onGroupClick = () =>
    onClick(props.selectedGrouping.id, props.groupType, SQUAD_ID, {
      id: props.selectedGrouping.id,
      name: props.selectedGrouping.name,
      type: props.groupType,
    });
  const isGroupSelected = () =>
    isSelected(props.selectedGrouping.id, props.groupType, SQUAD_ID);

  const renderLeftFactory = (option: Athlete) => () => {
    if (isMulti) {
      return (
        <Checkbox
          id={option.id}
          isChecked={isAthleteSelected(option.id)}
          kitmanDesignSystem
        />
      );
    }

    return null;
  };

  return (
    <>
      <Button
        startIcon={<KitmanIcon name={KITMAN_ICON_NAMES.ChevronLeft} />}
        onClick={props.onBack}
        variant="text"
      >
        {props.t('Back')}
      </Button>
      <div data-testid="AthleteList|Group" css={style.groupBy}>
        <List.Option
          onClick={onGroupClick}
          renderTitle={() => (
            <>
              <span>
                <b>{props.selectedGrouping?.name}</b>
              </span>
              <span> ({props.t('Aggregate')})</span>
            </>
          )}
          renderLeft={() => {
            return isMulti ? (
              <Checkbox
                isChecked={isGroupSelected()}
                id="config-group"
                kitmanDesignSystem
              />
            ) : (
              <></>
            );
          }}
        />
      </div>
      {props.isLoading && (
        <div css={style.loading}>
          <CircularProgress />
        </div>
      )}
      {isAthletesAvailable && (
        <Virtuoso
          style={{
            width: '100%',
            height: props.isInAthleteSelect
              ? 'calc(100% - 100px)'
              : 'calc(100% - 120px)',
          }}
          components={{
            Header: () => (
              <List.GroupHeading
                styles={{
                  heading: {
                    borderBottom: 'unset',
                  },
                }}
                title={props.t('Athletes')}
                actions={
                  isMulti
                    ? [
                        {
                          label: props.t('Select all'),
                          onClick: () => {
                            if (typeof onSelectAllClick === 'function') {
                              onSelectAllClick(athletesAsOptions, SQUAD_ID);
                              return;
                            }
                            selectMultiple(athletesAsOptions, SQUAD_ID);
                          },
                        },
                        {
                          label: props.t('Clear all'),
                          onClick: () => {
                            if (typeof onClearAllClick === 'function') {
                              onClearAllClick(athletesAsOptions, SQUAD_ID);
                              return;
                            }

                            deselectMultiple(athletesAsOptions, SQUAD_ID);
                          },
                        },
                      ]
                    : []
                }
              />
            ),
          }}
          data={props.athletes}
          totalCount={props.athletes.length}
          itemContent={(index: number) => {
            const option = props.athletes[index];

            return (
              <List.Option
                key={option.id}
                title={option.fullname}
                renderLeft={renderLeftFactory(option)}
                onClick={() => onAthleteClick(option)}
              />
            );
          }}
        />
      )}
    </>
  );
}

export const AthleteListTranslated: ComponentType<Props> =
  withNamespaces()(AthleteList);
export default AthleteList;
