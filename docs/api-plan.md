# API Plan

## Overview

The API should be designed around a Next.js application with server routes for:
- authentication
- transfer creation
- file uploads
- downloads
- billing
- white-label settings

## API Areas

### Auth

#### `POST /api/auth/signup`
Creates a new user account.

Request:
- email
- password
- name optional

Response:
- user
- session
- effective plan: `free`

#### `POST /api/auth/login`
Authenticates an existing user.

#### `POST /api/auth/logout`
Ends the active session.

#### `GET /api/auth/me`
Returns current user and plan.

### Transfers

#### `POST /api/transfers`
Creates a new transfer record and validates plan limits.

Request:
- files metadata
- total size
- optional sender info for guests

Server logic:
- identify current actor as guest, free, or pro
- validate total upload size
- set retention window
- create transfer with status `uploading`
- return transfer id and upload instructions

Response:
- transfer id
- upload target info
- expires at
- max allowed size

#### `GET /api/transfers`
Returns transfers for logged-in user dashboard.

#### `GET /api/transfers/:id`
Returns transfer details for owner.

#### `DELETE /api/transfers/:id`
Deletes a transfer early if owned by current user.

### File Uploads

#### `POST /api/transfers/:id/files/presign`
Returns signed upload URLs or upload credentials for storage.

Request:
- file name
- file size
- content type

Response:
- storage key
- signed upload URL

#### `POST /api/transfers/:id/files/complete`
Confirms one or more files finished uploading.

Server logic:
- verify uploaded file metadata
- attach files to transfer
- when all files are complete, mark transfer as `available`

### Public Download

#### `GET /api/public/transfers/:token`
Returns public metadata for a transfer.

Response:
- file names
- total size
- expires at
- branding if applicable

#### `POST /api/public/transfers/:token/download`
Creates a download response or signed download URLs.

Server logic:
- verify transfer exists
- verify transfer not expired
- increment download count
- log event

### Billing

#### `POST /api/billing/checkout`
Creates a Stripe checkout session for Pro plan.

#### `POST /api/billing/portal`
Creates a Stripe billing portal session.

#### `POST /api/webhooks/stripe`
Handles:
- checkout completion
- subscription updates
- cancellation
- payment failures

### White-label

#### `GET /api/branding`
Returns current user's white-label settings.

#### `PUT /api/branding`
Updates:
- brand name
- brand slug
- colors
- headline
- subheadline

#### `POST /api/branding/logo`
Uploads or replaces brand logo.

#### `GET /api/brand/:slug`
Returns public branding config for hosted white-label page.

## Validation Rules

### Guest
- max transfer size: 2 GB
- retention: 24 hours

### Free
- max transfer size: 10 GB
- retention: 72 hours

### Pro
- max transfer size: 100 GB
- retention: plan configured value
- white-label enabled

## Scheduled Jobs

### Expiry cleanup job
Runs on a schedule and:
- finds expired transfers
- deletes files from storage
- updates database status

### Optional abandoned upload cleanup
Finds transfers stuck in `uploading` state too long and removes them.

## Security Notes

- Use signed upload URLs for direct-to-storage uploads
- Use signed download URLs or proxied downloads
- Rate limit public endpoints
- Validate file size before issuing upload permissions
- Restrict white-label management to paid users
- Sanitize branding inputs

## Suggested Implementation Order

1. Auth endpoints
2. Transfer creation
3. Upload signing and completion
4. Public download flow
5. Expiry cleanup job
6. Billing endpoints
7. White-label settings
