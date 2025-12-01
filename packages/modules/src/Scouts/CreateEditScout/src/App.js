// @flow
import { useSelector, useDispatch } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { Box, Button, Stack } from '@kitman/playbook/components';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import { add } from '@kitman/modules/src/Toasts/toastsSlice';
import FormLayout from '@kitman/modules/src/HumanInput/shared/components/FormLayout';
import { getActiveMenuState } from '@kitman/modules/src/HumanInput/shared/redux/selectors/formMenuSelectors';

import {
  getActiveMenuItemFactory,
  getFormState,
} from '@kitman/modules/src/HumanInput/shared/redux/selectors/formStateSelectors';
import { getValidationStateFactory } from '@kitman/modules/src/HumanInput/shared/redux/selectors/formValidationSelectors';
import Form from '@kitman/modules/src/HumanInput/shared/components/UIElements/Form';
import { isEmailValid } from '@kitman/modules/src/Officials/shared/utils/';
import {
  useCreateScoutMutation,
  useUpdateScoutMutation,
} from '@kitman/modules/src/Scouts/shared/redux/services/index';
import { MODES } from '@kitman/modules/src/HumanInput/shared/constants/index';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { redirectUrl } from '@kitman/modules/src/AdditionalUsers/shared/utils';
import Header from '../../shared/components/Header';
import type { Mode } from '..';

type Props = {
  mode: Mode,
  userType: string,
  id: number,
};

const CreateEditScoutApp = (props: I18nProps<Props>) => {
  const dispatch = useDispatch();
  const locationAssign = useLocationAssign();
  const { menuGroupIndex, menuItemIndex } = useSelector(getActiveMenuState);
  const userType = props.userType;
  const activeForm = useSelector(
    getActiveMenuItemFactory(menuGroupIndex, menuItemIndex)
  );
  const formState = useSelector((state) => getFormState(state));

  const validationState = useSelector(getValidationStateFactory());

  const isSaveDisabled =
    validationState.some((i) => i === 'INVALID' || i === 'PENDING') ||
    !isEmailValid(formState.email);

  const [onCreateAdditionalUser] = useCreateScoutMutation();
  const [onUpdateAdditionalUser] = useUpdateScoutMutation();

  const onHandleSave = () => {
    if (props.mode === MODES.CREATE) {
      // update form data with "type" prop in order to create a user
      const updatedState = { ...formState, type: userType };
      onCreateAdditionalUser(updatedState)
        .unwrap()
        .then(() => {
          dispatch(
            add({
              status: 'SUCCESS',
              title: props.t('Success creating {{userType}}', {
                userType,
              }),
            })
          );
          locationAssign(redirectUrl(userType));
        })
        .catch(() => {
          dispatch(
            add({
              status: 'ERROR',
              title: props.t('Error creating {{userType}}', {
                userType,
              }),
            })
          );
        });
    } else {
      onUpdateAdditionalUser({
        id: props.id,
        user: formState,
      })
        .unwrap()
        .then(() => {
          dispatch(
            add({
              status: 'SUCCESS',
              title: props.t('Success editing {{userType}}', {
                userType,
              }),
            })
          );
          locationAssign(redirectUrl(userType));
        })
        .catch(() => {
          dispatch(
            add({
              status: 'ERROR',
              title: props.t('Error editing {{userType}}', {
                userType,
              }),
            })
          );
        });
    }
  };

  const renderFooter = () => {
    return (
      <FormLayout.Footer>
        <Stack direction="row" spacing={1}>
          <Button size="small" disabled={isSaveDisabled} onClick={onHandleSave}>
            {props.t('Save')}
          </Button>
          <Button
            size="small"
            variant="contained"
            onClick={() => {
              locationAssign(redirectUrl(props.userType));
            }}
          >
            {props.t('Cancel')}
          </Button>
        </Stack>
      </FormLayout.Footer>
    );
  };

  const renderForm = () => {
    return (
      <FormLayout.Form>
        <Box
          sx={{
            width: { lg: '100%' },
            pt: 4,
            px: 2,
          }}
        >
          <Form formElements={activeForm.form_elements} isOpen={false} />
        </Box>
      </FormLayout.Form>
    );
  };

  const renderTitle = () => {
    const userTypeMap = {
      scout: props.t('Scout'),
      official: props.t('Official'),
    };

    const modeMap = {
      EDIT: props.t('Edit'),
      CREATE: props.t('Create'),
    };

    const title = `${modeMap[props.mode]} ${userTypeMap[props.userType]}`;

    return (
      <FormLayout.Title>
        <Header title={title} />
      </FormLayout.Title>
    );
  };

  return (
    <FormLayout>
      {renderTitle()}
      <FormLayout.Body>
        <FormLayout.Content>
          {renderForm()}
          {renderFooter()}
        </FormLayout.Content>
      </FormLayout.Body>
    </FormLayout>
  );
};

export const CreateEditScoutAppTranslated =
  withNamespaces()(CreateEditScoutApp);
export default CreateEditScoutApp;
