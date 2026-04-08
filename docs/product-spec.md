# Product Spec

## Summary

This product is a file transfer platform inspired by WeTransfer, built for small businesses that want a simple and professional way to send large files. The core differentiator is white-label support for paying customers.

## Target Audience

Small businesses that need to:
- send large files to clients
- keep a simple upload and download experience
- present the file sharing flow in their own brand

## Plans

### Guest
- Max upload: 2 GB
- File retention: 24 hours
- No account required
- No white-label access

### Free User
- Max upload: 10 GB
- File retention: 72 hours
- Account required
- No white-label access

### Pro User
- Max upload: 100 GB
- Longer retention window
- Monthly subscription
- White-label access

## MVP Features

### Public experience
- Landing page
- Pricing page
- Upload flow
- Download page
- Login and signup

### Upload flow
- Drag-and-drop upload
- Multiple files per transfer
- Display of size limits by plan
- Transfer link generation
- Automatic file expiry

### Account experience
- Dashboard with active and expired transfers
- Upgrade to paid plan
- Billing page

### White-label experience
- Brand name
- Logo upload
- Primary color
- Background color
- Embedded upload widget
- Branded hosted upload page

## Not Included In V1

- Password protected links
- Teams and multi-seat accounts
- Advanced analytics
- Custom domains
- Full page builder
- Mobile apps

## Core Business Logic

### Upload limits
- Guests: up to 2 GB per transfer
- Free users: up to 10 GB per transfer
- Paid users: up to 100 GB per transfer

### Retention
- Guests: 24 hours
- Free users: 72 hours
- Paid users: configurable paid retention window

### Upgrade path
- Guest users should be nudged toward signup for higher free limits
- Free users should be nudged toward Pro for larger transfers and white-label

## Pages

- `/`
- `/pricing`
- `/upload`
- `/login`
- `/signup`
- `/download/[token]`
- `/dashboard`
- `/billing`
- `/settings/branding`
- `/brand/[slug]`

## Design Direction

The product should feel:
- minimalist
- Nordic
- clean
- calm
- trustworthy

Visual principles:
- light backgrounds
- generous spacing
- limited color palette
- clear typography
- strong upload dropzone

## Suggested First Build Order

1. Project setup
2. Authentication
3. Database schema
4. File upload to storage
5. Transfer creation and download links
6. Expiry and cleanup jobs
7. Stripe billing
8. Dashboard
9. White-label settings
10. Embedded widget and branded upload page
