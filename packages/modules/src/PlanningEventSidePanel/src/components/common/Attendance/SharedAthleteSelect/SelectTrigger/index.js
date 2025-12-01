// @flow
import { useState } from 'react';
import { Box, Typography } from '@mui/material'; // or your preferred UI library
import { EllipsisTooltipText } from '@kitman/components';
import type { TriggerProps } from '@kitman/playbook/components/wrappers/AthleteSelector/shared/types';
import { colors } from '@kitman/common/src/variables';
// $FlowFixMe React-select has type errors with recent Flow versions https://github.com/JedWatson/react-select/issues/3612
import { components } from 'react-select';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';

const Trigger = (props: I18nProps<TriggerProps>) => {
  const [isCounterShown, setIsCounterShown] = useState(false);

  const selectedAthletes = props.athletes
    .filter((athlete) => props.selectedIds.has(athlete.id))
    .map((item) => item.name);

  const hasSelection = props.selectedIds.size > 0;

  const clearSelection = (e: MouseEvent) => {
    e.stopPropagation();
    props.setSelectedIds(new Set());
  };

  return (
    <Box>
      <Typography
        sx={{
          color: colors.grey_100,
          fontSize: '12px',
          marginBottom: '4px',
          fontWeight: 600,
        }}
      >
        {props.t('Athletes')}
      </Typography>
      <Box
        onClick={() => (props.isOpen ? props.onClose() : props.onOpen())}
        sx={{
          backgroundColor: colors.neutral_200,
          borderColor: colors.neutral_200,
          cursor: 'pointer',
          border: `1px solid ${colors.neutral_200}`,
          transition: 'all 0.2s ease',
          borderRadius: '3px',
          display: 'flex',

          '&:hover': {
            backgroundColor: colors.neutral_300,
            borderColor: colors.neutral_300,
          },

          ...(props.isOpen && {
            backgroundColor: colors.p06,
            borderColor: colors.blue_100,
            boxShadow: `0 0 0 1px ${colors.blue_100}`,

            '&:hover': {
              backgroundColor: colors.p06,
              borderColor: colors.blue_100,
            },
          }),
        }}
      >
        <Box
          sx={{
            flex: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            paddingX: '8px',
            paddingY: '5px',
            margin: '0 2px',
            color: colors.grey_100,
          }}
        >
          {isCounterShown && selectedAthletes.length > 1 && (
            <span>{`${props.selectedIds.size} - `}</span>
          )}
          <EllipsisTooltipText
            content={
              selectedAthletes.length
                ? selectedAthletes.join(', ')
                : props.t('No athletes selected')
            }
            onEllipsisChange={(isEllipsisDisplayed: boolean) =>
              setIsCounterShown(isEllipsisDisplayed)
            }
            displayEllipsisWidth={300}
            displayEllipsisWidthUnit="px"
          />
        </Box>

        {/* Right-side icons */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            marginLeft: '8px',
            fontSize: '10px',
          }}
        >
          {hasSelection && (
            <Box
              data-testid="clear-selection"
              onClick={clearSelection}
              sx={{
                alignItems: 'center',
                backgroundColor: 'rgba(31, 45, 68, 0.5)',
                borderRadius: '50%',
                color: colors.neutral_200,
                display: 'flex',
                height: '12px',
                padding: 0,
                width: '12px',
              }}
            >
              <components.CrossIcon size={15} style={{ fontSize: '10px' }} />
            </Box>
          )}
          <Box sx={{ padding: '4px 14px 4px 8px', color: colors.grey_200 }}>
            <i className="icon-chevron-down" />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default withNamespaces()(Trigger);
