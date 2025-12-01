// @flow
import { Fragment, useRef, useState, useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import type { Node } from 'react';

import i18n from '@kitman/common/src/utils/i18n';
import { colors } from '@kitman/common/src/variables';
import { getMenuGroupValidationFactory } from '@kitman/modules/src/HumanInput/shared/redux/selectors/formValidationSelectors';
import {
  ListItemButton,
  ListItemText,
  Typography,
  Collapse,
  Tooltip,
} from '@kitman/playbook/components';
import { getDrawerState } from '@kitman/modules/src/HumanInput/shared/redux/selectors/formMenuSelectors';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import { validationResult } from '@kitman/modules/src/HumanInput/shared/utils/validation';
import type { FormMenuItem } from '@kitman/modules/src/HumanInput/types/forms';
import ExpandToggle from '@kitman/modules/src/HumanInput/shared/components/UIElements/ExpandToggle';
import useStatus from '@kitman/modules/src/HumanInput/hooks/useStatus';
import Status from '../../UIElements/Status';

type Props = {
  formMenuItem: FormMenuItem,
  children: Node,
  isActive: boolean,
  onClick: Function,
  showMenuIcons: boolean,
};

const MenuGroup = (props: Props): Node => {
  const title = props.formMenuItem.title;
  const titleRef = useRef<?HTMLElement>(null);
  const [isTitleOverflowing, setIsTitleOverflowing] = useState(false);
  const showMenuIcons = props.showMenuIcons;
  const styles = {
    background: props.isActive && colors.neutral_100,
    px: 2,
  };
  const status = useStatus({ fields: props.formMenuItem.fields });
  const menuGroupItems = props.formMenuItem.items.map((item) => {
    return item.fields;
  });
  const menuGroupValidation = useSelector(
    getMenuGroupValidationFactory(menuGroupItems)
  );
  const { isOpen: isDrawerOpen } = useSelector(getDrawerState);

  const stepsCompleted = menuGroupValidation
    .map((itemValidation) => {
      if (itemValidation?.some((vs) => vs === validationResult.INVALID)) {
        return validationResult.INVALID;
      }
      if (
        itemValidation?.length &&
        itemValidation?.every((vs) => vs === validationResult.VALID)
      )
        return validationResult.VALID;

      return validationResult.PENDING;
    })
    .reduce((numberOfSteps, step) => {
      if (step === validationResult.VALID) {
        return numberOfSteps + 1;
      }
      return numberOfSteps;
    }, 0);

  const statusComponent = <Status status={status} />;

  useLayoutEffect(() => {
    const currentTitleElement = titleRef.current;
    if (currentTitleElement) {
      setIsTitleOverflowing(
        currentTitleElement.scrollWidth > currentTitleElement.clientWidth
      );
    }
  }, [title, isDrawerOpen]);

  return (
    <Fragment>
      <ListItemButton divider sx={styles} onClick={props.onClick}>
        {(showMenuIcons || status === 'INVALID') && statusComponent}
        <ListItemText sx={{ ml: isDrawerOpen ? 0 : 5 }}>
          {isTitleOverflowing ? (
            <Tooltip title={title} placement="top">
              <Typography
                ref={titleRef}
                variant="body2"
                sx={{ color: colors.grey_200 }}
                noWrap
              >
                {title}
              </Typography>
            </Tooltip>
          ) : (
            <Typography
              ref={titleRef}
              variant="body2"
              sx={{ color: colors.grey_200 }}
              noWrap
            >
              {title}
            </Typography>
          )}
          {showMenuIcons && (
            <Typography variant="body2" sx={{ color: colors.grey_100 }}>
              {i18n.t('{{numerator}} of {{denominator}} steps completed', {
                numerator: stepsCompleted,
                denominator: props.formMenuItem.items?.length || 0,
              })}
            </Typography>
          )}
        </ListItemText>

        {isDrawerOpen && (
          <ExpandToggle isActive={props.isActive}>
            <KitmanIcon name={KITMAN_ICON_NAMES.ExpandMore} />
          </ExpandToggle>
        )}
      </ListItemButton>
      {props.formMenuItem.items.length > 0 && (
        <Collapse in={props.isActive} timeout="auto" unmountOnExit>
          {props.children}
        </Collapse>
      )}
    </Fragment>
  );
};

export default MenuGroup;
