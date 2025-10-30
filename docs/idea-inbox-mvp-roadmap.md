# Bodo's ToDo Planer: Vision & Development Log

This document outlines the vision and current state of the Hierarchical Task Manager application. It also serves as a log of our development process and learnings through each iteration.

## 1. Vision & Core Concept

The primary goal of this application is to create a powerful yet intuitive tool for managing complex projects and tasks. The core concept revolves around a **hierarchical, nested task structure**, often described as "jobs inside jobs."

This allows users to break down large, complex projects into smaller, manageable sub-tasks, which can themselves be broken down further. This recursive structure provides clarity and organization for projects of any scale, from simple to-do lists to intricate, multi-layered initiatives.

## 2. Current State: MVP Features

The application is currently in its Minimum Viable Product (MVP) stage. The following features are fully functional:

-   **Create, Read, Update, Delete (CRUD):** Users can create top-level "jobs" and nested "sub-tasks". All task properties can be edited in the detail view, and tasks/sub-tasks can be deleted.
-   **Infinite Nesting:** The hierarchical structure supports an unlimited depth of sub-tasks.
-   **Tree View:** A collapsible tree view on the left-hand side provides a clear overview of the entire task hierarchy.
-   **Detailed Task Fields:** Each task includes a name, briefing, general info, links, creator, and status (`Proposed`, `In Progress`, `On Hold`, `Done`).
-   **Per-Task Time Tracking:** Each task has an independent timer that can be started and stopped.
-   **Data Persistence via Local Storage:** The entire task tree is saved to the browser's `localStorage`, ensuring data persists across sessions.

## 3. Detailed Documentation

For more specific details, please refer to our dedicated documentation:

-   For a deep dive into our technical choices, see the [**Architecture Document**](./architecture.md).
-   To see what's planned for the future, check out our [**Project Roadmap**](./roadmap.md).

## 4. Development Log & Learnings

### Iteration 1 (MVP Creation)

-   **Goal:** Establish the core hierarchical task management functionality.
-   **Key Decisions:** Chose React, TypeScript, and Tailwind CSS for rapid development. Used `localStorage` for data persistence to avoid backend complexity for the initial version.
-   **Learning 1 (State Management):** Centralizing state in the main `App` component and passing it down via props is effective for a small application but will not scale well. Prop drilling for handler functions (`onSelectTask`, `onUpdate`, etc.) is already evident. A future iteration will require a more robust state management solution (e.g., Zustand).
-   **Learning 2 (Component Design):** Recursive components (`TaskNode.tsx`) are a very powerful and elegant way to render a data structure like a tree. This approach is clean and highly maintainable.
-   **Learning 3 (Documentation):** Consolidating all project documentation into a single file initially was good for getting started, but it quickly became dense. Splitting the documentation into a root `README.md`, `architecture.md`, and `roadmap.md` provides much better structure, clarity, and focus for each topic. This makes the project easier to understand for anyone new.
