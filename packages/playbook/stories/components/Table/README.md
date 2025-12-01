# Data Grid

<!--- further enhance in future PR and as developed --->

# Pagination

Out of the box MUI data grid handles Pagination however majority of the time we
need to manage it asynchronously with the backend. When this is the case we have
two options:

1. Infinite loading This will load additional data when the user reaches the
   bottom of the table.

1. Async Pagination

```ts
  Infinite Loading
  <DataGrid
    infiniteLoading={true}
    // setting infinite loading on
    infiniteLoadingCall={(selectedPage, selectedPageSize) = {}}
    // This function will receive page number and selected page size from here we can call the BE and set displayed rows
  />

  Async Numbered pages
  <DataGrid
    pageSize={25}
    pageNumber={0}
    rowCount={77}
    // number of all items
    asyncPagination={true}
    // setting async pagination on
    onPaginationModelChange={(selectedPage, selectedPageSize) = {}}
    // This function will receive page number and selected page size from here we can call the BE and set displayed rows
  />
```
