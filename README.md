# Implementing Cross-Filtering and easy management on Looker Tabbed Extension

This guide walks through the architecture and implementation of a custom, multi-tab dashboard experience built as a Looker Extension. This project provides a clean, highly interactive, and performant way for users to explore related dashboards, serving as an advanced alternative to the basic example found in Looker's official documentation for [Creating a new Looker extension with components](https://cloud.google.com/looker/docs/components-example).

### Key Features

* **Multi-Tab Interface**: Navigate between several related dashboards within a single, unified view.
* **Global Filter Bar**: A single set of filters controls the data across all dashboard tabs simultaneously.
* **Manual Update Control**: Dashboards refresh only when the user clicks an "Update" button.
* **Advanced Date Filter**: A custom-built date filter with both "Presets" and a "Custom" calendar.
* **High-Performance Architecture**: Built with modern React patterns to eliminate unnecessary reloads and ensure a smooth, instant-loading experience.

### Future Features being added

* **Cascade Filtering**
* **Better updating control**
* **Advanced filtering controls and customization**

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

This will start a server on https://localhost:8080.

Step 2: Configure the manifest.lkml for Development
In your Looker project, open the manifest.lkml file and ensure the url parameter points to your local server.

application: "tabbed_dashboards_app" {
  label: "Advanced Tabbed Dashboards"
  url: "https://localhost:8080/bundle.js"
  entitlements: {
    use_embeds: yes
    core_api_methods: ["run_inline_query"]
    external_api_urls: []
  }
}

Step 3: View and Test
In your Looker instance, go to the "Browse" menu and find your extension under "Applications." You can now see your extension running and test your changes live.

Part C: Deploying to Production
Once you are ready to share the extension with other users, follow these steps to publish it to your Looker instance.

Step 1: Build the Production File
In your terminal, stop the development server (Ctrl + C) and run the build command:

yarn build

This creates a dist folder containing your entire application bundled into a single bundle.js file.

Step 2: Upload the bundle.js File to Looker
Drag and drop the newly created dist/bundle.js file into your Looker project's file browser.

Step 3: Update the manifest.lkml for Production
Edit your manifest.lkml file to tell Looker to use the uploaded file instead of the development server.

application: "tabbed_dashboards_app" {
  label: "Advanced Tabbed Dashboards"
  # Comment out the development URL
  # url: "https://localhost:8080/bundle.js"
  # Uncomment the file parameter
  file: "bundle.js"
  entitlements: {
    use_embeds: yes
    core_api_methods: ["run_inline_query"]
    external_api_urls: []
  }
}

Step 4: Commit and Deploy
Finally, commit your changes in the Looker IDE and deploy your project to production.
