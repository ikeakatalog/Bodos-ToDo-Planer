# Roadmap & Idea Inbox

This document tracks planned features, long-term goals, and unsorted ideas for future versions of Bodo's ToDo Planer. It is a living document that will evolve as the project progresses.

## Short-Term Goals (Next Steps)

These are features planned for the next development cycle to enhance the core user experience.

-   **Drag-and-Drop:** Allow users to reorder tasks and change their parent/child relationships by dragging and dropping them in the tree view.
-   **Search & Filtering:** Implement a global search bar to find tasks by name or content. Add options to filter the tree view by status, creator, or other metadata.
-   **Improved Onboarding:** Enhance the empty state with more guidance for new users on how to create their first job.

## Mid-Term Goals (Future Versions)

These features will add significant new capabilities to the application.

-   **Due Dates & Reminders:** Add start and end date fields to tasks. Implement a basic notification system for upcoming deadlines.
-   **Rich Text Editing:** Replace the plain `textarea` fields for "Briefing" and "General Info" with a lightweight rich text editor (e.g., Tiptap, Lexical) to allow for formatting like bold, italics, lists, and headings.
-   **Progress Visualization:** Add visual indicators like progress bars to parent tasks. The progress could be calculated based on the number of completed sub-tasks.
-   **Keyboard Shortcuts:** Introduce keyboard shortcuts for common actions like creating a new task (`Cmd/Ctrl+N`), creating a sub-task, saving, etc.

## Long-Term Goals (Major Evolution)

These items represent a significant evolution of the project, likely requiring major architectural changes like the addition of a backend.

-   **Backend & Cloud Sync:**
    -   **Goal:** Allow users to access their tasks from any device.
    -   **Implementation:** Develop a backend service (e.g., using Node.js/Express) with a database (e.g., PostgreSQL, Firestore) to store user data.
-   **User Authentication:**
    -   **Goal:** Allow users to sign up and log in to their own private accounts.
    -   **Implementation:** Add authentication using JWTs, OAuth (e.g., "Sign in with Google"), or another standard method.
-   **Real-time Collaboration:**
    -   **Goal:** Enable multiple users to view and edit the same project simultaneously.
    -   **Implementation:** Use WebSockets (e.g., with Socket.io) to push real-time updates to all connected clients.

## Idea Inbox (Unsorted & Future Concepts)

A collection of ideas that are not yet prioritized.

-   Task dependencies (e.g., "Task B is blocked by Task A").
-   A manual dark/light mode toggle in the UI.
-   Integrations with external services (e.g., Google Calendar, GitHub, Slack).
-   Reporting and analytics to visualize time spent across different projects.
-   Task templates for recurring project structures.
-   File attachments for tasks.
