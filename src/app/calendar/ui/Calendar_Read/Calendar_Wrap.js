"use client";

import { useState } from 'react';
import Calendar_Project from './Calendar_Project';
import Calendar_Main from './Calendar_Main';

export default function Calendar_Wrap({ initialYear, initialMonth, events, project }) {
  const [year, setYear] = useState(initialYear);
  const [month, setMonth] = useState(initialMonth);

  const [filters, setFilters] = useState({
    viewAll: true,
    ...Object.fromEntries(project.map((project) => [project, true])),
  });

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => {
      if (filterName === 'viewAll') {
        const updatedFilters = { viewAll: value };
        project.forEach((project) => {
          updatedFilters[project] = value;
        });
        return updatedFilters;
      } else {
        const updatedFilters = {
          ...prev,
          [filterName]: value,
          viewAll: project.every((project) => project === filterName ? value : prev[project]),
        };
        return updatedFilters;
      }
    });
  };

  return (
    <>
      <Calendar_Project
        year={year}
        month={month}
        filters={filters}
        onFilterChange={handleFilterChange}
        events={events}
        style={{ flexShrink: 0 }}
        project={project}
      />
      <div style={{ flex: 1, padding: '20px' }}>
        <Calendar_Main
          year={year}
          month={month}
          events={events}
          filters={filters}
          project={project}
          onPrevMonth={() => {
            let newMonth = month - 1;
            let newYear = year;
            if (newMonth < 1) {
              newMonth = 12;
              newYear -= 1;
            }
            setYear(newYear);
            setMonth(newMonth);
          }}
          onNextMonth={() => {
            let newMonth = month + 1;
            let newYear = year;
            if (newMonth > 12) {
              newMonth = 1;
              newYear += 1;
            }
            setYear(newYear);
            setMonth(newMonth);
          }}
        />
      </div>
    </>
  );
}
