// @flow
import { useMemo } from 'react';
import { withNamespaces } from 'react-i18next';
import { css } from '@emotion/react';

import { colors } from '@kitman/common/src/variables';
import type { I18nProps, Translation } from '@kitman/common/src/types/i18n';
import {
  useAthleteContext,
  useOptions,
  useOptionSelect,
  useSquads,
} from '../hooks';
import type { Squad } from '../types';
import List from './List';

type Props = {
  onSquadClick: Function,
};

const SquadListOption = withNamespaces()(
  (props: { squad: Squad, onSquadClick: Function, t: Translation }) => {
    const { isMulti } = useAthleteContext();
    const { data } = useOptions({ squadId: props.squad.id, groupBy: 'squad' });
    const { isSelected } = useOptionSelect();

    const numSelected = useMemo(() => {
      const currentSquadSelected = isSelected(
        props.squad.id,
        'squads',
        props.squad.id
      )
        ? 1
        : 0;
      const numOptionsSelected =
        data[0]?.options.filter((option) =>
          isSelected(option.id, option.type, props.squad.id)
        ).length || 0;

      return currentSquadSelected + numOptionsSelected;
    }, [data[0]?.options, isSelected, props.squad.id]);

    return (
      <List.Option
        key={props.squad.id}
        title={props.squad.name}
        onClick={() => props.onSquadClick(props.squad.id)}
        renderRight={() => {
          return (
            <>
              {isMulti && numSelected > 0 && (
                <span
                  css={css`
                    font-weight: 400;
                    font-size: 14px;
                    color: ${colors.grey_100};
                  `}
                >
                  {props.t(`{{number}} Selected`, { number: numSelected })}
                </span>
              )}
              <i
                css={css`
                  font-weight: bold;
                  font-size: 16px;
                  margin-top: 2px;
                `}
                className="icon-next-right"
              />
            </>
          );
        }}
      />
    );
  }
);

function SquadList(props: I18nProps<Props>) {
  const { data: squads } = useSquads();
  return (
    <>
      <List.GroupHeading title={props.t('Squads')} />
      {squads.map((squad) => (
        <SquadListOption
          data-testid="SquadList|Option"
          key={squad.id}
          squad={squad}
          onSquadClick={props.onSquadClick}
        />
      ))}
    </>
  );
}

export const SquadListTranslated = withNamespaces()(SquadList);
export default SquadList;
