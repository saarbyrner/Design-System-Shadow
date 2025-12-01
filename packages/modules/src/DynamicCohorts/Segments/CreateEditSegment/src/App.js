// @flow
import { AppStatus, DelayedLoadingFeedback } from '@kitman/components';
import { withNamespaces } from 'react-i18next';
import { useGetPermissionsQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  onUpdateForm,
  onUpdateQueryParams,
} from '@kitman/modules/src/DynamicCohorts/Segments/CreateEditSegment/redux/slices/segmentSlice';
import { MODES } from '@kitman/modules/src/HumanInput/shared/constants/index';
import styles from './styles';
import { FormFooterTranslated as FormFooter } from './components/FormFooter';
import { FormInputsTranslated as FormInputs } from './components/FormInputs';
import { AthletesGridTranslated as AthletesGrid } from './components/AthletesGrid/AthletesGrid';
import { useFetchSegmentQuery } from '../redux/services/segmentsApi';

const CreateEditSegmentApp = ({ mode, id }: { mode: string, id: number }) => {
  const dispatch = useDispatch();

  const { data: permissions, isSuccess } = useGetPermissionsQuery();
  const {
    data: segment,
    isLoading: isSegmentLoading,
    isError: isSegmentError,
    isSuccess: isSegmentSuccess,
  } = useFetchSegmentQuery({ id }, { skip: mode === MODES.CREATE });

  useEffect(() => {
    if (mode === MODES.EDIT && isSegmentSuccess) {
      dispatch(
        onUpdateForm({
          id,
          name: segment.name,
          expression: JSON.parse(segment.expression),
        })
      );
      dispatch(
        onUpdateQueryParams({
          expression: JSON.parse(segment.expression),
          nextId: null,
        })
      );
    }
  }, [segment]);

  if (isSegmentError) {
    return <AppStatus status="error" isEmbed />;
  }
  if (isSegmentLoading) {
    return <DelayedLoadingFeedback />;
  }
  if (
    isSuccess &&
    permissions.settings.isSegmentsAdmin &&
    (isSegmentSuccess || mode === MODES.CREATE)
  ) {
    return (
      <div css={styles.container}>
        <FormInputs mode={mode} />
        <AthletesGrid />
        <FormFooter mode={mode} />
      </div>
    );
  }
  return null;
};

export const CreateEditSegmentAppTranslated =
  withNamespaces()(CreateEditSegmentApp);
export default CreateEditSegmentApp;
