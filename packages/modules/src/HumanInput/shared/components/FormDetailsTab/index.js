// @flow
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FormLayout from '@kitman/modules/src/HumanInput/shared/components/FormLayout';
import Menu from '@kitman/modules/src/HumanInput/shared/components/LayoutElements/Menu';
import Form from '@kitman/modules/src/HumanInput/shared/components/UIElements/Form';
import useFormNavigation from '@kitman/modules/src/HumanInput/hooks/useFormNavigation';
import DrawerToggle from '@kitman/modules/src/HumanInput/shared/components/UIElements/DrawerToggle';
import { onToggleDrawer } from '@kitman/modules/src/HumanInput/shared/redux/slices/formMenuSlice';
import {
  getActiveMenuItemFactory,
  getModeFactory,
} from '@kitman/modules/src/HumanInput/shared/redux/selectors/formStateSelectors';
import {
  getActiveMenuState,
  getDrawerState,
} from '@kitman/modules/src/HumanInput/shared/redux/selectors/formMenuSelectors';
import { MODES } from '@kitman/modules/src/HumanInput/shared/constants';
import { onUpdateShowMenuIcons } from '@kitman/modules/src/HumanInput/shared/redux/slices/formStateSlice';
import type { Node } from 'react';
import { FooterNavigationTranslated as FooterNavigation } from '@kitman/modules/src/HumanInput/shared/components/FooterNavigation/FooterNavigation';

type Props = {
  actionButtons: Array<Node>,
};

const FormDetailsTab = (props: Props) => {
  const { isNextDisabled, isPreviousDisabled, onHandleNext, onHandlePrevious } =
    useFormNavigation();
  const mode = useSelector(getModeFactory());
  const { isOpen } = useSelector(getDrawerState);
  const { menuGroupIndex, menuItemIndex } = useSelector(getActiveMenuState);
  const activeForm = useSelector(
    getActiveMenuItemFactory(menuGroupIndex, menuItemIndex)
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(onUpdateShowMenuIcons({ showMenuIcons: mode === MODES.CREATE }));
  }, [mode, dispatch]);
  return (
    <FormLayout>
      <FormLayout.Body>
        <FormLayout.Menu isOpen={isOpen}>
          <DrawerToggle
            isOpen={isOpen}
            onToggle={() => dispatch(onToggleDrawer())}
          />
          <Menu />
        </FormLayout.Menu>
        <FormLayout.Content>
          <FormLayout.Form>
            <Form
              isOpen
              scrollSectionToTop
              formElements={activeForm.form_elements}
              title={activeForm.config?.title}
              actionButtons={props.actionButtons}
            />
          </FormLayout.Form>
          <FormLayout.Footer>
            <FooterNavigation
              canNavigateBack={!isPreviousDisabled}
              canNavigateForward={!isNextDisabled}
              onBackTriggered={onHandlePrevious}
              onForwardTriggered={onHandleNext}
            />
          </FormLayout.Footer>
        </FormLayout.Content>
      </FormLayout.Body>
    </FormLayout>
  );
};

export default FormDetailsTab;
