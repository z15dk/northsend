# Database Schema

## Overview

The schema should support:
- anonymous and authenticated transfers
- plan-based limits
- subscriptions
- white-label settings
- transfer expiry and cleanup

## Tables

### users
- `id` UUID primary key
- `email` string unique
- `password_hash` string nullable
- `name` string nullable
- `role` enum default `user`
- `plan_id` foreign key to `plans`
- `email_verified_at` datetime nullable
- `created_at` datetime
- `updated_at` datetime

### plans
- `id` UUID primary key
- `code` string unique
- `name` string
- `max_upload_bytes` bigint
- `retention_hours` integer
- `white_label_enabled` boolean
- `monthly_price_cents` integer
- `created_at` datetime

Seed examples:
- `guest`
- `free`
- `pro`

### subscriptions
- `id` UUID primary key
- `user_id` foreign key to `users`
- `plan_id` foreign key to `plans`
- `stripe_customer_id` string unique nullable
- `stripe_subscription_id` string unique nullable
- `status` enum
- `current_period_start` datetime nullable
- `current_period_end` datetime nullable
- `cancel_at_period_end` boolean default false
- `created_at` datetime
- `updated_at` datetime

### transfers
- `id` UUID primary key
- `user_id` foreign key to `users` nullable
- `plan_snapshot` string
- `status` enum
- `download_token` string unique
- `total_size_bytes` bigint
- `file_count` integer
- `expires_at` datetime
- `download_count` integer default 0
- `created_at` datetime
- `updated_at` datetime

Notes:
- `user_id` is nullable to support guest uploads
- `plan_snapshot` stores the effective plan used when the transfer was created

### files
- `id` UUID primary key
- `transfer_id` foreign key to `transfers`
- `original_name` string
- `storage_key` string unique
- `mime_type` string nullable
- `size_bytes` bigint
- `checksum` string nullable
- `created_at` datetime

### white_label_settings
- `id` UUID primary key
- `user_id` foreign key to `users` unique
- `brand_name` string
- `brand_slug` string unique
- `logo_file_key` string nullable
- `primary_color` string nullable
- `background_color` string nullable
- `headline` string nullable
- `subheadline` string nullable
- `embed_enabled` boolean default true
- `hosted_page_enabled` boolean default true
- `created_at` datetime
- `updated_at` datetime

### sessions
- Managed by auth provider if external auth is used
- Optional custom table if self-managed auth is chosen

### transfer_events
- `id` UUID primary key
- `transfer_id` foreign key to `transfers`
- `event_type` enum
- `ip_address` string nullable
- `user_agent` string nullable
- `created_at` datetime

Examples of events:
- `created`
- `downloaded`
- `expired`
- `deleted`

## Recommended Enums

### user_role
- `user`
- `admin`

### subscription_status
- `trialing`
- `active`
- `past_due`
- `canceled`
- `incomplete`

### transfer_status
- `uploading`
- `available`
- `expired`
- `deleting`
- `deleted`

### transfer_event_type
- `created`
- `downloaded`
- `expired`
- `deleted`

## Important Indexes

- `users.email`
- `plans.code`
- `subscriptions.user_id`
- `subscriptions.stripe_subscription_id`
- `transfers.download_token`
- `transfers.user_id`
- `transfers.expires_at`
- `transfers.status`
- `files.transfer_id`
- `white_label_settings.user_id`
- `white_label_settings.brand_slug`

## Cleanup Logic

Expired transfers should be processed by a scheduled job:

1. Find transfers where `expires_at < now()` and `status = available`
2. Mark them as `deleting`
3. Delete file objects from storage
4. Mark transfer as `deleted` or `expired`
5. Create a `transfer_events` record

## Future Tables

Possible later additions:
- `custom_domains`
- `team_members`
- `invoices`
- `download_notifications`
