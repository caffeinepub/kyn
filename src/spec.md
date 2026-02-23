# Specification

## Summary
**Goal:** Add user profiles with location selection and implement post moderation functionality.

**Planned changes:**
- Extend user profile data model to include a location field
- Add location selection to user registration and profile editing
- Add moderation status tracking to posts (pending, approved, removed)
- Implement moderator role authorization in the backend
- Create a moderation interface for moderators to review and manage posts
- Filter community feed to display only approved posts
- Display user location information on profile pages

**User-visible outcome:** Users can select and display their location on their profile. Moderators can review posts and approve or remove them, while regular users only see approved posts in the community feed.
