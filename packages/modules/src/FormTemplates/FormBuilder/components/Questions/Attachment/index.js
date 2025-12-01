// @flow
import type { ComponentType } from 'react';
import { useDispatch } from 'react-redux';
import { withNamespaces } from 'react-i18next';

import { Grid, SelectWrapper } from '@kitman/playbook/components';
import { updateQuestionElement } from '@kitman/modules/src/FormTemplates/FormBuilder/utils/helpers';

import {
  attachmentQuestionTypeOptions,
  attachmentSizeOptions,
} from '@kitman/modules/src/FormTemplates/shared/consts';

import type { HumanInputFormElement } from '@kitman/modules/src/HumanInput/types/forms';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  questionElement: HumanInputFormElement,
  questionIndex: number,
  isChildOfGroup: ?boolean,
  groupIndex: ?number,
};

const Attachment = ({
  t,
  questionElement,
  questionIndex,
  isChildOfGroup,
  groupIndex,
}: I18nProps<Props>) => {
  const dispatch = useDispatch();
  const { type = '', max_size: maxSize = '' } =
    questionElement.config?.custom_params || {};

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    let newSize = maxSize;

    if (newType !== 'file') {
      newSize = '10mb';
    }

    updateQuestionElement(
      {
        questionIndex,
        field: 'config',
        value: {
          ...questionElement.config,
          custom_params: {
            ...questionElement.config?.custom_params,
            type: newType,
            max_size: newSize,
          },
        },
      },
      dispatch,
      isChildOfGroup,
      groupIndex
    );
  };

  const handleSizeChange = (e) => {
    updateQuestionElement(
      {
        questionIndex,
        field: 'config',
        value: {
          ...questionElement.config,
          custom_params: {
            ...questionElement.config?.custom_params,
            max_size: e.target.value,
          },
        },
      },
      dispatch,
      isChildOfGroup,
      groupIndex
    );
  };

  return (
    <Grid sx={{ pb: 2 }} container direction="column" spacing={3}>
      <Grid item sx={{ width: '20%' }}>
        <SelectWrapper
          label={t('Type')}
          onChange={handleTypeChange}
          options={attachmentQuestionTypeOptions}
          value={type || 'file'}
        />
      </Grid>
      {(type === 'file' || type === '') && (
        <Grid item sx={{ width: '20%' }}>
          <SelectWrapper
            label={t('Size')}
            onChange={handleSizeChange}
            options={attachmentSizeOptions}
            value={maxSize || '10mb'}
          />
        </Grid>
      )}
    </Grid>
  );
};

export const AttachmentQuestionTranslated: ComponentType<Props> =
  withNamespaces()(Attachment);
export default Attachment;
