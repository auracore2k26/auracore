# ⚡ AuraCore - Fitness & Special Care Management Platform
> **Complete Operations Manual & System Capability Documentation**

AuraCore is a web platform designed for Personal Fitness, Body Transformation, Weight Loss, and Special Care & Mobility Training centers. It connects Super Admin Management, Trainers, and Students into a synchronized system powered by a live **Supabase PostgreSQL Cloud Database**.

---

## 🔑 1. Access Portals & Credentials

### 👑 Super Admin Control Console
* **Login URL**: [`admin-login.html`](file:///e:/Work/fit%20website/fit%20website/admin-login.html)
* **Username**: `admin`
* **Password**: `admin123`

### 🏋️‍♂️ Trainer Duty Portal
* **Login URL**: [`trainer-login.html`](file:///e:/Work/fit%20website/fit%20website/trainer-login.html)
* **Default Trainer Credentials**:
  * `karthik_fit` / `password123` (Karthik Raja - Fitness & Transformation)
  * `priya_mobility` / `password123` (Priya Sundaram - Special Care & Mobility)
  * `arun_fit` / `password123` (Arun Kumar - Weight Loss & Functional)

### 🌟 Student Portal
* **Login URL**: [`student-login.html`](file:///e:/Work/fit%20website/fit%20website/student-login.html)
* **Default Student Credentials (Registered Mobile / Password)**:
  * `9840011223` / `password123` (Rohan Sharma - Offline Home Visit)
  * `9884055667` / `password123` (Aravind - Child Mobility Special Care)
  * `9962099887` / `password123` (Meera Nair - Online Virtual Class)

---

## 👑 2. Super Admin Capabilities

1. **🏋️ Student Roster & Credential Management**:
   * Add new students (`+ Add New Student`) or edit existing student profiles.
   * **View Student Credentials**: Display every student's **User ID (Registered Phone)** and **Login Password** directly in the Admin Roster table.
   * **Create Student Credentials**: Assign/create custom User IDs (Phone Numbers) and Passwords when registering a new student.
   * Configure student goals, package class counts (e.g. 12, 16, or 20 classes), custom billing fees, and home/online locations.
   * Reassign assigned trainers dynamically per student (`Reassign Trainer`).

2. **👟 Trainer Assembly & Duty Control**:
   * Register new trainers (`+ Register New Trainer`).
   * **Manual Specialty Entry**: Enter trainer specialties manually as free text instead of constrained dropdown options.
   * Upload custom trainer profile logos (`Avatar Image URL`).
   * **📋 Work Assembly**: Assign student rosters to trainers and broadcast custom daily **Duty Instructions**.
   * **📅 Schedule Management**: Edit weekly trainer work schedules (Monday through Sunday).

3. **💳 Master Payment Gateway & Custom QR Control**:
   * Set official company UPI ID (`8754759353@upi`) for GPay, PhonePe, and BHIM UPI.
   * Upload custom Bank/GPay QR Code image file or specify custom QR image URL.
   * Update the official Helpline Phone Number live across all page headers, footers, and WhatsApp support widgets.

4. **📍 GPS Live Location History Monitoring**:
   * Review all GPS location pins recorded by trainers visiting student home locations in Chennai, with distance radius checks and admin verification statuses.

5. **💰 Salary Payouts & Package Cycle Automation**:
   * When a student reaches 100% package completion (e.g. 12/12 classes), salary payout records auto-generate (`Salary Payout Ready`) for admin approval.
   * Admin can review payout history and approve salary disbursements.

6. **📢 Broadcast Notice Center**:
   * Publish platform-wide notices to trainers and students.

7. **🎭 View As Role Impersonation & One-Click Return**:
   * Preview any trainer or student dashboard directly from the Admin Command Center (`-- View As Trainer / Student --`).
   * Return to the Admin Console at any time using the sticky **`⬅️ Back to Admin Panel`** button.

---

## 🏋️‍♂️ 3. Trainer Duty Capabilities

1. **📍 Bulletproof GPS Pinning**:
   * Pin live GPS coordinates upon arrival at a student's home (`📍 Pin GPS Location`) with a guaranteed 2.5-second fallback timeout mechanism.
2. **▶️ Mutual Verification Session**:
   * Start a live class verification session (`▶️ Verification Session`), sending a confirmation prompt to the student's portal.
3. **📋 Duty Instructions**:
   * View custom duty notes and assigned student rosters issued by Super Admin.
4. **📅 Weekly Schedule**:
   * Inspect assigned daily time slots and visit locations.

---

## 🌟 4. Student Portal Capabilities

1. **🎯 Class Progress Tracker**:
   * Track current cycle class completion (e.g. 5 / 12 Classes Completed) and lifetime total completed classes.
2. **✅ Mutual Attendance Confirmation**:
   * Click **`✅ Confirm Class`** when a trainer initiates a verification session to verify daily attendance mutually.
3. **💳 Direct Fee Payment & Custom QR Code**:
   * Scan the official bank QR code or click direct GPay, PhonePe, and Paytm links to pay billing fees.
   * Submit 12-digit UTR transaction reference numbers or click 1-click **Confirm Payment** to update status to PAID.
4. **📹 Google Meet Integration**:
   * Access direct Google Meet links for online virtual training sessions.
5. **🔑 Self-Service Password Recovery**:
   * Recover forgotten passwords independently using simulated 6-digit OTP verification dispatched to the user's contact details.

---

## ⚡ 5. Database & Architecture Standards

* **Supabase PostgreSQL Cloud DB**: 100% live cloud database REST API connection (`qzlqbbhuygkylnfwhkcp`).
* **Real-time Persistence**: All actions (`syncToSupabaseCloud` and `loadFromSupabaseCloud`) sync directly with Supabase PostgreSQL tables: `trainers`, `students`, `payment_settings`, `admin_credentials`, `location_pins`, `salary_payouts`, `broadcasts`.
* **Mobile Touch Standard**: UI built following the **44px Touch Target Standard** with responsive table scroll wrappers.
