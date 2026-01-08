// @flow
import useWindowSize from '@kitman/common/src/hooks/useWindowSize';
import styles from './style';

type Props = {
  currentHeadingId: number,
  headings: Array<{ id: number, name: string }>,
  progressNext?: () => void,
  progressBack?: () => void,
  formValidation?: (Function) => boolean,
};

const ProgressTracker = (props: Props) => {
  const {
    currentHeadingId,
    headings,
    progressBack,
    progressNext,
    formValidation,
  } = props;
  const { style, currentProgressStyle, currentProgressChevron, headingStyle } =
    styles;
  const { windowWidth, tabletSize } = useWindowSize();

  const renderAllHeadings = () =>
    headings.map(({ id, name }) => (
      <h4 key={id} css={headingStyle(currentHeadingId === id)}>
        {name}
      </h4>
    ));

  const renderCurrentHeading = () => {
    const currentHeading = headings.find(
      (heading) => heading.id === currentHeadingId
    );
    return (
      <div css={style.progressMobileHeading}>
        <i
          data-testid="icon-back-chevron"
          className="icon-next-left"
          css={currentProgressChevron(
            currentHeadingId !== headings[0].id,
            false
          )}
          onClick={progressBack}
        />
        <div css={style.progressMobileCurrentHeading}>
          <span css={style.progressCurrentStatusText}>
            Step {currentHeading?.id} of {headings.length}
          </span>
          <h4 key={props.currentHeadingId} css={headingStyle(true)}>
            {currentHeading?.name}
          </h4>
        </div>
        <i
          data-testid="icon-next-chevron"
          className="icon-next-right"
          css={currentProgressChevron(
            currentHeadingId !== headings[props.headings.length - 1].id,
            true
          )}
          onClick={() => {
            if (formValidation && formValidation() && progressNext) {
              progressNext();
            }
          }}
        />
      </div>
    );
  };

  return (
    <>
      <div role="progressbar" css={style.progressBarContainer}>
        <hr css={style.progressBarBackground} />
        <hr css={currentProgressStyle(headings.length, currentHeadingId)} />
      </div>
      <div css={style.progressHeadingContainer}>
        {windowWidth >= tabletSize
          ? renderAllHeadings()
          : renderCurrentHeading()}
      </div>
    </>
  );
};

export default ProgressTracker;
