# Password Reset Flow Setup

This document explains how to configure the password reset flow with Supabase.

## Features Implemented

1. **Password Reset Request Page** (`/[lang]/reset-password`)
   - Users enter their email address
   - Receives a password reset email from Supabase
   - Security: Always shows success to prevent email enumeration

2. **Password Update Page** (`/[lang]/update-password`)
   - Users land here after clicking the email link
   - Enter and confirm new password
   - Password validation using the validation utility
   - Session validation to ensure link is valid

3. **Server Actions** (`lib/supabase/actions.ts`)
   - `requestPasswordReset()` - Sends reset email
   - `updatePassword()` - Updates user password

4. **UI Integration**
   - "Forgot password?" link added to login form
   - Responsive and user-friendly interfaces

## Supabase Configuration

### Required URL Configuration

You need to configure the redirect URL in your Supabase dashboard:

1. Go to **Supabase Dashboard** → Your Project
2. Navigate to **Authentication** → **URL Configuration**
3. Add the following to **Redirect URLs**:

```
For Development:
http://localhost:3000/en/update-password
http://localhost:3000/sv/update-password

For Production:
https://yourdomain.com/en/update-password
https://yourdomain.com/sv/update-password
```

**Important:** Replace `yourdomain.com` with your actual domain.

### Wildcard Configuration (Recommended)

For easier multi-language support, you can use wildcards:

```
For Development:
http://localhost:3000/*/update-password

For Production:
https://yourdomain.com/*/update-password
```

This allows any language code (en, sv, etc.) to work automatically.

## Email Template Customization (Optional)

You can customize the password reset email template:

1. Go to **Supabase Dashboard** → **Authentication** → **Email Templates**
2. Select **Reset Password** template
3. Customize the subject and body
4. Use `{{ .ConfirmationURL }}` placeholder for the reset link

Example template:
```html
<h2>Reset your password</h2>
<p>Click the link below to reset your password:</p>
<p><a href="{{ .ConfirmationURL }}">Reset Password</a></p>
<p>If you didn't request this, please ignore this email.</p>
<p>This link will expire in 1 hour.</p>
```

## Environment Variables

Ensure these are set in your `.env` file:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # or your production URL
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

The `NEXT_PUBLIC_SITE_URL` is used to generate the correct redirect URLs.

## Testing the Flow

### Local Testing

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to: `http://localhost:3000/en/reset-password`

3. Enter an email address (must be registered in your Supabase auth)

4. Check your email inbox for the reset link

5. Click the link - you should land on `/en/update-password`

6. Enter and confirm your new password

7. Click "Update password" - you should be redirected to login

### Production Testing

1. Deploy your application

2. Update Supabase redirect URLs with your production domain

3. Test the complete flow on production

## Security Features

1. **Email Enumeration Prevention**: Always returns success message even if email doesn't exist

2. **Session Validation**: Reset link expires after 1 hour (Supabase default)

3. **Password Validation**: Enforces strong password requirements:
   - Minimum 8 characters
   - At least one uppercase letter
   - At least one lowercase letter
   - At least one number

4. **CSRF Protection**: Uses Supabase's built-in token validation

## Password Requirements

Users must create passwords with:
- ✅ At least 8 characters
- ✅ Contains uppercase letter (A-Z)
- ✅ Contains lowercase letter (a-z)
- ✅ Contains number (0-9)

These requirements are enforced client-side and validated using the `validators.password()` utility.

## Troubleshooting

### Issue: "Invalid or expired link"

**Cause**: The reset link has expired (default 1 hour) or has already been used.

**Solution**: Request a new password reset link.

### Issue: Reset email not received

**Causes**:
1. Email in spam folder
2. Email doesn't exist in Supabase
3. Email service not configured in Supabase

**Solution**:
- Check spam folder
- Verify email exists in Supabase Dashboard → Authentication → Users
- Check Supabase email service configuration

### Issue: Redirect URL mismatch

**Cause**: The redirect URL in Supabase doesn't match the URL in your app.

**Solution**: Ensure all language variants are added to Supabase redirect URLs.

### Issue: "Failed to update password"

**Cause**: Password doesn't meet requirements or session is invalid.

**Solution**:
- Ensure password meets all requirements
- Request a new reset link if session expired

## Support

For issues with Supabase authentication, check:
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Password Reset Guide](https://supabase.com/docs/guides/auth/auth-password-reset)
