// @flow
import {
  SearchBar,
  Select,
  SlidingPanelResponsive,
  TextButton,
} from '@kitman/components';
import { useEffect, useMemo, useState } from 'react';
import { withNamespaces } from 'react-i18next';
import type { OrganisationFormat } from '@kitman/services/src/services/planning/getOrganisationFormats';
import type { Formation } from '@kitman/common/src/types/PitchView';
import type { I18nProps } from '@kitman/common/src/types/i18n';

import lineUpTemplate from '../../services/lineUpTemplate';
import type { EnrichedLineUpTemplate } from '../../services/lineUpTemplate';
import styles from './styles';
import {
  defaultAppliedFilters,
  filterLineUps,
  processLineUpsData,
} from './helpers';
import type { AppliedFilter } from './helpers';

type Props = {
  gameFormats: OrganisationFormat[],
  formations: Formation[],
  isOpen: boolean,
  onClose: () => void,
  onConfirm: (lineUp: EnrichedLineUpTemplate) => void,
};

const SavedLineUpsSidePanel = (props: I18nProps<Props>) => {
  const [lineUps, setLineUps] = useState<EnrichedLineUpTemplate[]>([]);
  const [selectedLinedUp, setSelectedLineUp] =
    useState<?EnrichedLineUpTemplate>();
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter>(
    defaultAppliedFilters
  );
  const [filters, setFilters] = useState({
    gameFormats: [],
    formations: [],
    authors: [],
  });

  const filteredLineUps = useMemo(() => {
    return filterLineUps(lineUps, appliedFilters);
  }, [lineUps, appliedFilters]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await lineUpTemplate.getAll();
      const {
        gameFormats: filteredGameFormats,
        formations: filteredFormations,
        authors: filteredAuthors,
        processedLineUps,
      } = processLineUpsData(data, props.gameFormats, props.formations);

      setLineUps(processedLineUps);
      setFilters({
        gameFormats: filteredGameFormats.map((item) => ({
          value: item,
          label: item.name,
        })),
        formations: filteredFormations.map((item) => ({
          value: item,
          label: item.name,
        })),
        authors: Object.values(filteredAuthors).map((item) => ({
          value: item,
          // $FlowFixMe: Object.values return type mixed, fullname doesn't exist in mixed type
          label: item.fullname,
        })),
      });
    };

    if (props.isOpen) {
      fetchData();
    } else {
      setSelectedLineUp(undefined);
      setAppliedFilters(defaultAppliedFilters);
    }
  }, [props.isOpen]);

  const onUpdateFilter = ({
    name,
    clear,
  }: {
    name: string,
    clear?: boolean,
  }) => {
    return (value) => {
      setAppliedFilters({
        ...appliedFilters,
        [name]: clear ? defaultAppliedFilters[name] : value,
      });
    };
  };

  const onConfirm = () => {
    if (selectedLinedUp) {
      props.onConfirm(selectedLinedUp);
    }
  };

  if (!props.gameFormats?.length || !props.formations?.length) {
    return null;
  }

  return (
    <SlidingPanelResponsive
      isOpen={props.isOpen}
      kitmanDesignSystem
      title={props.t('Saved Line-up templates')}
      onClose={props.onClose}
      width={659}
    >
      <div css={styles.container}>
        <div>
          <div css={styles.headerFilters}>
            <div
              css={{
                marginBottom: '24px',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <div data-testid="filters" css={styles.filters}>
                <Select
                  name="format"
                  label={props.t('Format')}
                  value={appliedFilters.gameFormat}
                  isClearable
                  onChange={onUpdateFilter({ name: 'gameFormat' })}
                  onClear={onUpdateFilter({ name: 'gameFormat', clear: true })}
                  options={filters.gameFormats}
                  css={styles.filter}
                />
                <Select
                  name="formation"
                  label={props.t('Formation')}
                  value={appliedFilters.formation}
                  isClearable
                  onChange={onUpdateFilter({ name: 'formation' })}
                  onClear={onUpdateFilter({ name: 'formation', clear: true })}
                  options={filters.formations}
                  css={styles.filter}
                />
                <Select
                  name="addedBy"
                  label={props.t('Added by')}
                  value={appliedFilters.author}
                  isClearable
                  onChange={onUpdateFilter({ name: 'author' })}
                  onClear={onUpdateFilter({ name: 'author', clear: true })}
                  options={filters.authors}
                  css={styles.lastFilter}
                />
              </div>
            </div>
            <div data-testid="search-bar" css={styles.searchBarContainer}>
              <SearchBar
                onChange={(e) => {
                  onUpdateFilter({ name: 'query' })(e.target.value);
                }}
                value={appliedFilters.query}
                placeholder={props.t('Search')}
              />
            </div>
          </div>

          {/* TABLE */}
          <div>
            {/* HEADER */}
            <div data-testid="table-header" css={styles.header}>
              <p>{props.t('Name')}</p>
              <p>{props.t('Format')}</p>
              <p>{props.t('Formation')}</p>
              <p>{props.t('Added by')}</p>
            </div>
            <div data-testid="table-body">
              {/* ROWS */}
              {filteredLineUps.map((row) => {
                return (
                  <div
                    key={row.id}
                    onClick={() =>
                      setSelectedLineUp(
                        selectedLinedUp?.id === row.id ? undefined : row
                      )
                    }
                    css={[
                      styles.row,
                      selectedLinedUp?.id === row.id && styles.rowSelected,
                    ]}
                  >
                    <p>{row.name}</p>
                    <p>{row.gameFormat?.name || ''}</p>
                    <p>{row.formation?.name || ''}</p>
                    <p>{row.author.fullname}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <footer
          className="slidingPanelActions"
          css={styles.slidingPanelActions}
        >
          <TextButton
            onClick={onConfirm}
            text={props.t('Save')}
            type="primary"
            isDisabled={!selectedLinedUp}
            kitmanDesignSystem
          />
        </footer>
      </div>
    </SlidingPanelResponsive>
  );
};

export const SavedLineUpsSidePanelTranslated = withNamespaces()(
  SavedLineUpsSidePanel
);
export default SavedLineUpsSidePanel;
