# Application Architecture

This document outlines the architectural decisions made for the Bodo's ToDo Planer application. The MVP was built with a focus on simplicity, rapid development, and modern web standards, resulting in a purely client-side, serverless application.

## 1. Core Technologies

-   **Framework: React**
    -   **Why:** React's component-based architecture is a natural fit for building a modular and scalable user interface. We leverage React Hooks (`useState`, `useEffect`, `useCallback`, `useMemo`) for all state and lifecycle management, which simplifies component logic.

-   **Language: TypeScript**
    -   **Why:** TypeScript provides static typing on top of JavaScript. This is crucial for improving code quality, ensuring maintainability, and enhancing the developer experience by catching potential errors during development rather than at runtime. It makes our data structures, like the `Task` interface, explicit and safe to work with.

-   **Styling: Tailwind CSS**
    -   **Why:** Tailwind's utility-first approach allows for extremely rapid UI development. By applying classes directly in the markup, we keep styles co-located with their components. This makes components self-contained and eliminates the need for separate CSS files, streamlining the development process. For the MVP, it is loaded via a CDN to avoid any build step.

## 2. State Management

-   **Current Approach:** React Hooks (`useState`, `useEffect`).
-   **Details:** The entire application state—specifically the `tasks` array—is centralized and "owned" by the root `App.tsx` component. State and state-updating functions are then passed down to child components via props (a technique known as "prop drilling").
-   **Justification:** This is the simplest and most direct method for state management in React. For the current scale of the MVP, it is highly effective and easy to reason about.
-   **Future Considerations:** As the application grows in complexity, prop drilling can become cumbersome. A future iteration will likely involve migrating to a dedicated state management library like **Zustand** (for its simplicity and minimal boilerplate) or **Redux Toolkit** (for more complex state scenarios).

## 3. Data Structure

-   **Model:** The core data is modeled as a recursive tree structure. The `Task` type is defined with a `subTasks` property, which is an array of `Task` objects.
-   **Rationale:** This model is flexible and perfectly maps to the "jobs inside jobs" concept. It allows for infinite nesting and is straightforward to traverse recursively for operations like adding, updating, or deleting tasks at any level.

## 4. Data Persistence

-   **Method:** Browser `localStorage`.
-   **Details:** The entire `tasks` state array is serialized to a JSON string and saved to `localStorage` whenever it changes. On application load, this data is read and deserialized to hydrate the initial state.
-   **Rationale:** `localStorage` is a zero-configuration, browser-native solution that requires no backend or database setup. It's ideal for a serverless, client-side application MVP.
-   **Limitations:** This approach has significant limitations. The data is confined to the user's specific browser on a single device, cannot be shared or synced, and has size limits. This will be replaced by a proper backend in a future version.

## 5. Unique Identifiers

-   **Method:** `crypto.randomUUID()`
-   **Rationale:** This is a modern, secure, and collision-resistant browser API for generating unique identifiers (UUIDs). It's the standard practice for creating unique keys for list items or database entries in client-side applications, replacing older methods like `Math.random()`.
