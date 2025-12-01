// @flow
import type { Node } from 'react';
import {
  useActive,
  useChainedCommands,
  // $FlowFixMe
} from '@remirror/react';
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

const getStyles = ({ isButtonActive }: { isButtonActive: boolean }) => ({
  styleButton: css`
    ${isButtonActive &&
    `
      background-color: ${colors.p01} !important;
      border-color: ${colors.p01} !important;
      color: ${colors.p06} !important;
    `}
  `,
});

const getStylesKDS = ({ isButtonActive }: { isButtonActive: boolean }) => ({
  styleButton: css`
    ${isButtonActive &&
    `
      background-color: ${colors.blue_100} !important;
      border-color: ${colors.blue_100} !important;
      color: ${colors.p06} !important;
    `}
  `,
});

export type StyleOption = {
  id: string,
  icon: string,
  isActive: boolean,
  onClick: Function,
};

const useStyleOptions = (kitmanDesignSystem: boolean, disabled: boolean) => {
  const chain = useChainedCommands();
  const active = useActive();

  const inlineStyles = [
    {
      id: 'bold',
      icon: 'icon-font-style-bold',
      isActive: active.bold(),
      onClick: () => chain.toggleBold().focus().run(),
    },
    {
      id: 'italic',
      icon: 'icon-font-style-italic',
      isActive: active.italic(),
      onClick: () => chain.toggleItalic().focus().run(),
    },
    {
      id: 'underline',
      icon: 'icon-font-style-underline',
      isActive: active.underline(),
      onClick: () => chain.toggleUnderline().focus().run(),
    },
    {
      id: 'strikethrough',
      icon: 'icon-font-style-strikethrough',
      isActive: active.strike(),
      onClick: () => chain.toggleStrike().focus().run(),
    },
  ];

  const blockStyles = [
    {
      id: 'unordered-list-item',
      icon: 'icon-font-style-bulletlist',
      isActive: active.bulletList(),
      onClick: () => chain.toggleBulletList().focus().run(),
    },
    {
      id: 'ordered-list-item',
      icon: 'icon-font-style-numlist',
      isActive: active.orderedList(),
      onClick: () => chain.toggleOrderedList().focus().run(),
    },
  ];

  const getInlineStyleOptions = () => {
    return inlineStyles.map<Node>((style): Node => {
      const styles = kitmanDesignSystem
        ? getStylesKDS({ isButtonActive: style.isActive })
        : getStyles({ isButtonActive: style.isActive });

      return (
        <button
          key={style.id}
          type="button"
          css={styles.styleButton}
          className="richTextEditorAlt__styleButton"
          onClick={style.onClick}
          disabled={disabled}
        >
          <i className={style.icon} />
        </button>
      );
    });
  };

  const getBlockStyleOptions = () => {
    return blockStyles.map<Node>((style): Node => {
      const styles = kitmanDesignSystem
        ? getStylesKDS({ isButtonActive: style.isActive })
        : getStyles({ isButtonActive: style.isActive });

      return (
        <button
          key={style.id}
          type="button"
          css={styles.styleButton}
          className="richTextEditorAlt__styleButton"
          onClick={style.onClick}
          disabled={disabled}
        >
          <i className={style.icon} />
        </button>
      );
    });
  };

  const inlineStyleCount = inlineStyles.length;
  const blockStyleCount = blockStyles.length;

  return {
    inlineStyleCount,
    blockStyleCount,
    getInlineStyleOptions,
    getBlockStyleOptions,
  };
};

export default useStyleOptions;
