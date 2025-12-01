// @flow
import { Fragment, useMemo, useState } from 'react';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';
import { ActionTooltip, CheckboxList, Select } from '@kitman/components';
import {
  useOptions,
  useOptionSelect,
} from '@kitman/components/src/Athletes/hooks';
import type {
  ID,
  OptionType,
  SelectorOption,
  SquadWithOptions,
} from '@kitman/components/src/Athletes/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { SelectedPopulationItems } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/types';

type Props = {
  selectedPopulation: SelectedPopulationItems,
  setAllContextSquads: (contextSquads: ID[]) => void,
  onChangeContextSquads: (
    id: ID,
    type: OptionType,
    squadId: ID | null,
    contextSquads: ID[]
  ) => void,
};

function EditSquadData(props: I18nProps<Props>) {
  const { data: optionsBySquad } = useOptions({ groupBy: 'squad' });
  const { isSelected } = useOptionSelect();
  const [valuesToSetAll, setValuesToSetAll] = useState([]);
  const setAll = () => {
    props.setAllContextSquads(valuesToSetAll);
    setValuesToSetAll([]);
  };
  const selectedSquadsPopulation = useMemo(
    () => props.selectedPopulation.filter((option) => option.type === 'squads'),
    [props.selectedPopulation]
  );

  const getOptions = (squad: SquadWithOptions) => {
    const squadOptions = [...squad.options];

    if (selectedSquadsPopulation.length > 0) {
      squadOptions.unshift({
        type: 'squads',
        id: squad.id,
        name: squad.name,
      });
    }

    return squadOptions.filter((option) =>
      isSelected(option.id, option.type, squad.id)
    );
  };

  const squadsWithSelections = useMemo(() => {
    const squadOptions = optionsBySquad
      .map((squad) => ({
        id: squad.id,
        name: squad.name,
        options: getOptions(squad),
      }))
      .filter((squad) => squad.options.length > 0);

    const otherOptions: SelectorOption[] = props.selectedPopulation
      .filter((option) => {
        return option.squadId === null;
      })
      .map(({ id, option, type }) => ({ id, name: option?.name || '', type }));

    if (otherOptions.length) {
      return [
        ...squadOptions,
        {
          id: 'other',
          name: props.t('Non-squad selections'),
          options: otherOptions,
        },
      ];
    }

    return squadOptions;
  }, [optionsBySquad, isSelected]);

  const getContextSquads = (id, type, squadId) => {
    const populationObj = props.selectedPopulation.find(
      (item) => item.id === id && item.type === type && item.squadId === squadId
    );
    return populationObj?.contextSquads || [];
  };

  return (
    <div
      css={css`
        margin: 24px 16px;
      `}
    >
      <div
        css={css`
          position: sticky;
          top: 0;
          background-color: ${colors.white};
          z-index: 1;
        `}
      >
        <h3
          css={css`
            color: ${colors.grey_300};
            font-size: 16px;
            font-weight: 600;
          `}
        >
          {props.t('Select squad data')}
        </h3>
        <div
          css={css`
            padding: 4px 0;
            border-bottom: solid 1px ${colors.neutral_100};
            display: flex;
          `}
        >
          {[props.t('Athlete'), props.t('Include data from')].map(
            (title, idx) => (
              <div
                key={title.split(' ').join('_')}
                css={css`
                  font-size: 12px;
                  font-weight: 600;
                  color: ${colors.grey_100};
                  flex: ${idx === 1 ? 2 : 1};
                `}
              >
                {title}
              </div>
            )
          )}
        </div>
        <div
          css={css`
            text-align: right;
            padding: 4px 0;
          `}
        >
          <ActionTooltip
            content={
              <div
                css={css`
                  max-height: 400px;
                  overflow: auto;
                `}
              >
                <CheckboxList
                  items={optionsBySquad.map(({ id, name }) => ({
                    label: name,
                    value: id,
                  }))}
                  values={valuesToSetAll}
                  onChange={setValuesToSetAll}
                  kitmanDesignSystem
                />
              </div>
            }
            actionSettings={{
              text: props.t('Set all'),
              onCallAction: setAll,
              preventCloseOnActionClick: false,
            }}
            triggerElement={
              <a
                css={css`
                  cursor: pointer;
                  font-size: 12px;
                  font-weight: 400 !important;
                  color: ${colors.grey_100};
                `}
              >
                {props.t('Set all')}
              </a>
            }
            kitmanDesignSystem
          />
        </div>
      </div>
      {squadsWithSelections.map((squad, index) => {
        return (
          <Fragment key={squad.id}>
            <div
              css={css`
                color: ${colors.grey_200};
                font-size: 14px;
                font-weight: 600;

                padding: 8px 0;
                border-top: ${index === 0
                  ? 'none'
                  : `solid 1px ${colors.neutral_100}`};

                position: sticky;
                top: 85px;
                z-index: 1;
                background-color: ${colors.white};
                /* overflow-y: scroll; */
              `}
            >
              {squad.name}
            </div>
            {squad.options.map((opt) => (
              <div
                key={`${squad.id}_${opt.id}`}
                css={css`
                  display: flex;
                  margin: 8px 0;
                `}
              >
                <div
                  css={css`
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    padding-right: 4px;
                  `}
                >
                  <span id={`option_${squad.id}_${opt.id}`}>{opt.name}</span>
                </div>
                <div
                  css={css`
                    flex: 2;
                    max-width: 65%;
                  `}
                >
                  <Select
                    placeholder={props.t('All squads')}
                    labeledby={`option_${squad.id}_${opt.id}`}
                    value={getContextSquads(
                      opt.id,
                      opt.type,
                      squad.id === 'other' ? null : squad.id
                    )}
                    options={optionsBySquad.map(({ id, name }) => ({
                      label: name,
                      value: id,
                    }))}
                    onChange={(value) => {
                      props.onChangeContextSquads(
                        opt.id,
                        opt.type,
                        squad.id === 'other' ? null : squad.id,
                        value
                      );
                    }}
                    allowSelectAll
                    allowClearAll
                    isMulti
                    appendToBody
                  />
                </div>
              </div>
            ))}
          </Fragment>
        );
      })}
    </div>
  );
}

export const EditSquadDataTranslated: ComponentType<Props> =
  withNamespaces()(EditSquadData);
export default EditSquadData;
