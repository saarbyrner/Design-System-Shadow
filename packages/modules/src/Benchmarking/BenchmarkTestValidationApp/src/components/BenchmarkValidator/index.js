// @flow
import {
  useState,
  useCallback,
  useEffect,
  type ComponentType,
  type Node,
} from 'react';
import { withNamespaces } from 'react-i18next';
import { css } from '@emotion/react';

import { TextButton, Accordion, Checkbox } from '@kitman/components';
import { colors } from '@kitman/common/src/variables';
import { type I18nProps } from '@kitman/common/src/types/i18n';
import type { BenchmarkResults } from '@kitman/modules/src/Benchmarking/shared/types/index';

import styles from './styles';

type SelectedCheckboxes = {
  age_group_season_id: number,
  training_variable_id: number,
};

type Props = {
  dataToValidate: BenchmarkResults,
  title: string,
  isLoading: boolean,
  submitValidations: ({
    org: number,
    window: number,
    season: number,
    validatedMetrics: ?Array<SelectedCheckboxes>,
  }) => ?Array<SelectedCheckboxes>,
};

const BenchmarkValidator = ({
  t,
  dataToValidate,
  title,
  isLoading,
  submitValidations,
}: I18nProps<Props>) => {
  const getMappedValidatedTrainingVariables = useCallback(
    () =>
      dataToValidate.validated_training_variables?.length
        ? dataToValidate.validated_training_variables.flatMap(
            (validatedTrainingVariable) =>
              validatedTrainingVariable.training_variable_ids.map(
                (checkboxId) => ({
                  age_group_season_id:
                    validatedTrainingVariable.age_group_season_id,
                  training_variable_id: checkboxId,
                })
              )
          )
        : [],
    [dataToValidate]
  );

  const [selectedCheckboxes, setSelectedCheckBoxes] = useState<
    Array<{ age_group_season_id: number, training_variable_id: number }>
  >(getMappedValidatedTrainingVariables);
  const [expandedAccordions, setExpandedAccordions] = useState<Array<number>>(
    []
  );

  const selectCheckbox = (
    validation: { id: number, name: string },
    id: number
  ) =>
    selectedCheckboxes.find(
      (checkbox) =>
        checkbox.age_group_season_id === id &&
        checkbox.training_variable_id === validation.id
    )
      ? setSelectedCheckBoxes((prev) =>
          prev.filter(
            (checkbox) =>
              checkbox.age_group_season_id !== id ||
              checkbox.training_variable_id !== validation.id
          )
        )
      : setSelectedCheckBoxes((prev) => [
          ...prev,
          {
            age_group_season_id: id,
            training_variable_id: validation.id,
          },
        ]);

  const getCheckboxes = useCallback(
    (id: number, ageGroup: string): Node =>
      dataToValidate.training_variables.map((trainingVariable) => (
        <div
          css={styles.checkboxContainer}
          key={`${trainingVariable.id}-${ageGroup}`}
        >
          <Checkbox.New
            id={`${trainingVariable.id}-${ageGroup}`}
            checked={selectedCheckboxes.some((element) => {
              return (
                element.age_group_season_id === id &&
                element.training_variable_id === trainingVariable.id
              );
            })}
            onClick={() => selectCheckbox(trainingVariable, id)}
          />
          <span
            css={styles.label}
            onClick={() => selectCheckbox(trainingVariable, id)}
          >
            {trainingVariable.name}
          </span>
        </div>
      )),
    [dataToValidate, selectedCheckboxes]
  );

  const getAccordions = useCallback(
    (): Node =>
      dataToValidate.age_group_seasons.map((groups) => (
        <Accordion
          key={`${groups.id}-${groups.name}`}
          title={groups.name}
          iconAlign="left"
          isRightArrowIcon
          type="inlineActions"
          isOpen={expandedAccordions.includes(groups.id)}
          onChange={() => setExpandedAccordions((prev) => [...prev, groups.id])}
          overrideStyles={{
            title: css({
              width: 'initial',
              fontWeight: 600,
              color: colors.grey_300,
            }),
            innerContent: css({
              padding: '8px 16px 8px 24px',
            }),
            content: css({
              padding: '8px 16px 8px 24px',
              borderBottom: `2px solid ${colors.neutral_300}`,
            }),
            button: css({
              gap: '8px',
            }),
          }}
          content={
            <>
              <div css={styles.checkBoxParent}>
                {getCheckboxes(groups.id, groups.name)}
              </div>
              <div css={styles.copyButtonContainer}>
                <TextButton
                  text="Copy selection to all"
                  type="secondary"
                  kitmanDesignSystem
                  onClick={() => {
                    const selectedOptionsInAccordion =
                      selectedCheckboxes.filter(
                        (checkbox) => checkbox.age_group_season_id === groups.id
                      );

                    setSelectedCheckBoxes(
                      selectedOptionsInAccordion.flatMap((selectedOption) =>
                        dataToValidate.age_group_seasons.map((ageGroup) => ({
                          age_group_season_id: ageGroup.id,
                          training_variable_id:
                            selectedOption.training_variable_id,
                        }))
                      )
                    );
                  }}
                />
              </div>
            </>
          }
          action={
            <div css={styles.actionsContainer}>
              <TextButton
                type="textOnly"
                text={t('Select all')}
                onClick={() => {
                  const mappedTrainingVariables =
                    dataToValidate.training_variables.map(
                      (trainingVariable) => ({
                        age_group_season_id: groups.id,
                        training_variable_id: trainingVariable.id,
                      })
                    );

                  setSelectedCheckBoxes([
                    ...selectedCheckboxes,
                    ...mappedTrainingVariables,
                  ]);
                }}
              />
              <div css={styles.line} />
              <TextButton
                type="textOnly"
                text={t('Clear')}
                onClick={() =>
                  setSelectedCheckBoxes(
                    selectedCheckboxes.filter(
                      (selectedCheckbox) =>
                        selectedCheckbox.age_group_season_id !== groups.id
                    )
                  )
                }
              />
            </div>
          }
        />
      )),
    [dataToValidate, expandedAccordions, selectedCheckboxes]
  );

  useEffect(() => {
    setSelectedCheckBoxes(getMappedValidatedTrainingVariables);
  }, [getMappedValidatedTrainingVariables]);

  return (
    <div css={styles.container}>
      <div css={styles.header}>
        <h2 className="kitmanHeading--L2">{title}</h2>
        <div css={styles.actionsContainer}>
          <TextButton
            type="textOnly"
            text={t('Expand all')}
            onClick={() =>
              setExpandedAccordions(
                dataToValidate.age_group_seasons.map(({ id }) => id)
              )
            }
          />
          <div css={styles.line} />
          <TextButton
            type="textOnly"
            text={t('Collapse all')}
            onClick={() => setExpandedAccordions([])}
          />
        </div>
      </div>

      {getAccordions()}

      <div css={styles.validateButtonContainer}>
        <TextButton
          text="Validate"
          type="primary"
          isLoading={isLoading}
          kitmanDesignSystem
          onClick={() => {
            submitValidations({
              org: dataToValidate.organisation.id,
              window: dataToValidate.testing_window.id,
              season: dataToValidate.season,
              validatedMetrics: selectedCheckboxes.length
                ? selectedCheckboxes
                : null,
            });
          }}
        />
      </div>
    </div>
  );
};

const BenchmarkValidatorTranslated: ComponentType<Props> =
  withNamespaces()(BenchmarkValidator);
export default BenchmarkValidatorTranslated;
