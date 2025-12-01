// @flow
import { withNamespaces } from 'react-i18next';
import type { ComponentType } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { useGetOrganisationQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { Select } from '@kitman/components';
import type { SelectOption } from '@kitman/components/src/types';

import type { ValidationStatus } from '@kitman/modules/src/ConditionalFields/shared/redux/slices/conditionBuildViewSlice';
import { onUpdateActivePredicate } from '@kitman/modules/src/ConditionalFields/shared/redux/slices/conditionBuildViewSlice';
import {
  selectPredicateOperand,
  selectValidationStatus,
} from '@kitman/modules/src/ConditionalFields/shared/redux/selectors/conditionBuildView';
import { useFetchPredicateOptionsQuery } from '@kitman/modules/src/ConditionalFields/shared/services/conditionalFields';
import {
  predicateOptionsMapToSelect,
  triggerOptionsToSelect,
  operatorOptionsToSelect,
} from '@kitman/modules/src/ConditionalFields/shared/utils';
import styles from '@kitman/modules/src/ConditionalFields/VersionLevel/src/components/VersionBuildViewTab/styles';

import type {
  Operand,
  PredicateOptionTransformed,
} from '@kitman/modules/src/ConditionalFields/shared/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = { index: number, isPublished: boolean };

const OperandCard = ({ index, isPublished, t }: I18nProps<Props>) => {
  const dispatch = useDispatch();

  const activeConditionValidationStatus: ValidationStatus = useSelector(
    selectValidationStatus
  );
  const { data: organisation } = useGetOrganisationQuery();

  const {
    data: predicateAndLocationOptions,
    isLoading: arePredicateOptionsLoading,
    isError: didPredicateOptionsError,
  } = useFetchPredicateOptionsQuery(organisation.id, {
    skip: !organisation.id,
  });

  const activePredicateOperands: Operand = useSelector(
    selectPredicateOperand(index)
  );

  const mappedPredicateOptions: Array<PredicateOptionTransformed> =
    predicateOptionsMapToSelect(predicateAndLocationOptions?.predicate_options);

  const mappedOperatorOptions: Array<SelectOption> = operatorOptionsToSelect(
    mappedPredicateOptions,
    activePredicateOperands
  );

  const mappedTriggerOptions: Array<SelectOption> = triggerOptionsToSelect(
    mappedPredicateOptions,
    activePredicateOperands
  );

  return (
    <div css={styles.inputAndTriggerContainer}>
      <p css={styles.prefixOperandCard}>{t('If')}</p>
      <div>
        <Select
          placeholder={t('Input')}
          value={activePredicateOperands?.path || null}
          options={mappedPredicateOptions}
          onChange={(option) => {
            dispatch(
              onUpdateActivePredicate({
                key: 'path',
                index,
                value: option?.metaData?.path || null,
              })
            );
          }}
          isDisabled={
            arePredicateOptionsLoading ||
            didPredicateOptionsError ||
            isPublished
          }
          invalid={
            activeConditionValidationStatus === 'PENDING' &&
            !activePredicateOperands?.path
          }
          returnObject
          appendToBody
          displayValidationText
        />
      </div>

      {/** Operator and Trigger options driven by Input selection metaData */}
      <div>
        <Select
          placeholder={t('Operator')}
          options={mappedOperatorOptions || []}
          value={activePredicateOperands.operator}
          onChange={(operator) => {
            dispatch(
              onUpdateActivePredicate({
                key: 'operator',
                index,
                value: operator,
              })
            );
          }}
          isDisabled={!mappedOperatorOptions || isPublished}
          invalid={
            activeConditionValidationStatus === 'PENDING' &&
            !activePredicateOperands?.operator
          }
          displayValidationText
        />
      </div>
      <Select
        placeholder={t('Trigger')}
        value={activePredicateOperands?.value}
        options={mappedTriggerOptions || []}
        isMulti={activePredicateOperands?.operator === 'any'}
        onChange={(trigger) => {
          dispatch(
            onUpdateActivePredicate({
              key: 'value',
              index,
              value: trigger,
            })
          );
        }}
        isDisabled={!mappedOperatorOptions || isPublished}
        invalid={
          activeConditionValidationStatus === 'PENDING' &&
          !activePredicateOperands?.value
        }
        displayValidationText
      />
    </div>
  );
};

export const OperandCardTranslated: ComponentType<Props> =
  withNamespaces()(OperandCard);

export default OperandCard;
