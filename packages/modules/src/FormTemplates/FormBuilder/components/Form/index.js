// @flow
import { useSelector } from 'react-redux';
import { Box } from '@kitman/playbook/components';
import { getFormHeaderBrandingConfig } from '@kitman/modules/src/FormTemplates/redux/selectors/formBuilderSelectors';
import { FormBrandingHeaderTranslated as FormBrandingHeader } from '@kitman/modules/src/HumanInput/shared/components/FormBrandingHeader';
import FormMenu from './Menu';
import FormContent from './FormContent';

const Form = () => {
  const formHeaderBrandingConfig = useSelector(getFormHeaderBrandingConfig);

  return (
    <Box display="flex">
      <FormMenu />
      <Box sx={{ width: '100%' }}>
        {formHeaderBrandingConfig && (
          <FormBrandingHeader header={formHeaderBrandingConfig} showMenu />
        )}
        <FormContent />
      </Box>
    </Box>
  );
};

export default Form;
