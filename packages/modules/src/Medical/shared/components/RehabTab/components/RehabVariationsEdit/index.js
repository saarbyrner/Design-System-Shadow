/* eslint-disable react/no-array-index-key */
// @flow
import { InputNumeric, IconButton, Select } from '@kitman/components';
import _cloneDeep from 'lodash/cloneDeep';
// $FlowFixMe React-select has type errors with recent Flow versions https://github.com/JedWatson/react-select/issues/3612
import { createFilter } from 'react-select';
import style from './style';
import type { RehabContextType } from '../../RehabContext/types';
import type { ExerciseVariation } from '../../types';

type Props = {
  forwardedRef: any,
  disabled: boolean,
  rehabContext: RehabContextType,
  variation: ExerciseVariation,
  changeVariationType: Function,
  updateExerciseVariationProperty: Function,
  onDeleteExerciseVariation: Function,
};

const RehabVariationsEdit = (props: Props) => {
  // TODO: review the logic here. Maybe some exercises have no possible variations
  // TODO: What if variationType is 'no_type' ?
  const organisationVariations = props.rehabContext.organisationVariations;
  return (
    <div css={style.variationContainer}>
      <div
        data-testid="EditVariation|VariationDisplay"
        css={style.variationDisplay}
      >
        {props.variation.parameters?.map((repParam, index) => {
          const filteredValues = organisationVariations[repParam.param_key];
          return (
            <div key={`tooltip_${index}`}>
              <div
                key={`input_${index}`}
                data-testid="EditVariation|VariationItemDisplay"
                css={
                  index === 0
                    ? [style.setVariationDisplay, style.variationItemDisplay]
                    : style.variationItemDisplay
                }
              >
                <InputNumeric
                  inputRef={props.forwardedRef[repParam.param_key]}
                  value={
                    repParam.value && repParam.value.length
                      ? repParam.value
                      : undefined
                  }
                  onChange={(value) => {
                    props.updateExerciseVariationProperty(value, repParam.key);
                  }}
                  kitmanDesignSystem
                  descriptor={index === 2 ? repParam.unit : repParam.label}
                  tooltipDescriptor
                />
                {filteredValues?.length > 1 && (
                  <Select
                    label=""
                    onChange={(variationKey) => {
                      const selectedValue = filteredValues.find(
                        (value) => value.key === variationKey
                      );
                      props.changeVariationType(
                        _cloneDeep(selectedValue),
                        index
                      );
                    }}
                    value={repParam.key}
                    isSearchable
                    options={filteredValues.map((variation) => ({
                      label: variation.label,
                      value: variation.key,
                    }))}
                    openMenuOnEnterKey
                    disabled={props.disabled}
                    filterOption={createFilter({ matchFrom: 'start' })}
                    className="kitmanReactSelect--no-input"
                    renderControl={() => {
                      return (
                        <i
                          data-testid="changeVariationSelect"
                          className="icon-chevron-down"
                        />
                      );
                    }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
      <IconButton
        onClick={() => {
          props.onDeleteExerciseVariation();
        }}
        isDisabled={props.disabled}
        icon="icon-bin"
        tabIndex={-1}
        isSmall
        isTransparent
      />
    </div>
  );
};

export default RehabVariationsEdit;
