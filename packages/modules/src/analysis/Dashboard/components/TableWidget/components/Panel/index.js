// @flow
import type { Node } from 'react';
import { css } from '@emotion/react';
import type { SerializedStyles } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';
import type { ObjectStyle } from '@kitman/common/src/types/styles';

const styles = {
  panel: css`
    height: calc(100% - 68px);
    display: flex;
    flex-direction: column;
  `,
  content: css`
    padding: 15px 0;
    flex: 1;
    overflow: auto;

    .dropdownWrapper {
      position: relative;

      &__search {
        width: auto;
      }
    }
  `,
  contentFade: css`
    width: 100%;
    position: absolute;
    bottom: 73px;
    height: 20px;
    background: rgb(255, 255, 255);
    background: linear-gradient(
      0deg,
      rgba(255, 255, 255, 1) 0%,
      rgba(255, 255, 255, 0) 100%
    );
  `,
  field: css`
    margin: 10px 20px;

    .slidingPanel__rollingDatePicker {
      margin: 20px 0;
    }

    .lastXDaysSelector {
      display: flex;
      margin: 20px 0 !important;
      width: 100% !important;

      .input-group {
        color: ${colors.grey_100};
      }

      &__input-cont {
        float: none;
      }

      &__options {
        float: none;
      }
    }

    .lastXPeriodOffset {
      display: block;
      height: auto;

      .lastXPeriodPicker {
        display: flex;
        margin-top: 15px;

        &__input-cont {
          float: none;
        }

        &__options {
          float: none;
        }
      }
    }
  `,
  subField: css`
    margin: 0 20px;

    border: solid 1px ${colors.neutral_300};
    border-right: none;
    border-left-width: 4px;
  `,
  inlineField: css`
    margin: 10px 20px;
    display: flex;
    align-items: end;
  `,
  inlineFieldLabel: css`
    margin-left: 10px;
    margin-bottom: 7px;
    flex: 2;

    font-weight: 400;
    font-size: 12px;
    color: ${colors.grey_100};
  `,
  actions: css`
    align-items: center;
    background: ${colors.p06};
    border-top: 1px solid ${colors.s14};
    display: flex;
    justify-content: flex-end;
    padding: 20px 30px;
    text-align: center;
    width: 100%;
    z-index: 1000;

    .reactCheckbox {
      margin-right: 10px;
    }
  `,
  loading: css`
    background-image: url('../../img/spinner.svg');
    background-position: center;
    background-repeat: no-repeat;
    background-size: 60px;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: white;
    opacity: 0.4;
  `,
  divider: css`
    border-top: solid 1px ${colors.neutral_300};
    margin-right: 20px;
    margin-left: 20px;
  `,
  title: css`
    color: ${colors.grey_100};
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 4px;
  `,
  sectionTitle: css`
    font-weight: 600;
    font-size: 14px;
    margin: 10px 20px;
  `,
};

type Props = {
  children: Node,
  styles?: SerializedStyles | ObjectStyle,
};

type PropsWithDataAttribute = {
  ...Props,
  dataAttribute?: string,
};

const Panel = (props: Props) => (
  <div css={[styles.panel, props.styles]}>{props.children}</div>
);

const Content = (props: Props) => (
  <div css={[styles.content, props.styles]}>
    {props.children}
    <div css={styles.contentFade} />
  </div>
);

const Divider = () => <hr css={styles.divider} />;

const Actions = (props: Props) => (
  <div css={[styles.actions, props.styles]}>{props.children}</div>
);

const Field = (props: Props) => (
  <div css={[styles.field, props.styles]}>{props.children}</div>
);

const FieldTitle = (props: Props) => (
  <div css={[styles.title, props.styles]}>{props.children}</div>
);

const SectionTitle = (props: PropsWithDataAttribute) => (
  <div
    css={[styles.sectionTitle, props.styles]}
    data-tooltip-target={props.dataAttribute}
  >
    {props.children}
  </div>
);

const SubField = (props: Props) => (
  <div css={[styles.subField, props.styles]}>{props.children}</div>
);

const InlineField = (props: Props) => (
  <div css={[styles.inlineField, props.styles]}>{props.children}</div>
);

const InlineFieldLabel = (props: Props) => (
  <div css={[styles.inlineFieldLabel, props.styles]}>{props.children}</div>
);

type LoadingProps = {
  isLoading: boolean,
};
const Loading = ({ isLoading }: LoadingProps) => {
  return isLoading ? <div css={styles.loading} /> : null;
};

Panel.Content = Content;
Panel.Actions = Actions;
Panel.Field = Field;
Panel.FieldTitle = FieldTitle;
Panel.SectionTitle = SectionTitle;
Panel.SubField = SubField;
Panel.InlineField = InlineField;
Panel.InlineFieldLabel = InlineFieldLabel;
Panel.Loading = Loading;
Panel.Divider = Divider;

export default Panel;
