# Complete API Workflow - Curl Commands

This document contains all curl commands needed to test the complete leave request workflow.

---

## Prerequisites

- Server running on `http://localhost:3000`
- Database seeded with admin account:
  - Email: `admin@tut.ac.za`
  - Password: `admin123`

---

## Complete Workflow Sequence

### Step 1: Admin Logs In → Get Token

**Bash/Linux/Mac:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@tut.ac.za","password":"admin123"}'
```

**Windows PowerShell:**
```powershell
$adminResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"admin@tut.ac.za","password":"admin123"}'
$ADMIN_TOKEN = $adminResponse.token
Write-Host "Admin Token: $ADMIN_TOKEN"
```

**Save Token (Bash):**
```bash
export ADMIN_TOKEN="your_token_here"
```

**Expected Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@tut.ac.za",
    "role": "admin"
  }
}
```

---

### Step 2: Admin Creates Student Assistant

**Bash/Linux/Mac:**
```bash
curl -X POST http://localhost:3000/api/v1/student-assistants/addStudentAssistant \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "123456789@tut4life.ac.za",
    "password": "student123",
    "cellphone": "0123456789"
  }'
```

**Windows PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/v1/student-assistants/addStudentAssistant" `
  -Method POST `
  -Headers @{"Authorization"="Bearer $ADMIN_TOKEN"} `
  -ContentType "application/json" `
  -Body '{"name":"John Doe","email":"123456789@tut4life.ac.za","password":"student123","cellphone":"0123456789"}'
```

**Expected Response:**
```
The student assistant was added successfully to the database!
```

---

### Step 3: Student Assistant Logs In → Get Token

**Bash/Linux/Mac:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"123456789@tut4life.ac.za","password":"student123"}'
```

**Windows PowerShell:**
```powershell
$studentResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"123456789@tut4life.ac.za","password":"student123"}'
$STUDENT_TOKEN = $studentResponse.token
Write-Host "Student Token: $STUDENT_TOKEN"
```

**Save Token (Bash):**
```bash
export STUDENT_TOKEN="your_token_here"
```

**Expected Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "123456789@tut4life.ac.za",
    "role": "assistant"
  }
}
```

---

### Step 4: Student Creates Leave Request (WITHOUT Proof)

**Bash/Linux/Mac:**
```bash
curl -X POST http://localhost:3000/api/v1/leave-requests/createLeaveRequest \
  -H "Authorization: Bearer $STUDENT_TOKEN" \
  -F "reviewed_by=1" \
  -F "reason=I need sick leave due to illness" \
  -F "start_Date=2024-11-01T00:00:00Z" \
  -F "end_date=2024-11-05T00:00:00Z" \
  -F "leave_type=SICK"
```

**Windows PowerShell:**
```powershell
$formData = @{
  reviewed_by = "1"
  reason = "I need sick leave due to illness"
  start_Date = "2024-11-01T00:00:00Z"
  end_date = "2024-11-05T00:00:00Z"
  leave_type = "SICK"
}
Invoke-RestMethod -Uri "http://localhost:3000/api/v1/leave-requests/createLeaveRequest" `
  -Method POST `
  -Headers @{"Authorization"="Bearer $STUDENT_TOKEN"} `
  -Form $formData
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Leave request created successfully",
  "proof_upload": "No proof file provided",
  "data": {
    "leave_id": 1,
    "studAssi_id": 1,
    "isGranted": "PENDING",
    "proof_uploaded": false,
    ...
  }
}
```

**⚠️ Important:** Save the `leave_id` from the response (e.g., `1`) for later steps.

**Valid Leave Types:**
- `SICK`
- `MATERNITY_LEAVE`
- `FAMILY_RESPONSIBILITY`

---

### Step 5: Student Uploads Proof Later

**Bash/Linux/Mac:**
```bash
curl -X PUT http://localhost:3000/api/v1/leave-requests/uploadProof/1 \
  -H "Authorization: Bearer $STUDENT_TOKEN" \
  -F "proof=@/path/to/medical-certificate.pdf"
```

**Windows PowerShell:**
```powershell
$filePath = "C:\path\to\medical-certificate.pdf"
$fileBytes = [System.IO.File]::ReadAllBytes($filePath)
$boundary = [System.Guid]::NewGuid().ToString()
$bodyLines = @(
  "--$boundary",
  "Content-Disposition: form-data; name=`"proof`"; filename=`"medical-certificate.pdf`"",
  "Content-Type: application/pdf",
  "",
  [System.Text.Encoding]::GetEncoding("iso-8859-1").GetString($fileBytes),
  "--$boundary--"
)
$body = $bodyLines -join "`r`n"
Invoke-RestMethod -Uri "http://localhost:3000/api/v1/leave-requests/uploadProof/1" `
  -Method PUT `
  -Headers @{
    "Authorization"="Bearer $STUDENT_TOKEN"
    "Content-Type"="multipart/form-data; boundary=$boundary"
  } `
  -Body ([System.Text.Encoding]::GetEncoding("iso-8859-1").GetBytes($body))
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Proof file \"medical-certificate.pdf\" uploaded successfully",
  "data": {
    "leave_id": 1,
    "proof_file_name": "medical-certificate.pdf",
    "proof_file_type": "application/pdf",
    "proof_uploaded": true,
    "proof_file_size": 245678,
    ...
  }
}
```

**Note:** Replace `1` with the actual `leave_id` from Step 4.

**Allowed File Types:**
- Images: JPEG, PNG, GIF, WebP
- Documents: PDF
- Maximum size: 10MB

**Important:** Proof can be uploaded/updated as long as the leave request status is `PENDING` or `APPROVED` (not `DECLINED`).

---

### Step 6: Student Views All Their Leave Requests

**Bash/Linux/Mac:**
```bash
curl -X GET http://localhost:3000/api/v1/leave-requests/myLeaveRequests \
  -H "Authorization: Bearer $STUDENT_TOKEN"
```

**Windows PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/v1/leave-requests/myLeaveRequests" `
  -Method GET `
  -Headers @{"Authorization"="Bearer $STUDENT_TOKEN"}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Leave requests retrieved successfully",
  "data": [
    {
      "leave_id": 1,
      "studAssi_id": 1,
      "reason": "I need sick leave",
      "start_Date": "2024-11-01T00:00:00.000Z",
      "end_date": "2024-11-05T00:00:00.000Z",
      "leave_type": "SICK",
      "isGranted": "PENDING",
      "proof_file_name": "medical-certificate.pdf",
      ...
    }
  ],
  "count": 1
}
```

---

### Step 7: Student Views Specific Leave Request

**Bash/Linux/Mac:**
```bash
curl -X GET http://localhost:3000/api/v1/leave-requests/myLeaveRequest/1 \
  -H "Authorization: Bearer $STUDENT_TOKEN"
```

**Windows PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/v1/leave-requests/myLeaveRequest/1" `
  -Method GET `
  -Headers @{"Authorization"="Bearer $STUDENT_TOKEN"}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Leave request retrieved successfully",
  "data": {
    "leave_id": 1,
    "studAssi_id": 1,
    "reason": "I need sick leave",
    "start_Date": "2024-11-01T00:00:00.000Z",
    "end_date": "2024-11-05T00:00:00.000Z",
    "leave_type": "SICK",
    "isGranted": "PENDING",
    ...
  }
}
```

**Note:** Replace `1` with the actual `leave_id`.

---

### Step 8: Admin Views All Leave Requests

**Bash/Linux/Mac:**
```bash
curl -X GET http://localhost:3000/api/v1/leave-requests/displayLeaveRequests \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**Windows PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/v1/leave-requests/displayLeaveRequests" `
  -Method GET `
  -Headers @{"Authorization"="Bearer $ADMIN_TOKEN"}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Leave requests retrieved successfully",
  "data": [
    {
      "leave_id": 1,
      "studAssi_id": 1,
      "studentAssistant": {
        "stud_Assistance_id": 1,
        "name": "John Doe",
        "email": "123456789@tut4life.ac.za"
      },
      "reason": "I need sick leave",
      "isGranted": "PENDING",
      ...
    }
  ],
  "count": 1
}
```

---

### Step 9: Admin Downloads/Views Proof File

**Bash/Linux/Mac:**
```bash
curl -X GET http://localhost:3000/api/v1/leave-requests/proof/1 \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  --output proof-download.pdf
```

**Windows PowerShell:**
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/v1/leave-requests/proof/1" `
  -Headers @{"Authorization"="Bearer $ADMIN_TOKEN"} `
  -OutFile "proof-download.pdf"
```

**Expected Response:**
Binary file content (PDF/image) downloaded to `proof-download.pdf`

**Note:** Replace `1` with the actual `leave_id`.

---

### Step 10: Admin Approves Leave Request

**Bash/Linux/Mac:**
```bash
curl -X PUT http://localhost:3000/api/v1/leave-requests/updateLeaveRequest \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"leave_id": 1, "isGranted": "APPROVED"}'
```

**Windows PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/v1/leave-requests/updateLeaveRequest" `
  -Method PUT `
  -Headers @{
    "Authorization"="Bearer $ADMIN_TOKEN"
    "Content-Type"="application/json"
  } `
  -Body '{"leave_id":1,"isGranted":"APPROVED"}'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "The leave request has been APPROVED",
  "data": {
    "leave_id": 1,
    "isGranted": "APPROVED",
    "reviewed_at": "2024-11-15T10:30:00.000Z",
    "reviewed_by": 1
  }
}
```

**Valid Status Values:**
- `APPROVED` - Approve the leave request
- `DECLINED` - Decline the leave request

**Note:** Replace `1` with the actual `leave_id`.

---

### Step 11: Student Can Still Upload Proof After Approval

**Bash/Linux/Mac:**
```bash
curl -X PUT http://localhost:3000/api/v1/leave-requests/uploadProof/1 \
  -H "Authorization: Bearer $STUDENT_TOKEN" \
  -F "proof=@/path/to/additional-evidence.pdf"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Proof file \"additional-evidence.pdf\" uploaded successfully",
  "data": {
    "leave_id": 1,
    "proof_file_name": "additional-evidence.pdf",
    "proof_uploaded": true,
    ...
  }
}
```

**Important:** This works because the request is `APPROVED` (not `DECLINED`). Proof cannot be uploaded/updated if the request was `DECLINED`.

---

### Step 12: Admin Views All Student Assistants

**Bash/Linux/Mac:**
```bash
curl -X GET http://localhost:3000/api/v1/student-assistants/displayAllStudentAssistants \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**Windows PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/v1/student-assistants/displayAllStudentAssistants" `
  -Method GET `
  -Headers @{"Authorization"="Bearer $ADMIN_TOKEN"}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Student assistants retrieved successfully",
  "data": [
    {
      "stud_Assistance_id": 1,
      "name": "John Doe",
      "email": "123456789@tut4life.ac.za",
      "phone": "0123456789",
      "status": "ACTIVE",
      ...
    }
  ],
  "count": 1
}
```

---

### Step 13: Admin Removes Student Assistant

**Bash/Linux/Mac:**
```bash
curl -X DELETE http://localhost:3000/api/v1/student-assistants/removeStudentAssitantByEmail \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email": "123456789@tut4life.ac.za"}'
```

**Windows PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/v1/student-assistants/removeStudentAssitantByEmail" `
  -Method DELETE `
  -Headers @{
    "Authorization"="Bearer $ADMIN_TOKEN"
    "Content-Type"="application/json"
  } `
  -Body '{"email":"123456789@tut4life.ac.za"}'
```

**Expected Response:**
```
The student assistant was removed successfully from the database!
```

---

## Quick Reference: Complete Sequence (Bash)

```bash
# 1. Admin Login
ADMIN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@tut.ac.za","password":"admin123"}')
ADMIN_TOKEN=$(echo $ADMIN_RESPONSE | jq -r '.token')
echo "Admin Token: $ADMIN_TOKEN"

# 2. Create Student Assistant
curl -X POST http://localhost:3000/api/v1/student-assistants/addStudentAssistant \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"123456789@tut4life.ac.za","password":"student123","cellphone":"0123456789"}'

# 3. Student Login
STUDENT_RESPONSE=$(curl -s -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"123456789@tut4life.ac.za","password":"student123"}')
STUDENT_TOKEN=$(echo $STUDENT_RESPONSE | jq -r '.token')
echo "Student Token: $STUDENT_TOKEN"

# 4. Create Leave Request (without proof)
curl -X POST http://localhost:3000/api/v1/leave-requests/createLeaveRequest \
  -H "Authorization: Bearer $STUDENT_TOKEN" \
  -F "reviewed_by=1" \
  -F "reason=I need sick leave" \
  -F "start_Date=2024-11-01T00:00:00Z" \
  -F "end_date=2024-11-05T00:00:00Z" \
  -F "leave_type=SICK"

# 5. Upload Proof Later (replace 1 with actual leave_id)
curl -X PUT http://localhost:3000/api/v1/leave-requests/uploadProof/1 \
  -H "Authorization: Bearer $STUDENT_TOKEN" \
  -F "proof=@medical-certificate.pdf"

# 6. Student Views Their Leave Requests
curl -X GET http://localhost:3000/api/v1/leave-requests/myLeaveRequests \
  -H "Authorization: Bearer $STUDENT_TOKEN"

# 7. Admin Views All Leave Requests
curl -X GET http://localhost:3000/api/v1/leave-requests/displayLeaveRequests \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# 8. Admin Downloads Proof
curl -X GET http://localhost:3000/api/v1/leave-requests/proof/1 \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  --output proof.pdf

# 9. Admin Approves
curl -X PUT http://localhost:3000/api/v1/leave-requests/updateLeaveRequest \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"leave_id":1,"isGranted":"APPROVED"}'
```

---

## API Endpoints Summary

| Method | Endpoint | Auth Required | Role |
|--------|----------|---------------|------|
| POST | `/api/v1/auth/login` | No | - |
| POST | `/api/v1/student-assistants/addStudentAssistant` | Yes | Admin |
| GET | `/api/v1/student-assistants/displayAllStudentAssistants` | Yes | Admin |
| DELETE | `/api/v1/student-assistants/removeStudentAssitantByEmail` | Yes | Admin |
| POST | `/api/v1/leave-requests/createLeaveRequest` | Yes | Assistant |
| GET | `/api/v1/leave-requests/myLeaveRequests` | Yes | Assistant |
| GET | `/api/v1/leave-requests/myLeaveRequest/:leave_id` | Yes | Assistant |
| GET | `/api/v1/leave-requests/displayLeaveRequests` | Yes | Admin |
| PUT | `/api/v1/leave-requests/uploadProof/:leave_id` | Yes | Assistant |
| GET | `/api/v1/leave-requests/proof/:leave_id` | Yes | Admin |
| PUT | `/api/v1/leave-requests/updateLeaveRequest` | Yes | Admin |

---

## Important Notes

1. **Tokens**: Save tokens after login for use in subsequent requests
2. **IDs**: Replace `1` in URLs with actual IDs returned from previous requests
3. **File Paths**: Replace file paths with your actual file paths
4. **Proof Upload Rules**:
   - Can upload/update if status is `PENDING` or `APPROVED`
   - Cannot upload/update if status is `DECLINED`
5. **File Requirements**:
   - Allowed types: JPEG, PNG, GIF, WebP, PDF
   - Maximum size: 10MB
6. **Date Format**: Use ISO 8601 format: `YYYY-MM-DDTHH:mm:ssZ`
7. **Leave Types**: `SICK`, `MATERNITY_LEAVE`, `FAMILY_RESPONSIBILITY`
8. **Status Values**: `PENDING`, `APPROVED`, `DECLINED`

---

## Troubleshooting

### Authentication Errors
- Ensure token is included in `Authorization` header: `Bearer <token>`
- Token expires after 1 hour (default)
- Re-login to get a new token

### File Upload Errors
- Check file size (max 10MB)
- Verify file type is allowed
- Ensure leave request exists and status allows upload

### Database Errors
- Ensure database is running and seeded
- Check `.env` file has correct `DATABASE_URL`
- Run migrations if needed: `npx prisma migrate dev`

---

**Last Updated**: 2024-11-15

