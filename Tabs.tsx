/**
 * --------------------------------------------------------------------------
 * Tabs.tsx - The primary UI controller for the application.
 * --------------------------------------------------------------------------
 * This component is responsible for:
 * - Rendering the main filter bar and the dashboard tabs.
 * - Managing the state of the filters (what the user selects).
 * - Fetching filter options from the Looker instance.
 * - Handling user interactions like button clicks.
 * - Passing the final, active filter values to the dashboard components.
 */
import React, { useState, useEffect, useContext, useMemo, useCallback } from "react";
// =========================================================================
// UI COMPONENT IMPORTS
// These are the building blocks from Looker's component library.
// To change the visual appearance, you might swap these for other
// components or change the props passed to them below in the JSX.
// =========================================================================
import {
  ComponentsProvider,
  Tabs2,
  Tab2,
  FieldSelectMulti,
  Box,
  Spinner,
  Button,
  Space,
  Popover,
  PopoverContent,
  Calendar,
  List,
  ListItem,
  theme as defaultTheme,
} from "@looker/components";
import { DateRange } from "@looker/components-date"; // Required for Calendar and date logic
import { ExtensionContext } from "@looker/extension-sdk-react";
import { EmbeddedDashboard, IAllFilters as DashboardFilters } from "./Dashboards";
import { TABS_CONFIG } from "./config";

// =========================================================================
// TYPESCRIPT INTERFACES
// These define the 'shape' of our data for type safety and clarity.
// =========================================================================
export interface IAllFilters {
  [key:string]: string[];
}

interface FilterOption {
  value: string;
  label: string;
}

// =========================================================================
// CUSTOM THEME
// To customize the application's appearance, you can override the default
// Looker component theme here. For example, changing the `key` color will
// change the primary button color and the highlight color for tabs.
// You can find all theme properties in the Looker documentation.
// =========================================================================
const customTheme = {
  ...defaultTheme,
  colors: {
    ...defaultTheme.colors,
    key: "#1A73E8", // This sets the primary color to a Google blue.
  },
};

// A small helper function to format the text displayed on the date filter button.
const formatDateRange = (range: DateRange): string => {
    if ('from' in range && 'to' in range) {
        // Format for a custom date range
        const from = range.from.toLocaleDateString();
        const to = range.to.toLocaleDateString();
        return from === to ? from : `${from} - ${to}`;
    }
    if ('type' in range) {
        // Format for a preset like "Last 7 Days"
        return `Last ${range.value} ${range.unit}`;
    }
    return 'Select Date';
}

export const Tabs = () => {
  const { core40SDK: sdk } = useContext(ExtensionContext);

  // =========================================================================
  // STATE MANAGEMENT
  // `useState` hooks are used to manage the component's internal data.
  // =========================================================================
  const [stagedFilters, setStagedFilters] = useState<IAllFilters>({});
  const [activeFilters, setActiveFilters] = useState<IAllFilters>({});
  const [filterOptions, setFilterOptions] = useState<{[key: string]: FilterOption[]}>({});
  const [dateRange, setDateRange] = useState<DateRange>({
    type: "last",
    value: 7,
    unit: "days",
  });
  const [isLoading, setIsLoading] = useState(true);

  // This `useEffect` hook runs once when the component mounts.
  useEffect(() => {
    const fetchAndInitialize = async () => {
      if (!sdk) return;
      try {
        const { model, explore } = TABS_CONFIG.lookml;
        const promises = TABS_CONFIG.filters.map(filter =>
          sdk.ok(sdk.run_inline_query({
            result_format: "json",
            body: { model, view: explore, fields: [filter.field] }
          }))
        );
        const results = await Promise.all(promises);

        const newFilterOptions: {[key: string]: FilterOption[]} = {};
        results.forEach((result, i) => {
          const filterConfig = TABS_CONFIG.filters[i];
          const options = result
            .filter((row: any) => row && row[filterConfig.field] != null)
            .map((row: any) => ({
              value: row[filterConfig.field].toString(),
              label: row[filterConfig.field].toString()
            }));
          newFilterOptions[filterConfig.name] = options;
        });
        setFilterOptions(newFilterOptions);
        setActiveFilters({ [TABS_CONFIG.date_filter.name]: ["last 7 days"] });

      } catch (error) {
        console.error("Error fetching filter options:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAndInitialize();
  }, [sdk]);

  // =========================================================================
  // EVENT HANDLERS
  // `useCallback` is a performance optimization. It ensures these functions
  // are not recreated on every render, preventing unnecessary re-renders
  // of child components like the buttons and filters.
  // =========================================================================
  const handleFilterChange = useCallback((filterName: string, values: string[]) => {
    setStagedFilters(prev => ({ ...prev, [filterName]: values }));
  }, []);

  const handleUpdateClick = useCallback(() => {
    const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}/${month}/${day}`;
    };

    let dateFilterString = '';
    if (dateRange) {
        if ('from' in dateRange && 'to' in dateRange) {
            dateFilterString = `${formatDate(dateRange.from)} to ${formatDate(dateRange.to)}`;
        } else if ('type' in dateRange) {
            dateFilterString = `${dateRange.type} ${dateRange.value} ${dateRange.unit}`;
        }
    }
    
    const newActiveFilters = {
        ...stagedFilters,
        [TABS_CONFIG.date_filter.name]: dateFilterString ? [dateFilterString] : [],
    };
    
    setActiveFilters(newActiveFilters);
  }, [stagedFilters, dateRange]);

  const handleResetClick = useCallback(() => {
    setStagedFilters({});
    setDateRange({ type: "last", value: 7, unit: "days" });
  }, []);

  // `useMemo` is another performance optimization. It ensures the `dashboardFilters`
  // object is only recalculated when `activeFilters` actually changes.
  const dashboardFilters = useMemo((): DashboardFilters => {
    const formatted: DashboardFilters = {};
    for (const filterName in activeFilters) {
      formatted[filterName] = activeFilters[filterName].join(',');
    }
    return formatted;
  }, [activeFilters]);

  // =========================================================================
  // RENDER METHOD (JSX)
  // This is the section that defines the HTML structure of the component.
  // To change the layout or appearance, you would modify the code below.
  // =========================================================================
  return (
    <ComponentsProvider theme={customTheme}>
      <Box p="u4" borderBottom="1px solid" borderColor="ui2">
        <Box display="flex" justifyContent="space-between" alignItems="flex-end">
          {/* This Box contains all the filter controls. */}
          <Box display="flex" flexWrap="wrap" gap="u4" alignItems="flex-end">
            {TABS_CONFIG.filters.map(filter => (
              <Box key={filter.name} width={300}>
                {/* To change this filter type (e.g., to a single select), you would
                    replace <FieldSelectMulti> with <FieldSelect> and adjust the
                    onChange handler logic. */}
                <FieldSelectMulti
                  label={filter.label}
                  values={stagedFilters[filter.name] || []}
                  onChange={(values) => handleFilterChange(filter.name, values)}
                  options={filterOptions[filter.name]}
                  disabled={isLoading}
                  isFilterable={true}
                />
              </Box>
            ))}
            
            {/* This is the custom-built date filter component. */}
            <Box>
                {/* A Popover shows content when the trigger (the Button) is clicked. */}
                <Popover
                    content={
                        <PopoverContent p="u2">
                            {/* Tabs inside the popover to switch between presets and custom calendar. */}
                            <Tabs2>
                                <Tab2 id="presets" label="Presets">
                                    <List>
                                        <ListItem onClick={() => setDateRange({ type: "last", value: 7, unit: "days" })}>Last 7 Days</ListItem>
                                        <ListItem onClick={() => setDateRange({ type: "last", value: 14, unit: "days" })}>Last 14 Days</ListItem>
                                        <ListItem onClick={() => setDateRange({ type: "last", value: 30, unit: "days" })}>Last 30 Days</ListItem>
                                        <ListItem onClick={() => setDateRange({ type: "last", value: 90, unit: "days" })}>Last 90 Days</ListItem>
                                    </List>
                                </Tab2>
                                <Tab2 id="custom" label="Custom">
                                    <Calendar
                                        range={('from' in dateRange && 'to' in dateRange) ? dateRange : undefined}
                                        onSelectRange={setDateRange}
                                    />
                                </Tab2>
                            </Tabs2>
                        </PopoverContent>
                    }
                >
                    {/* This button shows the currently selected date range and opens the popover. */}
                    <Button>{formatDateRange(dateRange)}</Button>
                </Popover>
            </Box>
          </Box>
          
          {/* This Box contains the action buttons. */}
          <Box pb="u2">
            {/* The <Space> component ensures consistent spacing between buttons. */}
            <Space>
              <Button onClick={handleUpdateClick}>Update</Button>
              <Button onClick={handleResetClick}>Reset</Button>
            </Space>
          </Box>
        </Box>
      </Box>

      {/* Main Content Area: Show a spinner while loading, otherwise show the tabs. */}
      {isLoading ? (
        <Box p="u10" textAlign="center"><Spinner/></Box>
      ) : (
        <Tabs2>
          {TABS_CONFIG.dashboards.map(dash => (
            <Tab2 key={dash.id} id={dash.id} label={dash.label}>
              <EmbeddedDashboard
                id={dash.id}
                filters={dashboardFilters}
              />
            </Tab2>
          ))}
        </Tabs2>
      )}
    </ComponentsProvider>
  );
};
