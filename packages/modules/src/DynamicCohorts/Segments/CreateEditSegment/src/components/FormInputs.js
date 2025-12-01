// @flow
import { withNamespaces } from 'react-i18next';
import type { Translation } from '@kitman/common/src/types/i18n';
import { useGetPermissionsQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { InputTextField, Select, TextButton } from '@kitman/components';
import { useGetAllLabelsQuery } from '@kitman/modules/src/OrganisationSettings/src/components/DynamicCohorts/ManageLabels/redux/services/labelsApi';
import { useSelector, useDispatch } from 'react-redux';
import {
  onUpdateForm,
  onUpdateQueryParams,
} from '@kitman/modules/src/DynamicCohorts/Segments/CreateEditSegment/redux/slices/segmentSlice';
import useValidationHook from '@kitman/modules/src/DynamicCohorts/Segments/CreateEditSegment/redux/hooks/useValidationHook';
import styles from '../styles';
import { mapExpressionToLabels, createLabelExpression } from '../utils';

const FormInputs = ({ t }: { t: Translation }) => {
  const dispatch = useDispatch();
  const { validateName, validateExpression } = useValidationHook();

  const { data: permissions } = useGetPermissionsQuery();
  const { data: labelOptions = [], isLoading: isLabelQueryLoading } =
    useGetAllLabelsQuery();

  const { formState, errorState } = useSelector((state) => state.segmentSlice);

  return (
    <>
      <div css={styles.title}>
        <InputTextField
          value={formState.name}
          placeholder={t('Athlete group name')}
          onChange={(e) => {
            dispatch(onUpdateForm({ name: e.target.value }));
            validateName(e.target.value);
          }}
          disabled={!permissions.settings.isSegmentsAdmin}
          kitmanDesignSystem
          invalid={errorState.name}
        />
      </div>
      <div css={styles.queryBuilder}>
        <div css={styles.selectStyles}>
          <Select
            placeholder={t('Athlete labels')}
            options={labelOptions.map(({ name }) => ({
              // the BE needs the label name, not the id, for the expression
              value: name,
              label: name,
            }))}
            value={mapExpressionToLabels(formState.expression)}
            onChange={(selections) => {
              const expression = createLabelExpression(selections);
              dispatch(
                onUpdateForm({
                  expression,
                })
              );
              validateExpression(expression);
            }}
            isLoading={isLabelQueryLoading}
            isMulti
            invalid={errorState.expression}
          />
        </div>

        <TextButton
          text={t('Apply')}
          type="primary"
          onClick={() =>
            dispatch(
              onUpdateQueryParams({
                expression: formState.expression,
                nextId: null,
              })
            )
          }
          isDisabled={errorState.expression}
          kitmanDesignSystem
        />
      </div>
    </>
  );
};

export const FormInputsTranslated = withNamespaces()(FormInputs);
export default FormInputs;
