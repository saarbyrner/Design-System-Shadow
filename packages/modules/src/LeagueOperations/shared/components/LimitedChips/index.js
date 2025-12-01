// @flow
import { Chip, Box, Tooltip } from '@kitman/playbook/components';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';

/**
 * Renders a limited number of chips from an array of items.
 *
 * This component displays a specified number of chips. If the total number of
 * items exceeds this limit, it shows a "+N" chip that, when hovered over,
 * reveals a tooltip containing the names of the remaining items. Each chip's
 * background color can be set either by an individual item's `color` property
 * or a fallback `backgroundColor` for the entire group.
 *
 * @template T - The type of items in the array. This type must have `id`, `name`, and an optional `color` property.
 * @param {{
 * items: ?Array<T>,
 * backgroundColor?: ?string,
 * maxVisible?: number
 * }} props
 * @param {?Array<T>} props.items - An array of items to be displayed as chips. If null or empty, the component returns null.
 * @param {?string} [props.backgroundColor] - An optional background color for all chips in the group. This is overridden by an individual item's `color` property if it exists.
 * @param {number} [props.maxVisible=2] - The maximum number of chips to display before showing the "+N" chip.
 * @returns {Node | null} A React node containing the chips or null if no items are provided.
 */
const LimitedChips = <
  T: { id: number | string, name: string, color?: string, textColor?: string }
>({
  items,
  backgroundColor,
  maxVisible = 2,
}: {
  items: ?Array<T>,
  backgroundColor?: ?string,
  maxVisible?: number,
}) => {
  if (!items || items.length === 0) {
    return null;
  }

  const visibleItems = items.slice(0, maxVisible);
  const hiddenItems = items.slice(maxVisible);
  const remainingCount = hiddenItems.length;
  const hasBackgroundColor = backgroundColor && { backgroundColor };
  const style = (item) => {
    let styleItems = {
      textTransform: 'capitalize',
      ...((item.color && { backgroundColor: item.color }) ||
        hasBackgroundColor),
      width: 'fit-content',
      marginRight: 1,
    };

    if (item.textColor) {
      styleItems = {
        ...styleItems,
        color: item.textColor,
      };
    }
    return styleItems;
  };

  return (
    <Box display="flex" flexWrap="wrap">
      {visibleItems.map((item) => (
        <Chip
          size="small"
          data-testid={`chip-${item.id}-${item.name}`}
          key={`${item.id}-${item.name}`}
          label={item.name}
          sx={style(item)}
        />
      ))}
      {remainingCount > 0 && (
        <Tooltip
          title={
            <Box>
              {hiddenItems.map((item) => (
                <Box key={item.id}>{item.name}</Box>
              ))}
            </Box>
          }
          slotProps={{
            popper: {
              'data-testid': 'remaining-results-tooltip',
            },
          }}
          arrow
        >
          <Chip
            data-testid="more-chip"
            icon={<KitmanIcon name={KITMAN_ICON_NAMES.Add} />}
            label={remainingCount}
            size="small"
            key="more"
          />
        </Tooltip>
      )}
    </Box>
  );
};

export default LimitedChips;
