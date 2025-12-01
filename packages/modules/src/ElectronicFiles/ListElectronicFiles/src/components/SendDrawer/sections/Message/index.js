// @flow
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectData,
  selectValidation,
  updateValidation,
  SEND_DRAWER_DATA_KEY,
  type DataKey,
} from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/sendDrawerSlice';
import {
  FormControlLabel,
  TextField,
  Checkbox,
} from '@kitman/playbook/components';
import Errors from '@kitman/modules/src/ElectronicFiles/shared/components/Errors';
import { validateField } from '@kitman/modules/src/ElectronicFiles/shared/utils';

type Props = {
  handleChange: (field: DataKey, value: string | number) => void,
};

const MessageSection = ({ handleChange, t }: I18nProps<Props>) => {
  const dispatch = useDispatch();
  const data = useSelector(selectData);
  const validation = useSelector(selectValidation);

  const handleValidation = (value: string) => {
    dispatch(
      updateValidation({
        ...validateField(SEND_DRAWER_DATA_KEY.message, value),
      })
    );
  };

  return (
    <>
      <TextField
        label={t('Subject')}
        helperText={t('optional')}
        value={data.subject || ''}
        onChange={(e) =>
          handleChange(SEND_DRAWER_DATA_KEY.subject, e.target.value)
        }
        variant="filled"
        size="small"
        margin="dense"
        fullWidth
      />
      <TextField
        label={t('Message')}
        value={data.message || ''}
        onChange={(e) => {
          handleChange(SEND_DRAWER_DATA_KEY.message, e.target.value);
          handleValidation(e.target.value);
        }}
        onBlur={(e) => handleValidation(e.target.value)}
        variant="filled"
        multiline
        rows={3}
        size="small"
        margin="dense"
        fullWidth
        error={!!validation.errors?.message?.length}
        helperText={<Errors errors={validation.errors?.message} />}
        FormHelperTextProps={{ component: 'div' }}
      />
      <FormControlLabel
        control={<Checkbox />}
        label={t('Include cover page')}
        checked={data.includeCoverPage || false}
        onChange={(e) =>
          handleChange(SEND_DRAWER_DATA_KEY.includeCoverPage, e.target.checked)
        }
        size="small"
      />
    </>
  );
};

export const MessageSectionTranslated: ComponentType<Props> =
  withNamespaces()(MessageSection);
export default MessageSection;
