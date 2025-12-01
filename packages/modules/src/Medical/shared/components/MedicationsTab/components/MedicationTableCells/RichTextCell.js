// @flow
import { useState } from 'react';
import { colors } from '@kitman/common/src/variables';
import { RichTextDisplay } from '@kitman/components';
import { IconButton, Box } from '@kitman/playbook/components';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';

type Props = {
  value?: string,
  abbreviatedHeight: number, // pixels
};

const RichTextCell = (props: Props) => {
  const [abbreviated, setAbbreviated] = useState(true);

  const styles = {
    iconButton: {
      width: '24px',
      height: '24px',
      padding: '0',
      display: abbreviated ? 'none' : 'block',

      // TODO: Use has Selector in 2025 once adoption grown
      /*
      This would simplify the layout with IconButton coming first
      '&:has(+ .richTextDisplay--abbreviated)': {
        display: 'block',
      },
      */
    },

    container: {
      display: 'flex',
      flexDirection: 'row-reverse',
      color: colors.grey_100,
      fontSize: '12px',
      fontWeight: '400',
      lineHeight: '16px',
      background: colors.white,
      position: 'relative',

      '.richTextDisplay': {
        width: '100%',

        p: {
          marginBottom: '4px',
        },

        ul: {
          margin: 0,
          paddingInlineStart: '14px',
        },

        ol: {
          margin: 0,
          paddingInlineStart: '14px',
        },

        li: {
          margin: 0,
          lineHeight: 'normal',
        },
      },

      '.richTextDisplay--abbreviated': {
        width: '100%',
        maxHeight: `${props.abbreviatedHeight}px`,

        '&:after': {
          display: 'block',
          content: '"..."',
          position: 'absolute',
          bottom: 0,
          height: 'min-content',
          paddingTop: '4px',
        },
      },

      '.richTextDisplay--abbreviated + #expand': {
        display: 'block',
      },

      '.richTextDisplay p': {
        marginBottom: '4px',
      },
    },
  };

  const toggleAbbreviated = () => {
    setAbbreviated((prev) => !prev);
  };

  return (
    <Box display="flex" alignItems="top" sx={styles.container}>
      <RichTextDisplay
        value={props.value}
        isAbbreviated={abbreviated}
        abbreviatedHeight={props.abbreviatedHeight}
      />
      <IconButton
        aria-label="expand"
        id="expand"
        size="small"
        disableRipple
        onClick={toggleAbbreviated}
        sx={styles.iconButton}
      >
        <KitmanIcon
          name={KITMAN_ICON_NAMES.ExpandMore}
          fontSize="small"
          style={{
            color: colors.grey_100,
            transform: abbreviated ? 'rotate(-90deg)' : 'rotate(0deg)',
            transition: 'transform 0.1s linear 0s',
          }}
        />
      </IconButton>
    </Box>
  );
};

export default RichTextCell;
