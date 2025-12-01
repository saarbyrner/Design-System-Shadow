// @flow
import style from '../../style';

export type Props = {
  text: string,
  secondaryText?: ?string,
};

const SectionHeading = (props: Props) => {
  return (
    <div css={style.sectionHeading}>
      <span css={style.headingText}>{props.text}</span>
      {props.secondaryText && (
        <span
          css={style.headingSecondaryText}
          data-testid="SectionHeading|OptionalText"
        >
          {props.secondaryText}
        </span>
      )}
    </div>
  );
};

export default SectionHeading;
