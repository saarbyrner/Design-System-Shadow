// @flow
import { useState } from 'react';
import { DateRangePicker, InputText, Select } from '@kitman/components';

function TitleFilters(props: { title: string, firstFilterName: string }) {
  const [filterText, setFilterText] = useState('');
  const [dateRange, setDateRange] = useState({
    start_date: '2020-12-16',
    end_date: '2021-03-17',
  });
  const [selectedStaff, setSelectedStaff] = useState('');

  return (
    <div className="emrOrders__titleFilters">
      <h2>{props.title}</h2>
      <div className="emrOrders__titleFiltersItems">
        <div className="emrOrders__searchInput">
          <InputText
            value={filterText}
            onValueChanged={(value) => setFilterText(value)}
          />
          <i className="icon-search" />
        </div>
        <Select
          placeholder={props.firstFilterName}
          value={selectedStaff}
          onChange={(items) => setSelectedStaff(items)}
          options={[]}
        />
        <Select
          placeholder="Order Type"
          value={selectedStaff}
          onChange={(items) => setSelectedStaff(items)}
          options={[]}
        />
        <div style={{ position: 'relative' }}>
          <DateRangePicker
            value={dateRange}
            onChange={(newDateRange) => setDateRange(newDateRange)}
            turnaroundList={[]}
            kitmanDesignSystem
          />
        </div>
      </div>
    </div>
  );
}

export default TitleFilters;
