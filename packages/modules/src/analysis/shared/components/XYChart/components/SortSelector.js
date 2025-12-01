// @flow

// React
import { type ComponentType, useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';

// Internationalization
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';

// Components
import {
  Popover,
  Box,
  MenuList,
  MenuItem,
  ListItemText,
  IconButton,
  Divider,
  Button,
} from '@kitman/playbook/components';
import { getChartConfig } from '@kitman/modules/src/analysis/Dashboard/redux/selectors/chartBuilder';

// Icons
import { KitmanIcon, KITMAN_ICON_NAMES } from '@kitman/playbook/icons';

// Colors
import { colors } from '@kitman/common/src/variables';

// Context
import useChartContext from '@kitman/modules/src/analysis/shared/components/XYChart/hooks/useChartContext';

// Constants, Types & Utils
import { extraSmallIconSize } from '@kitman/playbook/icons/consts';
import { getSortOrderList } from '@kitman/modules/src/analysis/shared/components/XYChart/utils';
import { SORT_ORDER } from '../constants';

type Props = {
  onSortChange: Function,
  chartId: number,
};

const styles = {
  container: {
    position: 'absolute',
    top: '50px',
    right: '5rem',
  },
  popoverContainer: {
    width: '228px',
  },
  popoverHeader: {
    paddingBottom: '0.2rem',
    paddingLeft: '0.6rem',
    fontWeight: 500,
    cursor: 'pointer',
  },
  headerButton: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
    color: colors.grey_200,
    backgroundColor: colors.p06,
    '&:hover': {
      backgroundColor: colors.p06,
    },
  },
  selectedSortOrder: {
    backgroundColor: colors.grey_100,
    color: colors.p06,
    '&:hover': {
      color: colors.grey_200,
    },
  },
  menuItem: {
    display: 'flex',
    justifyContent: 'space-between',
  },
};

const SORT_MODES = {
  LEVEL_ONE: 'element_selection',
  LEVEL_TWO: 'sort_Selection',
};

const SortSelector = (props: I18nProps<Props>) => {
  const { series } = useChartContext();

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAttribute, setSelectedAttribute] = useState(null);
  const [sortOption, setSortOption] = useState(SORT_ORDER.DEFAULT);
  const [selectionMode, setSelectionMode] = useState(SORT_MODES.LEVEL_ONE);

  const sortOptions = getSortOrderList();
  const chartConfig = useSelector(getChartConfig(props.chartId));

  const sortableAttributes = useMemo(() => {
    if (!series) {
      return [];
    }
    return Object.keys(series).map((key) => {
      return { id: series[key].id, value: series[key].name };
    });
  }, [series]);

  const effectiveSortConfig = useMemo(() => {
    if (!series) {
      return null;
    }
    const ele = Object.keys(series).find(
      (key) => series[key].sortConfig?.sortOrder
    );
    return ele ? series[ele].sortConfig : null;
  }, [series]);

  useEffect(() => {
    if (effectiveSortConfig) {
      setSelectedAttribute(
        sortableAttributes.find((c) => c.id === effectiveSortConfig.sortBy)
      );
      setSortOption(effectiveSortConfig.sortOrder);
      setSelectionMode(SORT_MODES.LEVEL_TWO);
    }
  }, [effectiveSortConfig, sortableAttributes]);

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const onSortSelection = (value) => {
    if (!selectedAttribute) {
      return;
    }

    setSortOption(value);
    props.onSortChange({
      ...chartConfig,
      sortConfig: {
        sortBy: selectedAttribute.id,
        sortOrder: value,
      },
    });
    handleClosePopover();
  };

  const getElementSelectionBody = () => {
    return sortableAttributes?.map((attribute) => {
      return (
        <MenuItem
          key={attribute.id}
          onClick={() => {
            setSelectedAttribute(attribute);
            setSelectionMode(SORT_MODES.LEVEL_TWO);
          }}
        >
          <ListItemText>
            <div css={styles.menuItem}>
              <div>{attribute.value}</div>
              <div>
                <KitmanIcon
                  fontSize={extraSmallIconSize}
                  name={KITMAN_ICON_NAMES.ArrowForwardIos}
                />
              </div>
            </div>
          </ListItemText>
        </MenuItem>
      );
    });
  };

  const getSortSelectionBody = () => {
    return (
      <div>
        {sortOptions.map((o) => {
          return (
            <MenuItem
              data-testid={o.key}
              css={sortOption === o.key ? styles.selectedSortOrder : ''}
              key={o.key}
              onClick={() => onSortSelection(o.key)}
            >
              <ListItemText>{o.label}</ListItemText>
            </MenuItem>
          );
        })}
      </div>
    );
  };

  const getPopoverBody = () => {
    switch (selectionMode) {
      case SORT_MODES.LEVEL_ONE:
        return getElementSelectionBody();
      case SORT_MODES.LEVEL_TWO:
        return getSortSelectionBody();
      default:
        return <></>;
    }
  };

  useEffect(() => {
    getPopoverBody();
  }, [selectionMode]);

  const handleOpenPopover = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const renderSortSelectorPopover = () => {
    const open = Boolean(anchorEl);
    const id = open ? 'sort-selector-menu' : undefined;

    return (
      <Box>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClosePopover}
          elevation={12}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <div css={styles.popoverContainer}>
            <MenuList dense>
              {selectionMode === SORT_MODES.LEVEL_ONE ? (
                <div css={styles.popoverHeader}> {props.t('Sort Data')} </div>
              ) : (
                <Button
                  data-testid="XYChart|SortSelector|Header"
                  css={styles.headerButton}
                  onClick={() => setSelectionMode(SORT_MODES.LEVEL_ONE)}
                >
                  <KitmanIcon
                    fontSize={extraSmallIconSize}
                    name={KITMAN_ICON_NAMES.ArrowBackIos}
                  />
                  <span> {selectedAttribute?.value}</span>
                </Button>
              )}
              <Divider />
              {getPopoverBody()}
            </MenuList>
          </div>
        </Popover>
      </Box>
    );
  };

  return (
    <div css={styles.container} data-testid="XYChart|SortSelector">
      <IconButton
        data-testid="XYChart|SortSelector|Button"
        size="small"
        color="primary"
        onClick={handleOpenPopover}
      >
        <KitmanIcon fontSize="small" name={KITMAN_ICON_NAMES.North} />
        <KitmanIcon fontSize="small" name={KITMAN_ICON_NAMES.South} />
      </IconButton>

      {renderSortSelectorPopover()}
    </div>
  );
};

export const SortSelectorTranslated: ComponentType<Props> =
  withNamespaces()(SortSelector);
export default SortSelector;
