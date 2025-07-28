---
title: "Work from Office: A Studio Ghibli-Inspired Digital Workspace for a More Human Way of Working"
published: true
tags: devchallenge, frontendchallenge, css, javascript, nextjs, react, typescript
---

*This is a submission for [Frontend Challenge: Office Edition sponsored by Axero, Holistic Webdev: Office Space](https://dev.to/challenges/frontend/axero)*

## What I Built

I built **Work from Office**, a dream intranet homepage that reimagines the digital workspace through the whimsical and heartwarming lens of a Studio Ghibli film. My goal was to create an intranet that wasn't just a tool, but a destination—a place that fosters community, creativity, and a genuine sense of belonging. It’s a direct response to the challenge of creating the “perfect digital workspace,” one that not only enhances productivity but also enriches company culture.

This project directly answers the challenge prompts by delivering:

*   **A Holistic Intranet Homepage:** A fully functional and responsive intranet built with Next.js, React, and TypeScript. It features a rich set of widgets that are all beautifully integrated into the Ghibli-inspired design.
*   **CSS Art as Office Culture:** Instead of a single piece of art, the entire user interface is a love letter to a positive office culture. The Ghibli-inspired aesthetic, with its warm colors, gentle animations, and handcrafted feel, is my interpretation of a workplace that values warmth, nature, and personality over cold corporate efficiency. The entire UI is a piece of CSS art that brings the office to life.

## Demo

[workfromoffice.vercel.app]

GITHUB REPO: [workfromoffice](https://github.com/Haseeb-Arshad/workfromoffice)

TO BE UPLOADED SOON 

## Journey

The inspiration for this project came from a simple idea: what if the software we used every day sparked joy? I was tired of the cold, impersonal nature of most corporate tools and wanted to build something with a soul. The works of Studio Ghibli, with their emphasis on nature, community, and the quiet magic of everyday life, felt like the perfect antidote.

### The Build Process:

I’ve structured the project to be modular and scalable, using a modern tech stack to deliver a robust and maintainable application.

#### Project Structure:

The project is organized into the following key directories:

*   `app/`: This is the heart of the Next.js application, containing all the pages and components. Each feature is a self-contained module within this directory.
*   `application/`: This directory holds the core application logic, including state management with Jotai, custom hooks, and type definitions.
*   `infrastructure/`: This directory contains configuration files and utility functions that support the application, such as the web worker for the timer and local storage utilities.
*   `public/`: This directory contains all the static assets for the project, such as images, fonts, and the timer web worker.

#### Technology Stack:

*   **Framework:** Next.js with React and TypeScript
*   **Styling:** Tailwind CSS with custom theming
*   **State Management:** Jotai
*   **Rich Text Editing:** Lexical
*   **Drag and Drop:** @dnd-kit/core
*   **Charting:** Recharts

### Core Features:

“Work from Office” is packed with features designed to enhance both productivity and company culture. Here are some of the key highlights:

#### For Productivity:

*   **My Day:** A personalizable dashboard that gives you a quick overview of your schedule, tasks, and important announcements.
*   **To-Do List:** A drag-and-drop task manager that makes it easy to organize your work and stay on track.
*   **Notepad:** A rich-text editor for taking notes, brainstorming ideas, and drafting documents.
*   **Timer & Session Log:** A Pomodoro timer to help you focus, and a session log to track your work patterns and improve your productivity.
*   **Bookmark:** A tool to save and organize your favorite links.

#### For Culture & Collaboration:

*   **The Teahouse & Village Well:** These are dedicated spaces for non-work-related conversations, encouraging the kind of spontaneous social interactions that build strong teams.
*   **The Kudos Board:** A place for peer-to-peer recognition, fostering a culture of appreciation and positive reinforcement.
*   **The Traveler’s Directory:** This isn’t just a list of employees; it’s a vibrant, interactive passport that showcases each person’s unique skills, interests, and personality, helping to build connections across the organization.
*   **Resource Center:** A central hub for all your company resources, including a Company Wiki, HR Portal, IT Helpdesk, and Design System.
*   **Announcements:** A place to share company-wide news and updates.

#### For Personalization & Fun:

*   **Ambience & Music Player:** Create your perfect work environment with a selection of ambient sounds and your favorite music.
*   **Settings:** Customize the look and feel of your intranet with different backgrounds and sound themes.
*   **Changelog:** See what’s new and improved in the latest version of “Work from Office.”

### What I'm Proud Of:

I'm incredibly proud of how the final product captures the feeling I was aiming for. It's more than just a collection of features; it's a cohesive experience that I hope will make users smile. I'm also proud of the technical challenges I overcame, like implementing the background timer with a web worker, building a rich text editor with Lexical, and creating a robust theming system with pure CSS.

This project was a joy to build, and I hope it inspires others to think differently about the tools we use to work and connect.
