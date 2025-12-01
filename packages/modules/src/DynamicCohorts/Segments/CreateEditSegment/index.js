// @flow
import { AppStatus, DelayedLoadingFeedback } from '@kitman/components';
import useGlobal from '@kitman/common/src/redux/global/hooks/useGlobal';
import useLocationPathname from '@kitman/common/src/hooks/useLocationPathname';

import { parseIdFromLocation } from '@kitman/modules/src/DynamicCohorts/shared/routes/utils';
import { CreateEditSegmentAppTranslated as CreateEditSegmentApp } from './src/App';

type Props = {
  mode: string,
};

export default (props: Props) => {
  const { isLoading, hasFailed, isSuccess } = useGlobal();

  const { id } = parseIdFromLocation(useLocationPathname());

  if (hasFailed) {
    return <AppStatus status="error" isEmbed />;
  }
  if (isLoading) {
    return <DelayedLoadingFeedback />;
  }
  if (isSuccess) {
    return <CreateEditSegmentApp mode={props.mode} id={id} />;
  }

  return null;
};
