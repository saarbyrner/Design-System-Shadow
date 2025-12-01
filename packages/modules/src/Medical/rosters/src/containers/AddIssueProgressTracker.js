// @flow
import { useDispatch } from 'react-redux';
import { ProgressTracker } from '@kitman/components';
import { goToNextPanelPage, goToPreviousPanelPage } from '../redux/actions';
import { isChronicIssue } from '../../../shared/utils';

type Props = {
  currentHeadingId: number,
  headings: Array<{ id: number, name: string }>,
  formValidation: Function,
  issueType: string,
};

// Container Allowing more mobile functionality
export default (props: Props) => {
  const dispatch = useDispatch();

  return (
    <ProgressTracker
      {...props}
      progressNext={() => dispatch(goToNextPanelPage())}
      progressBack={() => dispatch(goToPreviousPanelPage())}
      formValidation={() =>
        props.formValidation(
          window.featureFlags['preliminary-injury-illness'] &&
            !isChronicIssue(props.issueType)
            ? 'preliminary'
            : 'full'
        )
      }
    />
  );
};
