// @flow
import { type Node } from 'react';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useSelector, useDispatch } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import useLocationSearch from '@kitman/common/src/hooks/useLocationSearch';
import useFormNavigation from '@kitman/modules/src/HumanInput/hooks/useFormNavigation';
import { useTheme } from '@kitman/playbook/hooks';
import useMediaQuery from '@mui/material/useMediaQuery';
import FormLayout from '@kitman/modules/src/HumanInput/shared/components/FormLayout';

import { Typography, Divider } from '@kitman/playbook/components';

import {
  getActiveMenuItemFactory,
  getFormTitleFactory,
} from '@kitman/modules/src/HumanInput/shared/redux/selectors/formStateSelectors';
import {
  getActiveMenuState,
  getDrawerState,
} from '@kitman/modules/src/HumanInput/shared/redux/selectors/formMenuSelectors';
import DrawerToggle from '@kitman/modules/src/HumanInput/shared/components/UIElements/DrawerToggle';
import { onToggleDrawer } from '@kitman/modules/src/HumanInput/shared/redux/slices/formMenuSlice';

import Menu from '@kitman/modules/src/HumanInput/shared/components/LayoutElements/Menu';
import Form from '@kitman/modules/src/HumanInput/shared/components/UIElements/Form';
import { FooterNavigationTranslated as FooterNavigation } from '@kitman/modules/src/HumanInput/shared/components/FooterNavigation/FooterNavigation';

import BackLink from '@kitman/modules/src/LeagueOperations/shared/layouts/HeaderLayout/components/BackLink';
import HeaderLayout from '@kitman/modules/src/LeagueOperations/shared/layouts/HeaderLayout';

import RegistrationFormLayout from '@kitman/modules/src/LeagueOperations/shared/layouts/RegistrationFormLayout';
import useUnsavedChanges from '@kitman/modules/src/HumanInput/hooks/useUnsavedChanges';

import { UnsavedChangesModalTranslated as UnsavedChangesModal } from '@kitman/modules/src/AthleteProfile/src/components/UnsavedChangesModal/UnsavedChangesModal';
import { ButtonSubmitTranslated as ButtonSubmit } from './components/ButtonSubmit';
import { ButtonCancelTranslated as ButtonCancel } from './components/ButtonCancel';
import { ButtonSaveProgressTranslated as ButtonSaveProgress } from './components/ButtonSaveProgress';

type Props = {
  isLoading: boolean,
};

const RegistrationFormApp = (props: I18nProps<Props>) => {
  const dispatch = useDispatch();
  const urlParams = useLocationSearch();
  const theme = useTheme();
  const isMobileView = useMediaQuery(theme.breakpoints.down('sm'));

  const { showModal, handleCloseModal, discardChangesAndHandleBack } =
    useUnsavedChanges();

  const { isNextDisabled, isPreviousDisabled, onHandleNext, onHandlePrevious } =
    useFormNavigation();

  const { menuGroupIndex, menuItemIndex } = useSelector(getActiveMenuState);

  const activeForm = useSelector(
    getActiveMenuItemFactory(menuGroupIndex, menuItemIndex)
  );

  const { isOpen } = useSelector(getDrawerState);
  const title: string = useSelector(getFormTitleFactory());

  const getActionButtons = (): Array<Node> => {
    return [
      <ButtonSaveProgress key="save_progress" isMobileView={isMobileView} />,
      <ButtonSubmit key="submit" isMobileView={isMobileView} />,
      <ButtonCancel key="cancel" isMobileView={isMobileView} />,
    ];
  };

  if (props.isLoading || !activeForm?.form_elements) {
    return <RegistrationFormLayout.Loading />;
  }

  const hasUrlParams: boolean =
    (urlParams && Array.from(urlParams.entries())?.length > 0) || false;

  const renderHeader = () => {
    return (
      <HeaderLayout withTabs>
        {hasUrlParams && (
          <HeaderLayout.BackBar>
            <BackLink />
          </HeaderLayout.BackBar>
        )}

        <HeaderLayout.Content>
          <HeaderLayout.MainContent>
            <HeaderLayout.TitleBar>
              <HeaderLayout.Title>{`${title}`}</HeaderLayout.Title>
              <HeaderLayout.Actions
                containerProps={
                  isMobileView
                    ? {
                        sx: {
                          position: 'absolute',
                          right: '16px',
                          top: '16px',
                        },
                      }
                    : {}
                }
              >
                {getActionButtons()}
              </HeaderLayout.Actions>
            </HeaderLayout.TitleBar>
          </HeaderLayout.MainContent>
        </HeaderLayout.Content>
      </HeaderLayout>
    );
  };

  return (
    <FormLayout>
      {renderHeader()}
      <Divider />
      <FormLayout.Body>
        <FormLayout.Menu isOpen={isOpen}>
          <DrawerToggle
            isOpen={isOpen}
            onToggle={() => dispatch(onToggleDrawer())}
          />
          <Menu />
        </FormLayout.Menu>
        <FormLayout.Content>
          <RegistrationFormLayout.SectionTitle>
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: '1rem', sm: '1.25rem' },
              }}
            >
              {activeForm?.config?.title}
            </Typography>
          </RegistrationFormLayout.SectionTitle>
          <FormLayout.Form>
            <Form formElements={activeForm.form_elements} isOpen />
          </FormLayout.Form>
          <FormLayout.Footer>
            <FooterNavigation
              canNavigateBack={!isPreviousDisabled}
              canNavigateForward={!isNextDisabled}
              onBackTriggered={onHandlePrevious}
              onForwardTriggered={onHandleNext}
            />
            <UnsavedChangesModal
              showModal={showModal}
              handleCloseModal={handleCloseModal}
              handleDiscardChanges={discardChangesAndHandleBack}
            />
          </FormLayout.Footer>
        </FormLayout.Content>
      </FormLayout.Body>
    </FormLayout>
  );
};

export default RegistrationFormApp;

export const RegistrationFormAppTranslated =
  withNamespaces()(RegistrationFormApp);
