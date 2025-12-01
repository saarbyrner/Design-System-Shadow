// @flow
import { css } from '@emotion/react';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import { useSelector, useDispatch } from 'react-redux';
import { colors } from '@kitman/common/src/variables';
import { withNamespaces } from 'react-i18next';
import { add } from '@kitman/modules/src/Toasts/toastsSlice';
import TabLayout from '@kitman/components/src/TabLayout';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { redirectUrl } from '@kitman/modules/src/AdditionalUsers/shared/utils';
import { HeaderTranslated as Header } from './components/Header';
import { useCreateOfficialMutation } from '../../shared/redux/services';
import { OfficialsFormTranslated as OfficialsForm } from '../../shared/components/OfficialsForm';

const style = {
  createOfficialsApp: css`
    background-color: ${colors.background};
    min-height: calc(100vh - 50px);
  `,
  title: css`
    color: ${colors.grey_300};
    font-weight: 600;
    font-size: 20px;
  `,
};

type Props = {};

const CreateOfficialsApp = (props: I18nProps<Props>) => {
  const dispatch = useDispatch();
  const locationAssign = useLocationAssign();

  const { formState } = useSelector((state) => state.officialSlice);

  const [onCreateOfficial, { isLoading: isOfficialCreateLoading }] =
    useCreateOfficialMutation();

  const onHandleCreateOfficial = () => {
    onCreateOfficial(formState)
      .unwrap()
      .then(() => {
        dispatch(
          add({
            status: 'SUCCESS',
            title: props.t('Success creating official'),
          })
        );
        locationAssign(redirectUrl('official'));
      })
      .catch(() => {
        dispatch(
          add({
            status: 'ERROR',
            title: props.t('Error creating official'),
          })
        );
      });
  };

  const renderContent = () => {
    return (
      <OfficialsForm
        isRequestPending={isOfficialCreateLoading}
        onClickSave={() => onHandleCreateOfficial()}
      />
    );
  };

  return (
    <div className="createOfficialsApp" css={style.createOfficialsApp}>
      <Header />
      <TabLayout>
        <TabLayout.Body>
          <TabLayout.Content>{renderContent()}</TabLayout.Content>
        </TabLayout.Body>
      </TabLayout>
    </div>
  );
};

export const CreateOfficialsAppTranslated =
  withNamespaces()(CreateOfficialsApp);
export default CreateOfficialsApp;
