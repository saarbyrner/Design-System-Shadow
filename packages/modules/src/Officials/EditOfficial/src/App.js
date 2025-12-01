// @flow
import { useEffect } from 'react';
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
import {
  useFetchOfficialQuery,
  useUpdateOfficialMutation,
} from '../../shared/redux/services';
import { OfficialsFormTranslated as OfficialsForm } from '../../shared/components/OfficialsForm';
import { onUpdateForm } from '../../shared/redux/slices/officialSlice';

const style = {
  editOfficialsApp: css`
    background-color: ${colors.background};
    min-height: calc(100vh - 50px);
  `,
  title: css`
    color: ${colors.grey_300};
    font-weight: 600;
    font-size: 20px;
  `,
};

type Props = {
  id: number,
};

const EditOfficialsApp = (props: I18nProps<Props>) => {
  const dispatch = useDispatch();
  const locationAssign = useLocationAssign();

  const { formState } = useSelector((state) => state.officialSlice);

  const { data: official } = useFetchOfficialQuery(props.id);

  useEffect(() => {
    dispatch(
      onUpdateForm({
        firstname: official?.firstname,
        lastname: official?.lastname,
        email: official?.email,
        date_of_birth: official?.date_of_birth,
        locale: official?.locale,
        is_active: !!official?.is_active,
      })
    );
  }, [official, dispatch]);

  const [onUpdateOfficial, { isLoading: isOfficialUpdateLoading }] =
    useUpdateOfficialMutation();

  const onHandleUpdateOfficial = () => {
    onUpdateOfficial({
      id: props.id,
      official: formState,
    })
      .unwrap()
      .then(() => {
        dispatch(
          add({
            status: 'SUCCESS',
            title: props.t('Success editing official'),
          })
        );
        locationAssign(redirectUrl('official'));
      })
      .catch(() => {
        dispatch(
          add({
            status: 'ERROR',
            title: props.t('Error editing official'),
          })
        );
      });
  };

  const renderContent = () => {
    return (
      <OfficialsForm
        isRequestPending={isOfficialUpdateLoading}
        onClickSave={() => onHandleUpdateOfficial()}
      />
    );
  };

  return (
    <div className="editOfficialsApp" css={style.editOfficialsApp}>
      <Header />
      <TabLayout>
        <TabLayout.Body>
          <TabLayout.Content>{renderContent()}</TabLayout.Content>
        </TabLayout.Body>
      </TabLayout>
    </div>
  );
};

export const EditOfficialsAppTranslated = withNamespaces()(EditOfficialsApp);
export default EditOfficialsApp;
