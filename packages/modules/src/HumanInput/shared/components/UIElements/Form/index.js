// @flow
import { useRef, type Node, useLayoutEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  getModeFactory,
  getFormBrandingHeaderConfigFactory,
} from '@kitman/modules/src/HumanInput/shared/redux/selectors/formStateSelectors';
import { useTheme } from '@kitman/playbook/hooks';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  onOpenDrawer,
  onCloseDrawer,
} from '@kitman/modules/src/HumanInput/shared/redux/slices/formMenuSlice';
import { FormBrandingHeaderTranslated as FormBrandingHeader } from '@kitman/modules/src/HumanInput/shared/components/FormBrandingHeader';

import { Box, Grid } from '@kitman/playbook/components';

import { renderFormElement } from '@kitman/modules/src/HumanInput/shared/utils';
import type { HumanInputFormElement } from '@kitman/modules/src/HumanInput/types/forms';

import { FormTitle } from '../FormTitle';

type Props = {
  formElements: Array<HumanInputFormElement>,
  isOpen: boolean,
  title?: string,
  actionButtons?: Array<Node>,
  shouldShowMenu?: boolean,
  scrollSectionToTop?: boolean,
};

/**
 * Separates PDF content elements from other form elements.
 * PDF content elements have element_type 'Forms::Elements::Layouts::Content'
 * and content_type 'pdf' in custom_params
 */
function separateElementsByType(formElements: Array<HumanInputFormElement>): {
  pdfContentElements: Array<HumanInputFormElement>,
  otherElements: Array<HumanInputFormElement>,
} {
  return formElements.reduce(
    (acc, element) => {
      if (
        element.element_type === 'Forms::Elements::Layouts::Content' &&
        element.config?.custom_params?.content_type === 'pdf'
      ) {
        acc.pdfContentElements.push(element);
      } else {
        acc.otherElements.push(element);
      }
      return acc;
    },
    {
      pdfContentElements: [],
      otherElements: [],
    }
  );
}

const Form = (props: Props): Node => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const mode = useSelector(getModeFactory());
  const shouldCloseDrawer = useMediaQuery(theme.breakpoints.down('md'));
  const formContainerRef = useRef(null);
  const scrollSectionToTop = props.scrollSectionToTop ?? false;
  const formBrandingHeaderConfig = useSelector(
    getFormBrandingHeaderConfigFactory()
  );
  useLayoutEffect(() => {
    if (shouldCloseDrawer) {
      dispatch(onCloseDrawer());
    } else {
      dispatch(onOpenDrawer());
    }
  }, [shouldCloseDrawer, dispatch]);

  useLayoutEffect(() => {
    if (
      formContainerRef.current &&
      scrollSectionToTop &&
      typeof formContainerRef.current.scrollIntoView === 'function'
    ) {
      formContainerRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [props.title, scrollSectionToTop]);

  const { pdfContentElements, otherElements } = separateElementsByType(
    props.formElements || []
  );

  return (
    <Grid ref={formContainerRef} container spacing={0} columns={4} m={0}>
      {formBrandingHeaderConfig && !formBrandingHeaderConfig.hidden && (
        <FormBrandingHeader
          header={formBrandingHeaderConfig}
          showMenu={false}
        />
      )}

      {/* Render PDF content elements at full width */}
      {pdfContentElements.map((element) => (
        <Box
          key={element.config.element_id}
          sx={{ width: '100%', p: { xs: 1.5, sm: 3 } }}
        >
          {/* If there shouldn't be a menu, there won't be a title so `props.title ?? ''` is OK */}
          {(props.title || !props.shouldShowMenu) && (
            <FormTitle title={props.title ?? ''} />
          )}
          {renderFormElement(element, mode)}
        </Box>
      ))}

      <Box sx={{ width: '100%', p: { xs: 1.5, sm: 3 } }}>
        {/* If there shouldn't be a menu, there won't be a title so `props.title ?? ''` is OK */}
        {(props.title || !props.shouldShowMenu) && (
          <FormTitle
            title={props.title ?? ''}
            actionButtons={props.actionButtons || []}
          />
        )}
        <Box
          sx={{
            width: {
              lg: props.isOpen ? '50%' : '40%',
              s: '100%',
              xs: '100%',
              sm: '100%',
            },
          }}
        >
          <Grid container spacing={2} columns={4} p={0}>
            {otherElements.map((element) => renderFormElement(element, mode))}
          </Grid>
        </Box>
      </Box>
    </Grid>
  );
};

export default Form;
