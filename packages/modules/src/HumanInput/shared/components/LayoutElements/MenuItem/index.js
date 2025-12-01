// @flow
import { type Node, useState, useRef, useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';

import { colors } from '@kitman/common/src/variables';

import {
  ListItemButton,
  ListItemText,
  Typography,
  Tooltip,
} from '@kitman/playbook/components';

import type { FormMenuItem } from '@kitman/modules/src/HumanInput/types/forms';
import { getDrawerState } from '@kitman/modules/src/HumanInput/shared/redux/selectors/formMenuSelectors';
import useStatus from '@kitman/modules/src/HumanInput/hooks/useStatus';
import Status from '../../UIElements/Status';

type Props = {
  formMenuItem: FormMenuItem,
  onClick: Function,
  isActive: boolean,
  showMenuIcons: boolean,
};

const MenuItem = (props: Props): Node => {
  const { isOpen: isDrawerOpen } = useSelector(getDrawerState);
  const title = props.formMenuItem.title;
  const textRef = useRef<?HTMLElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const getPaddingLeft = () => {
    if (props.showMenuIcons) {
      if (isDrawerOpen) {
        return 6;
      }
      return 2;
    }
    return 6;
  };
  const styles = {
    background: props.isActive && colors.neutral_100,
    minHeight: 36,
    pl: getPaddingLeft(),
  };
  const status = useStatus({ fields: props.formMenuItem.fields });

  const statusComponent = <Status status={status} />;

  useLayoutEffect(() => {
    const currentTextElement = textRef.current;
    if (currentTextElement) {
      // Check if text is overflowing
      setIsOverflowing(
        currentTextElement.scrollWidth > currentTextElement.clientWidth
      );
    }
  }, [title, isDrawerOpen, props.showMenuIcons]); // Re-check on title or layout changes

  return (
    <ListItemButton
      divider
      key={props.formMenuItem.key}
      onClick={props.onClick}
      sx={styles}
    >
      {(props.showMenuIcons || status === 'INVALID') && statusComponent}

      <ListItemText>
        {isOverflowing ? (
          <Tooltip title={title} placement="right">
            <Typography
              ref={textRef}
              variant="body2"
              sx={{ color: colors.grey_200 }}
              noWrap
            >
              {title}
            </Typography>
          </Tooltip>
        ) : (
          <Typography
            ref={textRef}
            variant="body2"
            sx={{ color: colors.grey_200 }}
            noWrap
          >
            {title}
          </Typography>
        )}
      </ListItemText>
    </ListItemButton>
  );
};

export default MenuItem;
