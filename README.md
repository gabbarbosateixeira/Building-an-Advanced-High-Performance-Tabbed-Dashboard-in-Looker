# Building an Advanced, High-Performance Tabbed Dashboard in Looker

This guide walks through the architecture and implementation of a custom, multi-tab dashboard experience built as a Looker Extension. This project provides a clean, highly interactive, and performant way for users to explore related dashboards, serving as an advanced alternative to the basic example found in Looker's official documentation for [Creating a new Looker extension with components](https://cloud.google.com/looker/docs/components-example).

### Key Features

* **Multi-Tab Interface**: Navigate between several related dashboards within a single, unified view.
* **Global Filter Bar**: A single set of filters controls the data across all dashboard tabs simultaneously.
* **Manual Update Control**: Dashboards refresh only when the user clicks an "Update" button.
* **Advanced Date Filter**: A custom-built date filter with both "Presets" and a "Custom" calendar.
* **High-Performance Architecture**: Built with modern React patterns to eliminate unnecessary reloads and ensure a smooth, instant-loading experience.

---

## Prerequisites

Before you begin, ensure you have the following:

* Access to a Looker instance with the **Extension Framework** enabled.
* **`develop`** permissions on the Looker instance.
* Several **user-defined dashboards** that you want to display in the tabs.
* Whether you're building in the extension framework or in your own stand-alone React application, it is important to authenticate with Looker's API and have access to the Looker SDK object. Read about [Looker API authentication](https://cloud.google.com/looker/docs/api-auth) or our [extension framework](https://cloud.google.com/looker/docs/reference/extension-framework) for more information.
* This example uses the **Looker Embed SDK**. To allow the Embed SDK to run against your instance, **`http://localhost:8080`** must be included in the **Embedded Domain Allowlist** inside the **Admin > Embed** panel.
* Make sure you have installed the **Looker Components** NPM package. Information on installing and using the components package can be found in the README document, available in [GitHub](https://github.com/looker-open-source/components/blob/main/packages/components/README.md) and [NPM](https://www.npmjs.com/package/@looker/components).

---

## How it Works: The Project Structure

The project is broken down into four key files. The beauty of this architecture is that for most customizations, you only need to edit the `config.ts` file.

### 1. `config.ts` - The Control Panel

This is the most important file for customization. It acts as a central configuration panel. **You do not need to be a React developer to change which dashboards or filters are displayed.**

* **To add a new dashboard**: Simply add a new object to the `dashboards` array.
* **To add a new filter**: Add a new object to the `filters` array.
* **Example**: To add a "Brand" filter, you would add this line to the `filters` array in `config.ts`:
    `{ name: 'Brand', label: 'Brand', field: 'products.brand' }`

### 2. `App.tsx` - The Entry Point

This top-level component wraps the entire application in Looker's `<ExtensionProvider>`, connecting it to the Looker Extension Framework.

### 3. `Dashboards.tsx` - The Dashboard Embedder

This component embeds a single Looker dashboard and is designed to be highly efficient, only updating the dashboard data when needed instead of reloading the entire iframe.

### 4. `Tabs.tsx` - The Brains of the Operation

This component orchestrates the entire user experience, rendering the filters and tabs, managing state, and handling user interactions.

---

## Implementation Guide

Follow these steps to set up, customize, and deploy this extension in your own Looker instance.

### Part A: Initial Project Setup

**Step 1: Build a Basic TypeScript Extension**
First, create a new, blank extension using the official Looker instructions. Follow the steps on the [Introduction to building a Looker extension](https://cloud.google.com/looker/docs/building-looker-extensions) documentation page with one key modification:

* If you **use the `create-looker-extension` tool** to create the extension template, choose **TypeScript** as the language you would like to use in the second step.
* If you **clone the Git repository** to create the extension template, navigate to the `extension-examples/react/TypeScript/helloworld-ts` directory in the second step.

**Step 2: Replace the Starter Files**
Once you have the basic "Hello World" extension, delete the default `HelloWorld.tsx` file. Then, drag and drop your four customized source files (`App.tsx`, `config.ts`, `Dashboards.tsx`, `Tabs.tsx`) into the `src` folder.

### Part B: Development and Configuration

**Step 1: Install Dependencies and Run**
In a terminal window on your local machine, navigate to the project directory and run:

```bash
# Install all the necessary libraries
yarn install

# Start the local development server
yarn develop
