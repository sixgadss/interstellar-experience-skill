---
name: interstellar-experience
description: Use when creating or refining an interactive 3D starfield, personal galaxy, planetarium, or interstellar navigation interface, especially when camera travel, quiet reading, return journeys, or gesture handoff feel flat, abrupt, or difficult to control. 适用于立体星空、个人星系、星际航行与星之空间交互。
license: MIT
---

# 星际体验设计

Create a navigable space with understandable destinations and reliable return journeys. The stars carry real content; camera movement helps the person reach it.

## Start from the existing experience

Inspect the scene renderer, projection, camera ownership, navigation history, overlays, pause state and data storage. Retain working behavior and user content. For a new interface, state audience, the primary action and a concrete tone, then define visual tokens before components. Follow the user's design rules; avoid inheriting one project's font or hosting provider as universal requirements.

Choose the smallest relevant path:

- For depth, star distribution, nebula color or performance, read [spatial-rendering.md](references/spatial-rendering.md).
- For approach, landing, return, rotation, gesture handoff or asynchronous navigation, read [navigation.md](references/navigation.md). The runnable [flight.js](assets/flight.js) example provides only camera interpolation and cancellation.
- For records, discovery, sharing, reading or acceptance checks, read [content-and-verification.md](references/content-and-verification.md).

## Experience contract

A deliberate destination starts a finite, interruptible journey. Near and far objects share a camera and respond at different apparent speeds. Arrival ends camera motion before reading. Return restores the saved scene and complete camera pose. Direct input takes ownership immediately; old arrivals and loads cannot reopen content afterward.

Treat background pause and navigation independently. A paused background still renders an explicit flight, then settles. Freeze displacement for reduced-motion users, and retain keyboard, mouse and touch alternatives when gesture control is offered. Use gesture recognition as another input adapter to the same camera and command model.

Keep foreground controls above spatial hit targets. Camera depth may reorder stars within the scene, never above navigation or overlays. Check the actual element receiving a click, including invisible portions of marker buttons.

## Visual and content decisions

Use tinted, near-dark space and predominantly light stars. Give stars irregular positions, depth, size and brightness; group related content without turning every group into a geometric diagram. Derive UI and renderer colors from declared tokens. Nebula color supports spatial structure and the user's selected palette; preserve the project's limits on gradients and glow.

A readable column, clear return action and quick capture path take priority over decorative cockpit elements. Use genuine dates and explicit sample labels. Preserve private data and chosen visibility; links do not imply cloud synchronization or real social activity.

## Deliver and verify

Verify a nontrivial round trip, paused flight, interruption, rapid replacement, modal ownership, reduced motion and hidden-tab resumption. Use the focused browser and data checks in the verification reference. For web/offline variants, compare actual embedded application code and assets. Publish only within the user's authorization and available tools; report separately what was created, tested and actually deployed.
