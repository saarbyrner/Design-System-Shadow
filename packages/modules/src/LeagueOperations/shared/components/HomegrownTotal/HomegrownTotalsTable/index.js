/* eslint-disable camelcase */
// @flow
import { type Node, useEffect, useState } from 'react';
import { uniqueId } from 'lodash';
import { colors } from '@kitman/common/src/variables';
import { useSelector } from 'react-redux';
import { getOrganisation } from '@kitman/common/src/redux/global/selectors';

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@kitman/playbook/components';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';

import {
  registrationGridApi,
  useLazyFetchOrganisationLabelCategoriesGroupsQuery,
  useLazyFetchAssociationLabelCategoriesGroupsQuery,
} from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGridApi';

type HomegrownList = {
  id: number,
  created_by: {
    id: number,
    fullname: string,
  },
  name: string,
  max_number: number,
  label_categories: Array<{
    name: string,
    max_number: number,
    labels_count: number,
  }>,
};

const NON_REGISTERED = 'non_registered';
const POST_FORMATION = 'Post-formation';

// render a table of homegrown totals for different lists
const TotalsTable = ({ data }: { data: Array<HomegrownList> }) => {
  const filteredData = data.filter((list) => {
    // return list items that are not non-registered
    return list.name !== NON_REGISTERED;
  });

  // Get all unique label categories from all lists, filtering out POST_FORMATION
  const allHomegrownCategoryLabels = Array.from(
    new Set(
      filteredData.flatMap((list) =>
        list.label_categories
          .filter(
            (categoryLabel) => !categoryLabel.name.includes(POST_FORMATION)
          )
          .map((categoryLabel) => categoryLabel.name)
      )
    )
  );

  // helper to get the cell value for a given list and labelName
  const getHomegrownData = (list, labelName) => {
    const match = list.label_categories.find((cat) => cat.name === labelName);
    // use labels_count from the filteredData structure
    return match ? `${match.labels_count} (max ${match.max_number})` : '-';
  };

  // calculate totals for each list using labels_count
  const totals = filteredData.map((list) => {
    return list.label_categories.reduce((sum, item) => {
      return sum + (item.labels_count || 0);
    }, 0);
  });

  // create the table rows
  const tableRows = allHomegrownCategoryLabels.map((labelName) => {
    const row = {
      label: labelName,
    };
    filteredData.forEach((list) => {
      row[`list${list.id}`] = getHomegrownData(list, labelName);
    });
    return row;
  });

  // add the total row
  const totalRow = {
    label: 'Total',
  };
  filteredData.forEach((list, idx) => {
    //  remove the max wording for Post-formation
    if (list.name.includes(POST_FORMATION)) {
      totalRow[`list${list.id}`] = totals[idx].toString();
      return;
    }
    // otherwise, add the max totals
    totalRow[`list${list.id}`] = `${totals[idx]} (max ${list.max_number})`;
  });
  tableRows.push(totalRow);

  // define the headers for the table
  const getHeaders = () => [
    'Age',
    ...filteredData.map((list) => {
      // Remove 'Homegrown' prefix and trim whitespace and if the name is 'Post-formation', return it as is
      // apply list to the end of the name
      const name = list.name.replace(/^Homegrown\s*/i, '').trim();
      return name === POST_FORMATION ? POST_FORMATION : `${name} list`;
    }),
  ];

  // add icons to the total cells if the number exceeds the max
  const getTotalCellIcon = (value: string, max: number): null | Node => {
    if (!max) return null;
    const totalNum = parseInt(value.split(' ')[0], 10);
    return totalNum > max ? (
      <KitmanIcon
        sx={{ color: colors.red_100, fontSize: 24, ml: 0.5 }}
        name={KITMAN_ICON_NAMES.Error}
      />
    ) : null;
  };

  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow sx={{ height: 20 }}>
              {getHeaders().map((header) => (
                <TableCell key={uniqueId()} sx={{ fontWeight: 600, px: 1 }}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableRows.map((row) => {
              const isTotal = row.label === 'Total';
              const cellStyle = isTotal
                ? {
                    fontWeight: 600,
                    borderTop: '2px solid black',
                    borderBottom: 'none',
                  }
                : {};

              return (
                <TableRow key={uniqueId()} sx={{ height: 20 }}>
                  <TableCell sx={{ ...cellStyle, px: 1 }}>
                    {row.label}
                  </TableCell>
                  {filteredData.map((list) => {
                    const cellValue = row[`list${list.id}`];
                    return (
                      <TableCell sx={cellStyle} key={list.id}>
                        {cellValue}
                        {isTotal &&
                          getTotalCellIcon(cellValue, list.max_number)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

const HomegrownTotalsTable = ({
  organisationId,
}: {
  organisationId?: number,
}) => {
  const { label_categories_groups } = useSelector(getOrganisation());
  const [fetchedGroups, setFetchedGroups] = useState<Array<HomegrownList>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<null | string>(null);

  const store = useSelector((state) => state);

  const [triggerFetchAssociation] =
    useLazyFetchAssociationLabelCategoriesGroupsQuery();
  const [triggerFetchOrganisation] =
    useLazyFetchOrganisationLabelCategoriesGroupsQuery();

  const fetchOrganisation = async ({ id }: { id: string | number }) => {
    const result = await triggerFetchOrganisation({ id });
    return result?.data;
  };

  const fetchAssociation = async ({
    id,
    organisation_Id,
  }: {
    id: string | number,
    organisation_Id: number,
  }) => {
    const result = await triggerFetchAssociation({
      id,
      organisationId: organisation_Id,
    });
    return result?.data;
  };

  useEffect(() => {
    let isMounted = true;
    let currentIndex = 0;

    // clear existing state before new fetch sequence
    setFetchedGroups([]);
    setLoading(true);
    setError(null);

    // Recursive function to fetch each group, this is a workaround as we cannot use the RTK hook directly in a loop
    const fetchNext = async () => {
      // Exit early if component has unmounted
      if (!isMounted) return;

      // Stop recursion if we've processed all groups
      if (
        !Array.isArray(label_categories_groups) ||
        currentIndex >= label_categories_groups.length
      ) {
        setLoading(false);
        return;
      }

      const { id } = label_categories_groups[currentIndex];
      const params = organisationId ? { id, organisationId } : { id };

      try {
        // check cache for existing data to avoid refetching, this is required as we are not using the RTK query hook directly
        const cachedData = organisationId
          ? registrationGridApi.endpoints.fetchAssociationLabelCategoriesGroups.select(
              params
            )(store)
          : registrationGridApi.endpoints.fetchOrganisationLabelCategoriesGroups.select(
              params
            )(store);

        const dataFromCache = cachedData?.data;

        let data;

        if (dataFromCache && dataFromCache.id === id) {
          // use cached data
          data = dataFromCache;
        } else {
          //  fetch data from API if not cached
          data = organisationId
            ? await fetchAssociation({ id, organisation_Id: organisationId })
            : await fetchOrganisation({ id });
        }

        // update state only if component is still mounted
        if (isMounted && data) {
          setFetchedGroups((prev) => [
            ...prev,
            ...(Array.isArray(data) ? data : [data]),
          ]);
        }
      } catch (err) {
        // handle error only if still mounted
        if (isMounted) setError('Failed to fetch data');
      }
      // move to next group ID
      currentIndex += 1;
      fetchNext();
    };

    fetchNext();

    // cleanup
    return () => {
      isMounted = false;
    };
  }, [label_categories_groups, organisationId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (fetchedGroups.length === 0) return <div>No data available</div>;

  return <TotalsTable data={fetchedGroups} />;
};

export default HomegrownTotalsTable;
