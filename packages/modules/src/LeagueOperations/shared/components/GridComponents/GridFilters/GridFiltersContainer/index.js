// @flow
import {
  cloneElement,
  Children,
  useState,
  useRef,
  useMemo,
  useCallback,
  useLayoutEffect,
  useEffect,
} from 'react';
import { Box, IconButton, Button } from '@mui/material';
import { useTheme } from '@kitman/playbook/hooks';
import useMediaQuery from '@mui/material/useMediaQuery';
import { FilterList as FilterListIcon } from '@mui/icons-material';
import colors from '@kitman/common/src/variables/colors';
import GridFiltersMobilePanel from '@kitman/modules/src/LeagueOperations/shared/components/GridComponents/GridFilters/GridFiltersMobilePanel';
import type { SxProps, Theme } from '@mui/material/styles';

type Props = {
  searchField: React$Element<any>,
  showClearAllButton?: boolean,
  children?: React$Node,
  sx?: SxProps<Theme>,
  collapseAt?: 'xl' | 'lg' | 'md' | 'sm' | 'xs',
};

export default function GridFiltersContainer({
  searchField,
  children,
  sx = {},
  showClearAllButton = false,
  collapseAt = 'lg',
}: Props) {
  const theme = useTheme();
  const isCollapsedMenu = useMediaQuery(theme.breakpoints.down(collapseAt));
  const [isOpen, setIsOpen] = useState(false);
  const childrenRefs = useRef([]);
  const searchFieldRef = useRef(null);
  const stagedFilterValues = useRef({}); // For storing changes on mobile before Save

  // Ensure children is always an array
  const childrenArray = useMemo(() => Children.toArray(children), [children]);

  const getActiveFilterCount = () => {
    let filtersAppliedCount = 0;
    childrenRefs.current.forEach((ref) => {
      if (
        typeof ref?.getIsFilterApplied === 'function' &&
        ref.getIsFilterApplied()
      ) {
        filtersAppliedCount += 1;
      }
    });
    return filtersAppliedCount;
  };

  const [activeFilterCount, setActiveFilterCount] = useState(0);

  useLayoutEffect(() => {
    setActiveFilterCount(getActiveFilterCount);
  }, []);

  useEffect(() => {
    // close the panel when the screen is not collapsed
    if (!isCollapsedMenu) {
      setIsOpen(false);
    }
  }, [isCollapsedMenu]);

  // Wraps each child in a Box for layout and adds a ref to track it.
  // The ref is saved in childrenRefs.current to allow it to be reset.
  const filters = useMemo(
    () =>
      childrenArray.map((child, index) => {
        const desktopOnChange = child.props.onChange;
        const param = child.props.param;
        const maxWidth = child.props?.maxWidth ?? 250;
        return (
          <Box
            key={param}
            sx={{
              maxWidth: isCollapsedMenu ? '100%' : maxWidth,
              width: isCollapsedMenu ? '100%' : 'auto',
              flexGrow: 1,
            }}
          >
            {cloneElement(child, {
              ref: (el) => {
                childrenRefs.current[index] = el;
              },
              onChange: (event) => {
                if (isCollapsedMenu) {
                  stagedFilterValues.current[param] = event;

                  const currentElement = childrenRefs.current.find(
                    (element) => element.getParam() === child.props.param
                  );
                  if (currentElement?.getIsMulti?.()) {
                    const ids = event.map(({ id }) => id);
                    currentElement?.setLocalValue(ids);
                  }
                } else if (desktopOnChange) {
                  desktopOnChange(event);
                  setTimeout(() => {
                    setActiveFilterCount(getActiveFilterCount());
                  });
                }
              },
            })}
          </Box>
        );
      }),
    [childrenArray, isCollapsedMenu]
  );

  const searchFieldWithRef = useMemo(
    () =>
      cloneElement(searchField, {
        ref: searchFieldRef,
        onChange: (value) => {
          searchField?.props?.onChange?.(value);
        },
      }),
    [searchField]
  );

  const clearAndSaveSearchField = useCallback(() => {
    if (searchFieldRef.current) {
      searchFieldRef.current?.reset();
      searchField.props?.onChange?.('');
    }
  }, [searchField]);

  // Calls the `reset` method on all child filter components.
  // Iterates through refs stored in `childrenRefs`, and for each one.
  // This is used to clear or reset all filters at once.
  const clearAll = useCallback(() => {
    childrenRefs.current.forEach((ref) => {
      if (ref && typeof ref.reset === 'function') {
        const key = ref.getParam();
        stagedFilterValues.current[key] = ref.getResetValue();
        // resets the local value of the component
        ref.reset();
      }
    });
  }, []);

  const handleSave = () => {
    childrenRefs.current.forEach((ref) => {
      const param = ref.getParam();
      const child = childrenArray.find(({ props }) => props.param === param);
      const stagedValue = stagedFilterValues.current[param];
      if (
        ref &&
        stagedValue !== undefined &&
        typeof child?.props?.onChange === 'function'
      ) {
        child.props.onChange(stagedValue);
      }
    });
    stagedFilterValues.current = {};
    setActiveFilterCount(getActiveFilterCount());
    setIsOpen(false);
  };

  return (
    <>
      <Box sx={sx}>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 1,
          }}
        >
          {searchFieldWithRef && searchFieldWithRef}
          {!isCollapsedMenu && filters}
          {showClearAllButton && !isCollapsedMenu && (
            <Button
              onClick={() => {
                clearAndSaveSearchField();
                clearAll();
                handleSave();
              }}
              color="secondary"
              variant="contained"
              size="large"
              sx={{
                alignSelf: 'stretch',
              }}
            >
              Clear
            </Button>
          )}
          {isCollapsedMenu && (
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              <IconButton
                aria-label="menu"
                sx={{
                  backgroundColor: colors.neutral_200,
                  width: 40,
                  height: 40,
                  borderRadius: 1,
                  '&:hover, &:focus, &:active': {
                    backgroundColor: colors.neutral_200,
                  },
                }}
                onClick={() => {
                  setIsOpen(true);
                }}
              >
                <FilterListIcon />
              </IconButton>
              {activeFilterCount > 0 && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    minWidth: 18,
                    height: 18,
                    bgcolor: colors.grey_200,
                    color: colors.white,
                    fontSize: 12,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {activeFilterCount}
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Box>
      <GridFiltersMobilePanel
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
        onSave={handleSave}
        clearAll={clearAll}
      >
        {filters}
      </GridFiltersMobilePanel>
    </>
  );
}
