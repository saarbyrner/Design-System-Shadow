// @flow
import { Fragment } from 'react';
import { AppStatus } from '@kitman/components';
import RegistrationGrid from '@kitman/modules/src/LeagueOperations/technicalDebt/components/RegistrationGrid';
import TabLayout from '@kitman/components/src/TabLayout';
import useManageOfficialsGrid from '../../../../shared/hooks/useManageOfficialsGrid';

import Search from '../Filters/Search';

type Props = {
  isActive?: boolean,
};

const OfficialsGrid = (props: Props) => {
  const {
    isOfficialsListFetching,
    isOfficialsListError,
    onHandleFilteredSearch,
    grid,
    filteredSearchParams,
    onUpdateFilter,
    meta,
  } = useManageOfficialsGrid({ is_active: props.isActive === true });

  const renderContent = () => {
    if (isOfficialsListError) return <AppStatus status="error" />;
    if (isOfficialsListFetching && filteredSearchParams.page === 1)
      return (
        <TabLayout.Body>
          <TabLayout.Content>
            <TabLayout.Loading />
          </TabLayout.Content>
        </TabLayout.Body>
      );
    return (
      <TabLayout.Body>
        <TabLayout.Filters>
          <Fragment>
            <Search
              onUpdateFunction={(value) => {
                onUpdateFilter({
                  search_expression: value.search_expression,
                  page: 1,
                });
              }}
              searchKey="search_expression"
              value={filteredSearchParams?.search_expression}
            />
          </Fragment>
        </TabLayout.Filters>
        <TabLayout.Content>
          <RegistrationGrid
            onFetchData={() =>
              onHandleFilteredSearch({
                ...filteredSearchParams,
                page: meta.next_page,
              })
            }
            grid={{
              columns: grid.columns,
              rows: grid.rows,
            }}
            gridId={grid.id}
            emptyTableText={grid.emptyTableText}
            rowActions={null}
            isLoading={isOfficialsListFetching && meta.current_page > 1}
            meta={meta}
          />
        </TabLayout.Content>
      </TabLayout.Body>
    );
  };

  return <TabLayout>{renderContent()}</TabLayout>;
};

export default OfficialsGrid;
