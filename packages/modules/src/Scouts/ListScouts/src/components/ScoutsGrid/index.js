// @flow
import { Fragment } from 'react';
import { AppStatus } from '@kitman/components';
import TabLayout from '@kitman/components/src/TabLayout';
import RegistrationGrid from '@kitman/modules/src/LeagueOperations/technicalDebt/components/RegistrationGrid';
import Search from '@kitman/modules/src/Officials/ListOfficials/src/components/Filters/Search';
import useManageScoutsGrid from '../../../../shared/hooks/useManageScoutsGrid';

type Props = {
  isActive?: boolean,
};

const ScoutsGrid = (props: Props) => {
  const {
    isScoutsListFetching,
    isScoutsListError,
    onHandleFilteredSearch,
    grid,
    filteredSearchParams,
    onUpdateFilter,
    meta,
  } = useManageScoutsGrid({ is_active: props.isActive === true });

  const renderContent = () => {
    if (isScoutsListError) return <AppStatus status="error" />;
    if (isScoutsListFetching && filteredSearchParams.page === 1)
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
            isLoading={isScoutsListFetching && meta.current_page > 1}
            meta={meta}
          />
        </TabLayout.Content>
      </TabLayout.Body>
    );
  };

  return <TabLayout>{renderContent()}</TabLayout>;
};

export default ScoutsGrid;
