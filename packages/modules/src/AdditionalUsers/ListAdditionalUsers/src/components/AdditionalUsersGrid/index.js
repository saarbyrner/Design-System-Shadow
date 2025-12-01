// @flow
import i18n from '@kitman/common/src/utils/i18n';
import { AppStatus } from '@kitman/components';
import { Stack } from '@kitman/playbook/components';
import RegistrationGrid from '@kitman/modules/src/LeagueOperations/technicalDebt/components/RegistrationGrid';
import TabLayout from '@kitman/components/src/TabLayout';
import useManageAdditionalUsersGrid from '@kitman/modules/src/AdditionalUsers/shared/hooks/useManageAdditionalUsersGrid';
import { roleOptions } from '@kitman/modules/src/AdditionalUsers/shared/consts';
import Filters from '@kitman/components/src/Filters';

type Props = {
  isActive?: boolean,
};

const AdditionalUsersGrid = (props: Props) => {
  const {
    isAdditionalUsersListFetching,
    isAdditionalUsersListError,
    onHandleFilteredSearch,
    grid,
    filteredSearchParams,
    onUpdateFilter,
    meta,
    manageableUserTypes,
  } = useManageAdditionalUsersGrid({ is_active: props.isActive === true });

  const renderContent = () => {
    if (isAdditionalUsersListError) return <AppStatus status="error" />;
    if (isAdditionalUsersListFetching && filteredSearchParams.page === 1)
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
          <Stack direction="row" gap={1} alignItems="center">
            <Filters.Search
              placeholder={i18n.t('Search')}
              value={filteredSearchParams?.search_expression}
              onChange={(value) => {
                onUpdateFilter({
                  search_expression: value,
                  page: 1,
                });
              }}
            />
            <Filters.Select
              placeholder={i18n.t('Role')}
              value={filteredSearchParams.types}
              onChange={(value) => {
                onUpdateFilter({
                  types: value,
                  page: 1,
                });
              }}
              options={roleOptions.filter((option) =>
                manageableUserTypes.includes(option.value)
              )}
            />
          </Stack>
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
            isLoading={isAdditionalUsersListFetching && meta.current_page > 1}
            meta={meta}
          />
        </TabLayout.Content>
      </TabLayout.Body>
    );
  };

  return <TabLayout>{renderContent()}</TabLayout>;
};

export default AdditionalUsersGrid;
