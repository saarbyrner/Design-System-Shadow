// @flow
import { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import { Box, Stack, Typography, Button } from '@kitman/playbook/components';
import { colors } from '@kitman/common/src/variables';
import type { I18nProps } from '@kitman/common/src/types/i18n';

const styles = {
  container: {
    p: 3,
    background: colors.white,
    border: 1,
    borderColor: colors.neutral_300,
    borderRadius: '3px',
  },
  title: {
    fontFamily: 'Open Sans',
    fontSize: 20,
    fontWeight: 600,
    color: colors.grey_300,
  },
};

type CardProps = {
  title: string,
  children: Node,
  editForm: Node,
  isFormValid?: boolean,
  isSubmitting?: boolean,
  isFormEditable?: boolean,
  onSubmitForm?: () => Promise<void>,
  onResetForm?: () => void,
  onOpenEdit?: () => void,
  onCloseEdit?: () => void,
};

const Card = ({
  t,
  title,
  children,
  editForm,
  isFormValid,
  isSubmitting,
  isFormEditable,
  onSubmitForm,
  onResetForm,
  onCloseEdit,
  onOpenEdit,
}: I18nProps<CardProps>) => {
  const [isEditView, setIsEditView] = useState(false);

  const onCancel = () => {
    setIsEditView(false);
    onResetForm?.();
    onCloseEdit?.();
  };

  const onSubmit = async () => {
    if (onSubmitForm) {
      await onSubmitForm();
      setIsEditView(false);
    }
  };

  const onSetEditMode = () => {
    onOpenEdit?.();
    setIsEditView(true);
  };

  return (
    <Box sx={styles.container} flexDirection="column">
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 4 }}
      >
        <Typography variant="body1" sx={styles.title}>
          {title}
        </Typography>

        {isFormEditable && isEditView && (
          <Stack direction="row" gap={1}>
            <Button
              disabled={isSubmitting}
              color="secondary"
              onClick={onCancel}
            >
              {t('Cancel')}
            </Button>
            <Button onClick={onSubmit} disabled={!isFormValid || isSubmitting}>
              {isSubmitting ? `${t('Loading')}...` : t('Save')}
            </Button>
          </Stack>
        )}

        {isFormEditable && editForm && !isEditView && (
          <Button color="secondary" onClick={onSetEditMode}>
            {t('Edit')}
          </Button>
        )}
      </Stack>

      {isEditView ? editForm : children}
    </Box>
  );
};

export default withNamespaces()(Card);
