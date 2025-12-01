// @flow

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { GenericFormRendererTranslated as GenericFormRenderer } from '@kitman/modules/src/HumanInput/pages/genericFormRenderer/GenericFormRenderer';
import { usePopulateFormState } from '@kitman/modules/src/HumanInput/hooks/helperHooks/usePopulateFormState';
import { onSetMode } from '@kitman/modules/src/HumanInput/shared/redux/slices/formStateSlice';
import { Box } from '@kitman/playbook/components';
import {
  MODES,
  APP_BAR_HEIGHT,
  BUILDER_HEADER_HEIGHT,
} from '@kitman/modules/src/HumanInput/shared/constants';
import {
  getFormMetaData,
  getFormStructure,
} from '@kitman/modules/src/FormTemplates/redux/selectors/formBuilderSelectors';
import { colors } from '@kitman/common/src/variables';

import type { FormMetaData } from '@kitman/modules/src/FormTemplates/redux/slices/utils/types';
import type { FormStructure } from '@kitman/modules/src/FormTemplates/shared/types';

const PreviewFormTemplate = () => {
  const dispatch = useDispatch();
  const formMetaData: FormMetaData = useSelector(getFormMetaData);
  const formStructure: FormStructure = useSelector(getFormStructure);

  // Since we're creating a form template from scratch, we don't have all the fields
  // returned by the BE the types are expecting
  // $FlowIgnore[prop-missing]
  usePopulateFormState({
    // $FlowIgnore[prop-missing]
    form: formMetaData,
    // $FlowIgnore[prop-missing]
    form_template_version: formStructure,
    form_answers: [],
  });

  useEffect(() => {
    dispatch(onSetMode({ mode: MODES.EDIT }));
  }, [dispatch]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        overflow: 'hidden',
        height: `calc(100vh - ${APP_BAR_HEIGHT}px - ${BUILDER_HEADER_HEIGHT}px)`,
        background: colors.background,
        typography: 'body1',
      }}
    >
      <GenericFormRenderer hideHeader isFormTemplatePreview />
    </Box>
  );
};

export default PreviewFormTemplate;
