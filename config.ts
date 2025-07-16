/**
 * This is the central configuration file for the entire application.
 * To change which dashboards or filters are displayed, you should only need to edit this file.
 */
export const TABS_CONFIG = {
  // =========================================================================
  // LOOKML CONFIGURATION
  // This section tells the application where to get the data for the filters.
  // =========================================================================
  lookml: {
    // The name of the Looker model to use.
    model: 'ecomm',
    // The name of the Explore within that model to query against.
    explore: 'order_items',
  },

  // =========================================================================
  // DASHBOARD CONFIGURATION
  // This array defines which dashboards appear as tabs in the UI.
  // To add a new dashboard: copy one of the objects and change the id and label.
  // To remove a dashboard: delete its object from the array.
  // To reorder dashboards: change the order of the objects in the array.
  // =========================================================================
  dashboards: [
    { id: 'nXJRwDcnj1SY3mz3uJtEJt', label: 'Basic visualization examples' },
    { id: 'lCLlweEWzJ6EdGTgsIHjPB', label: 'Intermediate visualization examples' },
    { id: 'OYRrqT1Tyxqh9PY06I3rxo', label: 'Advanced visualization examples' },
    // Example of a commented-out dashboard. Uncomment to add it back.
    //{id: 'FqzTQbCioLcGDvyhyHTI', label: 'TESTE'},
  ],

  // =========================================================================
  // FILTER CONFIGURATION
  // This array defines the filters that appear at the top of the page.
  // To add a new filter: add a new object to the array.
  // - name: The name of the filter in the Looker dashboard. This MUST match exactly.
  // - label: The user-friendly text that appears above the filter dropdown.
  // - field: The LookML field (view_name.field_name) to query for the filter's options.
  // =========================================================================
  filters: [
    { name: 'Country', label: 'Country', field: 'users.country' },
    { name: 'Category', label: 'Category', field: 'products.category' },
    // Example of a commented-out filter. Uncomment to add it back.
    // { name: 'Brand', label: 'Brand', field: 'products.brand' },
  ],

  // =========================================================================
  // DATE FILTER CONFIGURATION
  // This object controls the behavior of the date filter.
  // =========================================================================
  date_filter: {
    // The name of the date filter in the Looker dashboard. This MUST match exactly.
    name: 'Created Date',
    // The user-friendly label for the filter.
    label: 'Created Date',
    // The type of date filter to display.
    // - 'simple': Shows a dropdown with pre-set date ranges (e.g., "Last 7 Days").
    // - 'advanced': (Handled in Tabs.tsx) Shows separate inputs for a number and a date type (e.g., 14, "Days").
    type: 'simple',
  },
};
