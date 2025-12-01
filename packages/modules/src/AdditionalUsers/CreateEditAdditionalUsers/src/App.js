// @flow
import { withNamespaces } from 'react-i18next';
import FormLayout from '@kitman/modules/src/HumanInput/shared/components/FormLayout';
import ProfileHeaderLayout from '@kitman/modules/src/LeagueOperations/shared/layouts/ProfileHeaderLayout';
import { AdditionalUsersFormTranslated as AdditionalUsersForm } from '@kitman/modules/src/AdditionalUsers/CreateEditAdditionalUsers/src/components/AdditionalUsersForm';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type {
  AdditionalUserTypes,
  Mode,
} from '@kitman/modules/src/AdditionalUsers/shared/types';
import { FormTitle } from '@kitman/modules/src/AdditionalUsers/shared/consts';

type Props = {
  mode: Mode,
  userType: AdditionalUserTypes,
};

const CreateEditAdditionalUsersApp = ({ mode, userType }: I18nProps<Props>) => {
  const formTitle = FormTitle[mode][userType];
  return (
    <FormLayout>
      <FormLayout.Title>
        <ProfileHeaderLayout>
          <ProfileHeaderLayout.Main>
            <ProfileHeaderLayout.Content>
              <h4>{formTitle}</h4>
            </ProfileHeaderLayout.Content>
          </ProfileHeaderLayout.Main>
        </ProfileHeaderLayout>
      </FormLayout.Title>
      <FormLayout.Body>
        <FormLayout.Content>
          <FormLayout.Form>
            <AdditionalUsersForm />
          </FormLayout.Form>
        </FormLayout.Content>
      </FormLayout.Body>
    </FormLayout>
  );
};

export const CreateEditAdditionalUsersAppTranslated = withNamespaces()(
  CreateEditAdditionalUsersApp
);
export default CreateEditAdditionalUsersApp;
