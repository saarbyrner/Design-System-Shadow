// @flow
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { Drawer } from '@kitman/playbook/components';
import { drawerMixin } from '@kitman/modules/src/UserMovement/shared/mixins';
import { useTheme } from '@kitman/playbook/hooks';
import { useSelector } from 'react-redux';
import { getIsPanelOpen } from '../../redux/selectors/createFixtureSelectors';
import ManageSectionLayout from '../../layouts/ManageSectionLayout';
import { ActionsTranslated as Actions } from './components/Actions';
import useCreateFixture from './hooks/useCreateFixture';

const CreateFixturePanel = (props: I18nProps<{}>) => {
  const theme = useTheme();
  const isOpen = useSelector(getIsPanelOpen);

  const { handleOnToggle } = useCreateFixture();

  const renderContent = () => {
    if (!isOpen) return null;
    return (
      <ManageSectionLayout>
        <ManageSectionLayout.Title
          title={props.t('Create Fixture')}
          onClose={() => handleOnToggle(false)}
        />
        <ManageSectionLayout.Content>
          {/* Form to go here */}
          <div />
        </ManageSectionLayout.Content>
        <ManageSectionLayout.Actions>
          <Actions />
        </ManageSectionLayout.Actions>
      </ManageSectionLayout>
    );
  };
  return (
    <Drawer
      open={isOpen}
      anchor="right"
      onClose={() => {}}
      sx={drawerMixin({ theme, isOpen })}
    >
      {renderContent()}
    </Drawer>
  );
};

export default CreateFixturePanel;

export const CreateFixturePanelTranslated =
  withNamespaces()(CreateFixturePanel);
