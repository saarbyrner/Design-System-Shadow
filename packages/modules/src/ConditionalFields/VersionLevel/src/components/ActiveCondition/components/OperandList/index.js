// @flow
import { withNamespaces } from 'react-i18next';
import { Fragment, useState } from 'react';
import type { ComponentType } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
} from '@kitman/playbook/components';
import {
  InputTextField,
  SegmentedControl,
  TextButton,
} from '@kitman/components';
import { colors } from '@kitman/common/src/variables';

import {
  onAddOperand,
  onDeleteOperand,
  onUpdatePredicateOperator,
} from '@kitman/modules/src/ConditionalFields/shared/redux/slices/conditionBuildViewSlice';
import { selectActiveCondition } from '@kitman/modules/src/ConditionalFields/shared/redux/selectors/conditionBuildView';

import styles from '@kitman/modules/src/ConditionalFields/VersionLevel/src/components/VersionBuildViewTab/styles';

import type { ActiveCondition } from '@kitman/modules/src/ConditionalFields/shared/types';

import type { I18nProps } from '@kitman/common/src/types/i18n';
import { OperandCardTranslated as OperandCard } from '../OperandCard';

type Props = {
  isPublished: boolean,
};

const OperandList = ({ isPublished, t }: I18nProps<Props>) => {
  const dispatch = useDispatch();

  const [isAdvanced, setIsAdvanced] = useState<boolean>(false);

  const activeCondition: ActiveCondition = useSelector(selectActiveCondition);

  return (
    <Fragment>
      <div css={styles.conditionFormRow4}>
        <h3 css={styles.inputTitle}>{t('Input')}</h3>
        <FormControl>
          <RadioGroup
            onChange={({ target }) => {
              setIsAdvanced(target.value === 'advanced');
            }}
            defaultValue="default"
            size="small"
            row
          >
            <FormControlLabel
              value="default"
              control={<Radio color="primary" />}
              label={t('Default')}
            />
            <FormControlLabel
              value="advanced"
              control={<Radio color="primary" />}
              label={t('Advanced')}
            />
          </RadioGroup>
        </FormControl>
      </div>
      {isAdvanced && (
        <div css={styles.conditionFormRow5}>
          <InputTextField
            label={t('Predicate')}
            value={JSON.stringify(activeCondition.predicate)}
            disabled
            invalid={false}
            kitmanDesignSystem
          />
        </div>
      )}
      {!isAdvanced && (
        <div css={styles.conditionFormRow5}>
          <div css={styles.inputRelation}>
            <SegmentedControl
              label={t('Input relation')}
              buttons={[
                { name: t('And'), value: 'and' },
                { name: t('Or'), value: 'or' },
              ]}
              width="inline"
              onClickButton={(value) => {
                dispatch(onUpdatePredicateOperator({ value }));
              }}
              isSeparated
              color={colors.grey_200}
              selectedButton={activeCondition?.predicate?.operator}
              isDisabled={
                activeCondition?.predicate?.operands?.length === 1 ||
                isPublished
              }
            />
          </div>

          {activeCondition?.predicate?.operands?.map((operand, index) => {
            return (
              <Fragment // eslint-disable-next-line react/no-array-index-key
                key={`Operand_${operand.path}_${index}`}
              >
                <div css={styles.operandCardContainer}>
                  <OperandCard index={index} isPublished={isPublished} />
                  {activeCondition?.predicate?.operands?.length > 1 && (
                    <div css={styles.operandBinButton}>
                      <TextButton
                        onClick={() => dispatch(onDeleteOperand({ index }))}
                        iconBefore="icon-bin"
                        type="subtle"
                        kitmanDesignSystem
                      />
                    </div>
                  )}
                </div>
                {activeCondition?.predicate?.operands?.length > 1 &&
                  // don't want to render this after last card
                  index !== activeCondition.predicate.operands.length - 1 && (
                    <p css={styles.operatorText}>
                      {t('{{operator}}', {
                        operator: activeCondition.predicate.operator,
                      })}
                    </p>
                  )}
              </Fragment>
            );
          })}
          <div css={styles.operandActions}>
            <div css={styles.addAdditionalInputButton}>
              <TextButton
                type="subtle"
                text={t('+ Additional input')}
                isDisabled={isPublished}
                onClick={() => {
                  dispatch(onAddOperand());
                }}
                kitmanDesignSystem
              />
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export const OperandListTranslated: ComponentType<{}> =
  withNamespaces()(OperandList);

export default OperandList;
