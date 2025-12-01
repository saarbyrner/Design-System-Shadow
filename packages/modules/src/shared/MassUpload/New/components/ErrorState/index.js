// @flow
import type { Node } from 'react';

import i18n from '@kitman/common/src/utils/i18n';
import { Button, Box, Typography } from '@kitman/playbook/components';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import { IMPORT_TYPES } from '@kitman/modules/src/shared/MassUpload/New/utils/consts';

import { getErrorStateTemplateConfig } from '../../utils';
import { IMPORT_TYPES_WITH_TEMPLATE } from '../../utils/consts';
import styles from './styles';

type Props = {
  expectedFields: Array<string>,
  providedFields: Array<string>,
  importType: $Values<typeof IMPORT_TYPES>,
  onUploadAgain: () => void,
  optionalExpectedFields: Array<string>,
  customErrors?: { errors: Array<string>, isSuccess: boolean } | null,
};

const ErrorState = ({
  expectedFields,
  providedFields,
  importType,
  onUploadAgain,
  optionalExpectedFields,
  customErrors,
}: Props): Node => {
  const locationAssign = useLocationAssign();

  const importHasTemplate = IMPORT_TYPES_WITH_TEMPLATE.includes(importType);

  const allExpectedFields = new Set([
    ...expectedFields,
    ...optionalExpectedFields,
  ]);

  const hasAdditionalColumns = providedFields.some(
    (field) => !allExpectedFields.has(field)
  );

  return (
    <Box sx={styles.error.container}>
      <KitmanIcon
        color="error"
        fontSize="large"
        name={KITMAN_ICON_NAMES.CancelOutlined}
      />
      <Box sx={styles.error.title}>
        {i18n.t('There is an error in your provided CSV file')}
      </Box>
      <>
        {customErrors ? (
          <Box sx={styles.error.customErrorsContainer}>
            {customErrors.errors.map((error) => (
              <Typography
                variant="body"
                key={error}
                sx={styles.error.providedHeaders}
              >
                {error}
              </Typography>
            ))}
          </Box>
        ) : (
          <Box sx={styles.error.providedHeaders}>
            {hasAdditionalColumns
              ? i18n.t('Please remove additional column(s)')
              : i18n.t('Missing column(s)')}
            :{' '}
            {hasAdditionalColumns
              ? providedFields
                  .filter((item) => !allExpectedFields.has(item))
                  .join(', ')
              : expectedFields
                  .filter((item) => !providedFields.includes(item))
                  .join(', ')}
          </Box>
        )}

        {importHasTemplate && (
          <Box sx={styles.error.expectedHeaders}>
            {i18n.t('Download a CSV file template for')}{' '}
            <Button
              variant="text"
              onClick={() => {
                // $FlowIgnore[prop-missing] only importHasTemplate valid importTypes allowed
                const errorConfig = getErrorStateTemplateConfig()[importType];

                if (errorConfig.downloadTemplate) {
                  errorConfig.downloadTemplate();
                  return;
                }

                locationAssign(errorConfig.templateUrl);
              }}
            >
              {/* $FlowIgnore[prop-missing] only importHasTemplate valid importTypes allowed */}
              {getErrorStateTemplateConfig()[importType].title}
            </Button>
          </Box>
        )}

        <Button
          variant="contained"
          color="secondary"
          onClick={() => onUploadAgain()}
        >
          {i18n.t('Try again')}
        </Button>
      </>
    </Box>
  );
};

export default ErrorState;
