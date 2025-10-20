# Password Reset Feature Documentation

## Overview
The password reset feature allows customers, staff, and admins to reset their passwords securely via email. Additionally, admins can directly reset passwords for any user.

---

## Features Implemented

### 1. **Self-Service Password Reset**
- Users can request a password reset via email
- Secure token-based system with 24-hour expiration
- Rate limiting (max 3 attempts per hour per email)
- Email notifications for password changes

### 2. **Admin Password Reset**
- Admins can reset passwords for any user type (Customer, Staff, Admin)
- Direct password reset without token
- Audit logging of all admin password resets

### 3. **Security Features**
- Tokens expire after 24 hours
- One-time use tokens
- Rate limiting to prevent abuse
- Email enumeration protection
- Automatic token invalidation after use
- Encrypted password storage

---

## Database Schema

**New Table:** `password_reset_tokens`

```sql
CREATE TABLE password_reset_tokens (
    id BIGSERIAL PRIMARY KEY,
    token VARCHAR(255) NOT NULL UNIQUE,
    user_email VARCHAR(255) NOT NULL,
    user_type VARCHAR(50) NOT NULL,
    expiry_date TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    used_at TIMESTAMP NULL
);
```

**Migration File:** `create_password_reset_tokens_table.sql`

---

## API Endpoints

### Customer/Public Endpoints

#### 1. Request Password Reset

**Endpoint:** `POST /api/password/forgot`

**Description:** Initiate password reset process. Sends email with reset link.

**Authentication:** Not required (public)

**Request Body:**
```json
{
  "email": "customer@example.com"
}
```

**Example Request:**
```bash
curl -X POST "http://localhost:8080/api/password/forgot" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com"
  }'
```

**Success Response (200 OK):**
```json
{
  "message": "If your email is registered, you will receive a password reset link shortly.",
  "success": true
}
```

**Note:** Always returns success to prevent email enumeration attacks.

---

#### 2. Reset Password with Token

**Endpoint:** `POST /api/password/reset`

**Description:** Reset password using the token from email.

**Authentication:** Not required (public)

**Request Body:**
```json
{
  "token": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "newPassword": "NewSecurePassword123!"
}
```

**Example Request:**
```bash
curl -X POST "http://localhost:8080/api/password/reset" \
  -H "Content-Type: application/json" \
  -d '{
    "token": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "newPassword": "NewSecurePassword123!"
  }'
```

**Success Response (200 OK):**
```json
{
  "message": "Password reset successfully. You can now log in with your new password.",
  "success": true
}
```

**Error Response (400 Bad Request):**
```json
{
  "message": "Invalid or expired password reset token",
  "success": false
}
```

---

#### 3. Validate Reset Token

**Endpoint:** `GET /api/password/validate-token?token={token}`

**Description:** Check if a reset token is valid before showing reset form.

**Authentication:** Not required (public)

**Example Request:**
```bash
curl -X GET "http://localhost:8080/api/password/validate-token?token=a1b2c3d4-e5f6-7890-abcd-ef1234567890"
```

**Success Response (200 OK):**
```json
{
  "valid": true,
  "message": "Token is valid"
}
```

**Invalid Token Response (200 OK):**
```json
{
  "valid": false,
  "message": "Token is invalid or expired"
}
```

---

### Admin Endpoints

#### Admin Password Reset

**Endpoint:** `POST /api/admin/users/reset-password`

**Description:** Admin directly resets a user's password without token.

**Authentication:** Required (Admin role)

**Request Body:**
```json
{
  "email": "user@example.com",
  "userType": "CUSTOMER",
  "newPassword": "NewPassword123!"
}
```

**User Types:**
- `CUSTOMER` - For customers
- `STAFF` - For staff members
- `ADMIN` - For other admins

**Example Request:**
```bash
curl -X POST "http://localhost:8080/api/admin/users/reset-password" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "userType": "CUSTOMER",
    "newPassword": "TempPassword123!"
  }'
```

**Success Response (200 OK):**
```json
{
  "message": "Password reset successfully",
  "success": true
}
```

**Error Response (400 Bad Request):**
```json
{
  "message": "Failed to reset password: User not found",
  "success": false
}
```

---

## Testing

### Manual Testing

1. **Test Forgot Password Flow:**
```bash
# Request password reset
curl -X POST "http://localhost:8080/api/password/forgot" \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'

# Check email for token, then reset password
curl -X POST "http://localhost:8080/api/password/reset" \
  -H "Content-Type: application/json" \
  -d '{
    "token": "TOKEN_FROM_EMAIL",
    "newPassword": "NewPassword123!"
  }'
```

2. **Test Admin Password Reset:**
```bash
curl -X POST "http://localhost:8080/api/admin/users/reset-password" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "userType": "CUSTOMER",
    "newPassword": "TempPassword123!"
  }'
```

3. **Test Token Validation:**
```bash
curl "http://localhost:8080/api/password/validate-token?token=VALID_TOKEN"
```

---

## Configuration

### Frontend Configuration

Update your reset link URL in `PasswordResetService.java`:

```java
String resetLink = String.format("http://YOUR_FRONTEND_URL/reset-password?token=%s", token);
```

### Token Expiry

Modify expiry time in `PasswordResetService.java`:

```java
private static final int TOKEN_EXPIRY_HOURS = 24; // Change as needed
```

### Rate Limiting

Modify rate limit in `PasswordResetService.java`:

```java
private static final int MAX_RESET_ATTEMPTS_PER_HOUR = 3; // Change as needed
```

---

## Security Best Practices

### 1. **Email Enumeration Protection**
- Always return success response even if email doesn't exist
- Prevents attackers from discovering valid email addresses

### 2. **Rate Limiting**
- Maximum 3 reset attempts per hour per email
- Prevents brute force attacks

### 3. **Token Security**
- UUID-based random tokens
- 24-hour expiration
- One-time use only
- Automatic invalidation after use

### 4. **Password Requirements**
- Minimum 6 characters (can be increased)
- Encoded with BCrypt
- Never stored in plain text

### 5. **Audit Logging**
- All admin password resets are logged
- Includes admin username, target user, and timestamp
- Helps with security audits

---

## Audit Logging

All admin password resets are logged with:
- Action: `ADMIN_RESET_PASSWORD`
- Resource Type: User type (CUSTOMER, STAFF, ADMIN)
- Details: User email
- Admin username
- Timestamp
- Success/failure status

**View audit logs:**
```bash
curl "http://localhost:8080/api/admin/audit-logs?action=ADMIN_RESET_PASSWORD" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

## Files Created

1. **Database Migration:**
   - `create_password_reset_tokens_table.sql`

2. **Models:**
   - `PasswordResetToken.java`

3. **Repositories:**
   - `PasswordResetTokenRepository.java`

4. **Services:**
   - `PasswordResetService.java`

5. **Controllers:**
   - `PasswordResetController.java` (public endpoints)
   - Updated `AdminApiController.java` (admin endpoint)

6. **DTOs:**
   - `ForgotPasswordRequest.java`
   - `ResetPasswordRequest.java`
   - `AdminResetPasswordRequest.java`

---

## Next Steps

1. **Run Database Migration:**
   ```bash
   docker compose exec -T db psql -U postgres -d music_store < create_password_reset_tokens_table.sql
   ```

2. **Test the Endpoints:**
   - Test forgot password flow
   - Test password reset with token
   - Test admin password reset

3. **Implement Frontend:**
   - Create forgot password page
   - Create reset password page
   - Add password reset option in user settings

4. **Optional Enhancements:**
   - Add password strength meter
   - Implement 2FA for sensitive accounts
   - Add password history (prevent reuse)
   - Add email verification for new emails

---

**Last Updated:** October 20, 2025
**Version:** 1.0.0
