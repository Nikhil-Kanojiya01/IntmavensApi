# IntmavensApi

Backend API service for Intmavens website - handles email notifications for contact forms, bookings, and support requests.

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Complete System Flow](#complete-system-flow)
- [Setup Guide](#setup-guide)
- [Configuration](#configuration)
- [API Endpoints](#api-endpoints)
- [Email Templates](#email-templates)
- [Testing](#testing)
- [Deployment](#deployment)

---

## 🎯 Overview

This Node.js/Express backend provides email functionality for the Intmavens frontend, replacing EmailJS with a custom Nodemailer-based solution. It handles multiple email templates for different use cases (contact forms, bookings, support requests).

## 🛠 Tech Stack

- **Node.js** - Runtime environment
- **Express** - Web framework
- **Nodemailer** - Email sending
- **dotenv** - Environment variable management
- **CORS** - Cross-origin resource sharing
- **Nodemon** - Development hot-reload

## 📁 Project Structure

```
IntmavensApi/
├── src/
│   ├── config/
│   │   └── mailConfig.js           # Nodemailer Gmail transporter configuration
│   ├── controllers/
│   │   └── mailController.js       # Request handlers (contact, career, blog, generic)
│   ├── routes/
│   │   └── mailRoutes.js           # API route definitions
│   ├── services/
│   │   └── mailService.js          # Email sending business logic & utilities
│   └── templates/
│       ├── contactTemplate.js      # Contact form email template
│       ├── careerTemplate.js       # Career application email template
│       ├── blogTemplate.js         # Blog comment/inquiry email template
│       └── index.js                # Template mapper & type definitions
├── .env                            # Environment variables (not in git)
├── .gitignore                      # Git ignore rules
├── index.js                        # Express server entry point
├── package.json                    # Project dependencies
└── README.md                       # Documentation
```

---

## 🔄 Complete System Flow

### **Architecture Diagram**

```
┌─────────────────────────────────────────────────────────────────┐
│                        INTMAVENS WEBSITE                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────┐  ┌──────────────────────┐              │
│  │   React Frontend     │  │   Static Pages       │              │
│  │  (Vite, localhost)   │  │  (HTML/CSS)          │              │
│  │                      │  │                      │              │
│  │  ├─ Contact Form     │  │  ├─ Home             │              │
│  │  ├─ Career Form      │  │  ├─ About            │              │
│  │  ├─ Blog Comments    │  │  └─ Services         │              │
│  │  └─ Search           │  │                      │              │
│  └────────────┬─────────┘  └──────────────────────┘              │
│               │                                                   │
│               │ HTTP POST                                         │
│               │ JSON Data                                         │
└───────────────┼───────────────────────────────────────────────────┘
                │
                │ (CORS Enabled)
                ↓
┌─────────────────────────────────────────────────────────────────┐
│                    INTMAVENSAPI BACKEND                          │
│              (Node.js/Express on port 4000)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              POST /api/mail/contact                       │   │
│  │              POST /api/mail/career                        │   │
│  │              POST /api/mail/blog                          │   │
│  │              POST /api/mail/send                          │   │
│  └──────────────────┬───────────────────────────────────────┘   │
│                     │                                             │
│                     ↓                                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │          ROUTE HANDLER (mailRoutes.js)                   │   │
│  │  ├─ handleContactMail()                                  │   │
│  │  ├─ handleCareerMail()                                   │   │
│  │  ├─ handleBlogMail()                                     │   │
│  │  └─ handleSendMail()                                     │   │
│  └──────────────────┬───────────────────────────────────────┘   │
│                     │                                             │
│                     ↓                                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │        VALIDATION & DATA PROCESSING                      │   │
│  │  ├─ Validate required fields                             │   │
│  │  ├─ Validate email format                                │   │
│  │  ├─ Validate template type                               │   │
│  │  └─ Prepare form data                                    │   │
│  └──────────────────┬───────────────────────────────────────┘   │
│                     │                                             │
│                     ↓                                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │         TEMPLATE SELECTION & BUILD                       │   │
│  │         (templates/index.js)                             │   │
│  │  ┌─────────────┬──────────────┬──────────────┐           │   │
│  │  │  CONTACT    │   CAREER     │    BLOG      │           │   │
│  │  │  Template   │  Template    │  Template    │           │   │
│  │  │  (Purple)   │  (Red)       │  (Blue)      │           │   │
│  │  └─────────────┴──────────────┴──────────────┘           │   │
│  └──────────────────┬───────────────────────────────────────┘   │
│                     │                                             │
│                     ↓                                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │     EMAIL SERVICE (mailService.js)                       │   │
│  │     sendEmail(templateType, formData)                    │   │
│  │                                                           │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │  Build HTML Email from Template + Form Data        │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  │                                                           │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │  Prepare Two Emails:                               │  │   │
│  │  │  1. ADMIN EMAIL (to: SENDER_EMAIL)                │  │   │
│  │  │     Subject: [ADMIN] New {Type} from {Name}        │  │   │
│  │  │  2. USER CONFIRMATION (to: form email)            │  │   │
│  │  │     Subject: We received your {type}              │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  └──────────────────┬───────────────────────────────────────┘   │
│                     │                                             │
│                     ↓                                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │      NODEMAILER TRANSPORT (mailConfig.js)               │   │
│  │      Gmail SMTP Configuration                           │   │
│  │      ├─ Host: smtp.gmail.com                            │   │
│  │      ├─ Port: 587 (TLS)                                 │   │
│  │      ├─ Auth: App Password                              │   │
│  │      └─ Transporter.verify() → Connection Check         │   │
│  └──────────────────┬───────────────────────────────────────┘   │
│                     │                                             │
└─────────────────────┼───────────────────────────────────────────┘
                      │
                      │ SMTP Protocol
                      │ Port 587
                      ↓
            ┌──────────────────┐
            │  Gmail SMTP      │
            │  Server          │
            └────────┬─────────┘
                     │
         ┌───────────┼───────────┐
         │           │           │
         ↓           ↓           ↓
    ┌────────┐ ┌────────┐ ┌──────────┐
    │ Admin  │ │ User   │ │Response  │
    │ Inbox  │ │ Inbox  │ │to        │
    │        │ │(Confirm)│ │Frontend  │
    │✅ Email│ │✅ Email│ │{ok:true} │
    └────────┘ └────────┘ └──────────┘
```

---

### **Request/Response Flow Sequence**

```
FRONTEND                              BACKEND                        EMAIL PROVIDER
─────────────────────────────────────────────────────────────────────────────────

User fills form
      │
      │ Click "Send"
      ↓
Browser Validation
      │
      │ POST /api/mail/contact
      ├────────────────────────────────→ Express Route Handler
      │                                  │
      │                                  ├─ Validate fields
      │                                  │
      │                                  ├─ Load template
      │                                  │
      │                                  ├─ Build email HTML
      │                                  │
      │                                  ├─ Prepare admin email
      │                                  │
      │                                  ├─ Prepare user confirmation
      │                                  │
      │                                  ├─ Send both emails ─────────→ Gmail SMTP
      │                                  │                              │
      │                                  │  ◄─ Email 1: Admin Inbox ───┤
      │                                  │                              │
      │                                  │  ◄─ Email 2: User Inbox ────┤
      │                                  │
      │                                  ├─ Compile response
      │ ◄──────── {ok: true, data: {...}}─┤
      │          HTTP 200
      │
Show Success Message
      │
Update UI
```

---

### **Complete Request-to-Response Timeline**

```
TIME    FRONTEND              BACKEND ACTION                    EMAIL STATUS
────────────────────────────────────────────────────────────────────────────

T+0ms   User submits form     
        ↓
T+10ms                        Request received at POST endpoint
                              ↓
T+20ms                        Validate: name, email, phone, message
                              ✅ All fields present
                              ↓
T+30ms                        Check email format
                              ✅ Email valid (regex check)
                              ↓
T+40ms                        Load CONTACT template from file
                              ✅ Template loaded
                              ↓
T+50ms                        Build HTML: inject form data into template
                              ✅ HTML generated
                              ↓
T+60ms                        Prepare Admin Email:
                              • To: admin@example.com (SENDER_EMAIL)
                              • From: noreply@intmavens.com
                              • Reply-To: user@example.com
                              • Subject: [ADMIN] New Contact Request from John
                              ↓
T+70ms                                                          Sending to SMTP...
                              ↓
T+100ms   Show "Sending..."   Send Admin Email (async)           📤 In Transit
          spinner
                              Simultaneously:
                              ↓
T+70ms                        Prepare User Confirmation Email:
                              • To: user@example.com
                              • From: noreply@intmavens.com
                              • Subject: We received your contact request
                              ↓
T+100ms                                                          Sending to SMTP...
                              ↓
T+150ms                       Send User Email (async)             📤 In Transit
                              ↓
T+200ms                                                          ✅ Admin email received
                              
T+300ms                                                          ✅ User email received
                              ↓
T+350ms                       Both emails sent successfully
                              Compile response:
                              {
                                ok: true,
                                message: "Email sent successfully",
                                data: {
                                  adminEmail: true,
                                  userEmail: true
                                }
                              }
                              ↓
T+360ms  ◄────────────────── HTTP 200 Response ────────
         Hide spinner
         Show success
         Alert/Toast
         ↓
T+400ms  Reset form fields
         Redirect (optional)
```

---

### **Data Flow Through System Layers**

```
┌─────────────────────────────────────────────────────────────┐
│ LAYER 1: PRESENTATION (React Frontend)                      │
├─────────────────────────────────────────────────────────────┤
│  Contact.jsx / Career.jsx / BlogPage.jsx                    │
│  ├─ User Input: {name, email, phone, message, ...}          │
│  └─ POST request to backend API                             │
└─────────────────────────────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ LAYER 2: ROUTING (mailRoutes.js)                            │
├─────────────────────────────────────────────────────────────┤
│  Express Router                                              │
│  ├─ Route: POST /api/mail/contact                           │
│  ├─ Route: POST /api/mail/career                            │
│  ├─ Route: POST /api/mail/blog                              │
│  └─ Route: POST /api/mail/send                              │
└─────────────────────────────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ LAYER 3: CONTROLLERS (mailController.js)                    │
├─────────────────────────────────────────────────────────────┤
│  Request Handlers                                            │
│  ├─ Validate request body                                   │
│  ├─ Check required fields                                   │
│  ├─ Verify email format                                     │
│  ├─ Prepare data for service layer                          │
│  └─ Call mailService.sendEmail()                            │
└─────────────────────────────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ LAYER 4: SERVICES (mailService.js)                          │
├─────────────────────────────────────────────────────────────┤
│  Business Logic                                              │
│  ├─ Validate template type                                  │
│  ├─ Call buildTemplate() from templates/index.js            │
│  ├─ Generate email HTML                                     │
│  ├─ Prepare admin email object                              │
│  ├─ Prepare user confirmation email object                  │
│  ├─ Send both emails via transporter                        │
│  ├─ Handle errors independently                             │
│  └─ Return results {adminEmail: bool, userEmail: bool}      │
└─────────────────────────────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ LAYER 5: TEMPLATES (templates/index.js)                     │
├─────────────────────────────────────────────────────────────┤
│  Email Template Factory                                      │
│  ├─ Switch on template type                                 │
│  ├─ Load correct template file                              │
│  ├─ Call template function with form data                   │
│  ├─ Return {subject, html}                                  │
│  └─ Available templates: CONTACT, CAREER, BLOG              │
└─────────────────────────────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ LAYER 6: CONFIGURATION (mailConfig.js)                      │
├─────────────────────────────────────────────────────────────┤
│  SMTP Transport                                              │
│  ├─ Nodemailer createTransport()                            │
│  ├─ Gmail SMTP Host: smtp.gmail.com                         │
│  ├─ Port: 587 (TLS) or 465 (SSL)                            │
│  ├─ Auth: {user, pass} from .env                            │
│  ├─ transporter.verify() - Connection test                  │
│  └─ Reusable transporter instance                           │
└─────────────────────────────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ LAYER 7: EXTERNAL SERVICE (Gmail SMTP)                      │
├─────────────────────────────────────────────────────────────┤
│  Email Delivery                                              │
│  ├─ Receive email object from transporter.sendMail()        │
│  ├─ Authenticate with App Password                          │
│  ├─ Queue emails for delivery                               │
│  ├─ Send to SMTP server                                     │
│  ├─ Route to recipient inboxes                              │
│  └─ Return delivery confirmation                            │
└─────────────────────────────────────────────────────────────┘
```

---

### **Error Handling Flow**

```
Request Received
      │
      ├─ Validation Error? ──────→ Missing/Invalid Fields
      │                           ↓
      │                        Return 400
      │                        {ok: false, error: "..."}
      │
      ├─ Template Error? ────────→ Invalid Template Type
      │                           ↓
      │                        Return 400
      │                        {ok: false, error: "..."}
      │
      ├─ Admin Email Failed? ────→ SMTP Error
      │  (but User email sent)    ↓
      │                        Return 200
      │                        {ok: true, data: {
      │                          adminEmail: false,
      │                          userEmail: true
      │                        }}
      │
      ├─ User Email Failed? ─────→ SMTP Error
      │  (but Admin sent)         ↓
      │                        Return 200
      │                        {ok: true, data: {
      │                          adminEmail: true,
      │                          userEmail: false
      │                        }}
      │
      ├─ Both Emails Failed? ────→ SMTP/Network Error
      │                           ↓
      │                        Return 500
      │                        {ok: false, error: "..."}
      │
      └─ Success! ───────────────→ Both Emails Sent
                                 ↓
                              Return 200
                              {ok: true, data: {
                                adminEmail: true,
                                userEmail: true
                              }}
```

---

### **State Transitions During Email Sending**

```
┌─────────────────┐
│   IDLE STATE    │
│  Waiting for    │
│  user input     │
└────────┬────────┘
         │ Form submitted
         ↓
┌─────────────────────────────────┐
│  VALIDATION_IN_PROGRESS STATE   │
│  ├─ Check fields                │
│  ├─ Validate email              │
│  └─ Check template type         │
└────────┬────────────────────────┘
         │ ✅ All valid
         ↓
┌─────────────────────────────────┐
│  TEMPLATE_LOADING STATE         │
│  ├─ Fetch template file         │
│  ├─ Inject form data            │
│  └─ Build HTML                  │
└────────┬────────────────────────┘
         │ ✅ Template ready
         ↓
┌─────────────────────────────────┐
│  EMAIL_SENDING STATE            │
│  ├─ Prepare admin email         │
│  ├─ Prepare user confirmation   │
│  ├─ Connect to SMTP             │
│  └─ Send both (parallel)        │
└────────┬────────────────────────┘
         │
    ┌────┴────┐
    │          │
    ↓          ↓
┌────────┐  ┌────────┐
│SUCCESS │  │ FAILED │
│ STATE  │  │ STATE  │
└────────┘  └────────┘
    │          │
    └────┬─────┘
         ↓
┌─────────────────────────────────┐
│  RESPONSE_SENT STATE            │
│  Send result to frontend        │
└────────┬────────────────────────┘
         │
         ↓
┌─────────────────┐
│   IDLE STATE    │
│  Ready for next │
│  submission     │
└─────────────────┘
```

---

## 🚀 Setup Guide

### Step 1: Set Up Gmail App Password

**Important:** You cannot use your normal Gmail password with Nodemailer. Google blocks it for security reasons. You **must** create an App Password.

**Steps to Create Gmail App Password:**

1. ✅ **Enable 2-Step Verification**
   - Go to your Google Account: [myaccount.google.com](https://myaccount.google.com)
   - Navigate to **Security** → **2-Step Verification**
   - Follow the prompts to turn on 2FA (required for App Passwords)

2. ✅ **Generate App Password**
   - After 2FA is enabled, go to **Security** → **App passwords**
   - Select app: **Mail**
   - Select device: **Other (Custom name)** - name it "Nodemailer" or "Intmavens Backend"
   - Click **Generate**

3. ✅ **Copy the 16-Character Password**
   - Google will show a 16-character password (may include spaces)
   - **Copy this password exactly** - this is your SMTP password
   - Store it securely; treat it like a real password

4. ✅ **Keep It Secret**
   - Never commit this to Git
   - Never expose it in frontend code
   - Only use it in backend `.env` file

**Gmail SMTP Configuration:**
- **Host:** `smtp.gmail.com`
- **Port:** `587` (TLS, recommended) or `465` (SSL)
- **Username:** Your full Gmail address (e.g., `yourname@gmail.com`)
- **Password:** The 16-character App Password you just created

---

### Step 2: Install Dependencies

The project already has dependencies listed in `package.json`. Install them:

```bash
cd IntmavensApi
npm install
```

**Installed packages:**
- `express` - Web framework
- `cors` - Enable cross-origin requests
- `nodemailer` - Send emails via SMTP
- `dotenv` - Load environment variables
- `nodemon` - Auto-restart server (dev dependency)

---

### Step 3: Configure Gmail Credentials in Backend .env

Create a `.env` file in the project root (IntmavensApi folder) with your Gmail App Password:

```env
# Server Configuration
PORT=4000
NODE_ENV=development

# Gmail SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=yourname@gmail.com
SMTP_PASS=your-16-char-app-password

# Email Settings
SENDER_EMAIL=yourname@gmail.com
SENDER_NAME=Intmavens Support

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

**Gmail-Specific Configuration:**
- **SMTP_HOST:** Must be `smtp.gmail.com` (Gmail's SMTP server)
- **SMTP_PORT:** Use `587` for TLS (recommended) or `465` for SSL
- **SMTP_USER:** Your full Gmail address (e.g., `yourname@gmail.com`)
- **SMTP_PASS:** The 16-character App Password from Step 1 (not your Gmail password)
- **SENDER_EMAIL:** Your Gmail address (used for both sending and receiving admin notifications)
- **SENDER_NAME:** Display name for emails

**Dual Email Feature:**
The system sends **two emails** when a user submits a form:
1. **Admin Email** - Full form details sent to your email address with `[ADMIN]` prefix
2. **User Email** - Confirmation email sent to the user's email address thanking them for contacting

**Security Best Practices:**
- ✅ `.env` is already in `.gitignore` - never commit this file
- ✅ Never expose these credentials in React/frontend code
- ✅ Only the backend should read these environment variables

---

### Step 4: Configure Nodemailer Transporter for Gmail

Implement Gmail SMTP configuration in `src/config/mailConfig.js`:

```javascript
const nodemailer = require('nodemailer');
require('dotenv').config();

// Create reusable transporter for Gmail
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,        // smtp.gmail.com
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465, // false for 587 (TLS), true for 465 (SSL)
  auth: {
    user: process.env.SMTP_USER,      // yourname@gmail.com
    pass: process.env.SMTP_PASS,      // 16-char app password
  },
});

// Verify Gmail connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Gmail SMTP Configuration Error:', error);
    console.error('Check your .env file and App Password');
  } else {
    console.log('✅ Gmail SMTP Server ready to send emails');
  }
});

module.exports = transporter;
```

**This is the standard Gmail + App Password setup that Nodemailer recommends.**

**How it works:**
- Port `587` uses TLS (Transport Layer Security) - recommended for Gmail
- Port `465` uses SSL (Secure Sockets Layer) - also supported
- `secure: false` for port 587, `secure: true` for port 465
- `transporter.verify()` tests the connection when server starts
- Returns helpful error messages if Gmail credentials are wrong

**Note:** Everything else (endpoints, templates, validation, React integration) stays the same. The only difference is that you're using Gmail's SMTP server with an App Password instead of another provider.

---

### Step 5: Create Email Templates

Implement email templates in `src/templates/`:

**`src/templates/contactTemplate.js`** - Contact form template
```javascript
module.exports = function contactTemplate(data) {
  const { name, email, phone, message } = data;
  
  return {
    subject: `New Contact Form Submission from ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">New Contact Inquiry</h1>
          <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">From: Intmavens Contact Form</p>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-left: 4px solid #667eea;">
          <h2 style="color: #333; margin-top: 0; font-size: 20px;">Contact Details</h2>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #ddd; font-weight: bold; color: #667eea; width: 30%;">Name:</td>
              <td style="padding: 12px 0 12px 20px; border-bottom: 1px solid #ddd; color: #333;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #ddd; font-weight: bold; color: #667eea;">Email:</td>
              <td style="padding: 12px 0 12px 20px; border-bottom: 1px solid #ddd; color: #333;">
                <a href="mailto:${email}" style="color: #667eea; text-decoration: none;">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 0; font-weight: bold; color: #667eea;">Phone:</td>
              <td style="padding: 12px 0 12px 20px; color: #333;">
                <a href="tel:${phone}" style="color: #667eea; text-decoration: none;">${phone}</a>
              </td>
            </tr>
          </table>
          
          <div style="margin: 30px 0; padding: 20px; background: white; border-radius: 4px; border-left: 4px solid #667eea;">
            <h3 style="margin-top: 0; color: #333;">Message:</h3>
            <p style="color: #555; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>
        </div>
      </div>
    `,
  };
};
```

**`src/templates/careerTemplate.js`** - Career application template
```javascript
module.exports = function careerTemplate(data) {
  const { name, email, phone, role, message } = data;
  
  return {
    subject: `Career Application from ${name} - Position: ${role || 'Not Specified'}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">New Career Application</h1>
          <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">Job Application Received</p>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-left: 4px solid #ff6b6b;">
          <h2 style="color: #333; margin-top: 0; font-size: 20px;">Applicant Information</h2>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #ddd; font-weight: bold; color: #ff6b6b; width: 30%;">Full Name:</td>
              <td style="padding: 12px 0 12px 20px; border-bottom: 1px solid #ddd; color: #333;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #ddd; font-weight: bold; color: #ff6b6b;">Email:</td>
              <td style="padding: 12px 0 12px 20px; border-bottom: 1px solid #ddd; color: #333;">
                <a href="mailto:${email}" style="color: #ff6b6b; text-decoration: none;">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #ddd; font-weight: bold; color: #ff6b6b;">Phone:</td>
              <td style="padding: 12px 0 12px 20px; border-bottom: 1px solid #ddd; color: #333;">
                <a href="tel:${phone}" style="color: #ff6b6b; text-decoration: none;">${phone}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 0; font-weight: bold; color: #ff6b6b;">Applied For:</td>
              <td style="padding: 12px 0 12px 20px; color: #333;">${role || 'Position not specified'}</td>
            </tr>
          </table>
          
          <div style="margin: 30px 0; padding: 20px; background: white; border-radius: 4px; border-left: 4px solid #ff6b6b;">
            <h3 style="margin-top: 0; color: #333;">Cover Letter / Additional Information:</h3>
            <p style="color: #555; line-height: 1.6; white-space: pre-wrap;">${message || 'No additional information provided'}</p>
          </div>
        </div>
      </div>
    `,
  };
};
```

**`src/templates/blogTemplate.js`** - Blog comment/inquiry template
```javascript
module.exports = function blogTemplate(data) {
  const { name, email, phone, message, postTitle = 'Blog Post' } = data;
  
  return {
    subject: `New Blog Comment/Inquiry from ${name} - ${postTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">New Blog Engagement</h1>
          <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">Comment or Inquiry Received</p>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-left: 4px solid #4facfe;">
          <h2 style="color: #333; margin-top: 0; font-size: 20px;">Visitor Information</h2>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #ddd; font-weight: bold; color: #4facfe; width: 30%;">Name:</td>
              <td style="padding: 12px 0 12px 20px; border-bottom: 1px solid #ddd; color: #333;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #ddd; font-weight: bold; color: #4facfe;">Email:</td>
              <td style="padding: 12px 0 12px 20px; border-bottom: 1px solid #ddd; color: #333;">
                <a href="mailto:${email}" style="color: #4facfe; text-decoration: none;">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #ddd; font-weight: bold; color: #4facfe;">Phone:</td>
              <td style="padding: 12px 0 12px 20px; border-bottom: 1px solid #ddd; color: #333;">
                <a href="tel:${phone}" style="color: #4facfe; text-decoration: none;">${phone || 'Not provided'}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 0; font-weight: bold; color: #4facfe;">Blog Post:</td>
              <td style="padding: 12px 0 12px 20px; color: #333;">${postTitle}</td>
            </tr>
          </table>
          
          <div style="margin: 30px 0; padding: 20px; background: white; border-radius: 4px; border-left: 4px solid #4facfe;">
            <h3 style="margin-top: 0; color: #333;">Comment / Message:</h3>
            <p style="color: #555; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>
        </div>
      </div>
    `,
  };
};
```

**`src/templates/index.js`** - Template mapper
```javascript
const contactTemplate = require('./contactTemplate');
const careerTemplate = require('./careerTemplate');
const blogTemplate = require('./blogTemplate');

const TEMPLATE_TYPES = {
  CONTACT: 'CONTACT',
  CAREER: 'CAREER',
  BLOG: 'BLOG',
};

/**
 * Build email template based on template type
 * @param {string} templateType - Type of template (CONTACT, CAREER, BLOG)
 * @param {object} data - Data to populate the template
 * @returns {object} - Object with subject and html properties
 */
function buildTemplate(templateType, data) {
  switch (templateType) {
    case TEMPLATE_TYPES.CONTACT:
      return contactTemplate(data);
    
    case TEMPLATE_TYPES.CAREER:
      return careerTemplate(data);
    
    case TEMPLATE_TYPES.BLOG:
      return blogTemplate(data);
    
    default:
      throw new Error(`Unknown template type: ${templateType}. Allowed types: ${Object.values(TEMPLATE_TYPES).join(', ')}`);
  }
}

module.exports = { buildTemplate, TEMPLATE_TYPES };
```

---

### Step 6: Implement `/send-mail` Endpoint with Dual Email Sending

### Step 6: Implement Mail Service with All Templates

**`src/services/mailService.js`** - Comprehensive email service for all templates

```javascript
const transporter = require('../config/mailConfig');
const { buildTemplate, TEMPLATE_TYPES } = require('../templates');

/**
 * Send email to both admin and user using templates
 * @param {string} templateType - Type of template (CONTACT, CAREER, BLOG)
 * @param {object} formData - Form data to populate template
 * @returns {object} - Results with admin and user email info
 */
async function sendEmail(templateType, formData) {
  try {
    // Validate template type
    const validTemplates = Object.values(TEMPLATE_TYPES);
    if (!validTemplates.includes(templateType)) {
      throw new Error(`Invalid template type: ${templateType}. Valid types: ${validTemplates.join(', ')}`);
    }

    const { name, email, phone, message, ...rest } = formData;
    
    // Build email content from template
    const { subject, html } = buildTemplate(templateType, {
      name, email, phone, message, ...rest,
    });
    
    const results = {};
    
    // Send email to admin
    try {
      const adminInfo = await transporter.sendMail({
        from: `"${process.env.SENDER_NAME}" <${process.env.SENDER_EMAIL}>`,
        to: process.env.SENDER_EMAIL,
        replyTo: email,
        subject: `[ADMIN] ${subject}`,
        html,
      });
      results.adminEmail = adminInfo;
      console.log(`✅ Admin email sent (${templateType}):`, process.env.SENDER_EMAIL);
    } catch (adminError) {
      console.error(`❌ Failed to send admin email:`, adminError.message);
      results.adminEmail = null;
    }
    
    // Send confirmation email to user
    try {
      const userSubject = `We received your message`;
      const userHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0;">Thank You!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">We've received your submission</p>
          </div>
          <div style="background: #f9f9f9; padding: 30px;">
            <p style="color: #333;">Dear ${name},</p>
            <p style="color: #555; line-height: 1.6;">Thank you for reaching out! We have received your message and will get back to you soon.</p>
            <p style="color: #555;">Best regards,<br><strong>${process.env.SENDER_NAME}</strong></p>
          </div>
        </div>
      `;
      
      const userInfo = await transporter.sendMail({
        from: `"${process.env.SENDER_NAME}" <${process.env.SENDER_EMAIL}>`,
        to: email,
        subject: userSubject,
        html: userHtml,
      });
      results.userEmail = userInfo;
      console.log(`✅ User confirmation email sent:`, email);
    } catch (userError) {
      console.error(`❌ Failed to send user email:`, userError.message);
      results.userEmail = null;
    }
    
    if (!results.adminEmail && !results.userEmail) {
      throw new Error('Failed to send both emails.');
    }
    
    return results;
  } catch (error) {
    console.error('❌ Email service error:', error.message);
    throw error;
  }
}

/**
 * Send raw email (without template)
 */
async function sendRawEmail(options) {
  try {
    const mailOptions = {
      from: options.from || `"${process.env.SENDER_NAME}" <${process.env.SENDER_EMAIL}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Raw email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Failed to send raw email:', error.message);
    throw error;
  }
}

/**
 * Send bulk emails to multiple recipients
 */
async function sendBulkEmails(recipients, subject, html) {
  try {
    const results = {};
    for (const recipient of recipients) {
      try {
        const info = await transporter.sendMail({
          from: `"${process.env.SENDER_NAME}" <${process.env.SENDER_EMAIL}>`,
          to: recipient.email,
          subject, html,
        });
        results[recipient.email] = { success: true, messageId: info.messageId };
      } catch (error) {
        results[recipient.email] = { success: false, error: error.message };
      }
    }
    return results;
  } catch (error) {
    console.error('❌ Bulk email service error:', error.message);
    throw error;
  }
}

module.exports = { sendEmail, sendRawEmail, sendBulkEmails };
```

**Key Features:**
- ✅ **Multiple Templates** - Supports CONTACT, CAREER, BLOG templates
- ✅ **Dual Email System** - Sends to both admin and user
- ✅ **Error Handling** - Independent error handling for each email
- ✅ **Template Validation** - Validates template type before processing
- ✅ **Extra Utilities** - Includes raw email and bulk email functions

---

**`src/controllers/mailController.js`** - Request handlers for all form types

```javascript
const { sendEmail } = require('../services/mailService');

/**
 * Handle contact form submissions
 */
async function handleContactMail(req, res) {
  try {
    const { name, email, phone, message } = req.body;
    
    if (!name || !email || !phone || !message) {
      return res.status(400).json({
        ok: false,
        error: 'Missing required fields: name, email, phone, message',
      });
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        ok: false,
        error: 'Invalid email address format',
      });
    }
    
    const results = await sendEmail('CONTACT', { name, email, phone, message });
    
    res.json({
      ok: true,
      message: 'Contact form submitted successfully',
      data: {
        adminEmail: !!results.adminEmail,
        userEmail: !!results.userEmail,
      },
    });
  } catch (error) {
    console.error('❌ Contact mail error:', error);
    res.status(500).json({
      ok: false,
      error: 'Failed to submit contact form. Please try again later.',
    });
  }
}

/**
 * Handle career form submissions
 */
async function handleCareerMail(req, res) {
  try {
    const { name, email, phone, role, message } = req.body;
    
    if (!name || !email || !phone) {
      return res.status(400).json({
        ok: false,
        error: 'Missing required fields: name, email, phone',
      });
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        ok: false,
        error: 'Invalid email address format',
      });
    }
    
    const results = await sendEmail('CAREER', { 
      name, email, phone, 
      role: role || 'Not Specified',
      message: message || 'No cover letter provided',
    });
    
    res.json({
      ok: true,
      message: 'Career application submitted successfully',
      data: {
        adminEmail: !!results.adminEmail,
        userEmail: !!results.userEmail,
      },
    });
  } catch (error) {
    console.error('❌ Career mail error:', error);
    res.status(500).json({
      ok: false,
      error: 'Failed to submit career application. Please try again later.',
    });
  }
}

/**
 * Handle blog comment/inquiry submissions
 */
async function handleBlogMail(req, res) {
  try {
    const { name, email, phone, message, postTitle } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({
        ok: false,
        error: 'Missing required fields: name, email, message',
      });
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        ok: false,
        error: 'Invalid email address format',
      });
    }
    
    const results = await sendEmail('BLOG', { 
      name, email, 
      phone: phone || 'Not provided',
      message,
      postTitle: postTitle || 'Blog Post Comment',
    });
    
    res.json({
      ok: true,
      message: 'Blog comment submitted successfully',
      data: {
        adminEmail: !!results.adminEmail,
        userEmail: !!results.userEmail,
      },
    });
  } catch (error) {
    console.error('❌ Blog mail error:', error);
    res.status(500).json({
      ok: false,
      error: 'Failed to submit blog comment. Please try again later.',
    });
  }
}

/**
 * Generic mail handler (backward compatible)
 */
async function handleSendMail(req, res) {
  try {
    const { templateType, name, email, message, ...rest } = req.body;
    
    if (!templateType || !name || !email || !message) {
      return res.status(400).json({
        ok: false,
        error: 'Missing required fields: templateType, name, email, message',
      });
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        ok: false,
        error: 'Invalid email address format',
      });
    }
    
    const results = await sendEmail(templateType, { name, email, message, ...rest });
    
    res.json({
      ok: true,
      message: 'Email sent successfully',
      data: {
        adminEmail: !!results.adminEmail,
        userEmail: !!results.userEmail,
      },
    });
  } catch (error) {
    console.error('❌ Mail sending error:', error);
    res.status(500).json({
      ok: false,
      error: error.message || 'Failed to send email. Please try again later.',
    });
  }
}

module.exports = { 
  handleContactMail, 
  handleCareerMail, 
  handleBlogMail,
  handleSendMail,
};
```

**Handler Features:**
- ✅ **Specialized Handlers** - Each form type has dedicated validation
- ✅ **Field Validation** - Ensures all required fields are present
- ✅ **Email Format Validation** - Validates email addresses
- ✅ **Default Values** - Optional fields get defaults
- ✅ **Detailed Responses** - Shows which emails were sent

---

### **Step 7: Routes Configuration**

**`src/routes/mailRoutes.js`** - API endpoints for email handling
```javascript
const express = require('express');
const {
  handleContactMail,
  handleCareerMail,
  handleBlogMail,
  handleSendMail,
} = require('../controllers/mailController');

const router = express.Router();

// Contact form email
router.post('/mail/contact', handleContactMail);

// Career application email
router.post('/mail/career', handleCareerMail);

// Blog comment email
router.post('/mail/blog', handleBlogMail);

// Generic email handler (requires templateType)
router.post('/mail/send', handleSendMail);

module.exports = router;
```

**Route Details:**

| Endpoint | Method | Purpose | Required Fields |
|----------|--------|---------|-----------------|
| `/api/mail/contact` | POST | Contact form submission | name, email, phone, message |
| `/api/mail/career` | POST | Job application | name, email, phone |
| `/api/mail/blog` | POST | Blog comment/inquiry | name, email, message |
| `/api/mail/send` | POST | Generic email | templateType, name, email, message |

**Request/Response Examples:**

**POST /api/mail/contact**
```javascript
// Request
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1-555-0123",
  "message": "I would like more information about your services."
}

// Response
{
  "ok": true,
  "message": "Email sent successfully",
  "data": {
    "adminEmail": true,
    "userEmail": true
  }
}
```

**POST /api/mail/career**
```javascript
// Request
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+1-555-0456",
  "role": "Senior Developer",
  "message": "I am interested in the Senior Developer position..."
}

// Response
{
  "ok": true,
  "message": "Email sent successfully",
  "data": {
    "adminEmail": true,
    "userEmail": true
  }
}
```

**POST /api/mail/blog**
```javascript
// Request
{
  "name": "Michael Chen",
  "email": "michael@example.com",
  "message": "Great article! This helped me understand...",
  "phone": "+1-555-0789",
  "postTitle": "Cloud Migration Best Practices"
}

// Response
{
  "ok": true,
  "message": "Email sent successfully",
  "data": {
    "adminEmail": true,
    "userEmail": true
  }
}
```

**POST /api/mail/send** (Generic)
```javascript
// Request
{
  "templateType": "CONTACT",
  "name": "Alex Johnson",
  "email": "alex@example.com",
  "phone": "+1-555-0101",
  "message": "Custom message content"
}

// Response
{
  "ok": true,
  "message": "Email sent successfully",
  "data": {
    "adminEmail": true,
    "userEmail": true
  }
}
```

---

### **Step 8: Main Express Server**

**`index.js`** - Complete Express server setup
```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mailRoutes = require('./src/routes/mailRoutes');

const app = express();
const PORT = process.env.PORT || 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// ==================== MIDDLEWARE ====================

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Request logging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// ==================== HEALTH CHECKS ====================

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'IntmavensApi is running',
    timestamp: new Date().toISOString()
  });
});

// API version and info endpoint
app.get('/api/version', (req, res) => {
  res.json({
    version: '1.0.0',
    service: 'IntmavensApi Email Service',
    endpoints: {
      contact: 'POST /api/mail/contact',
      career: 'POST /api/mail/career',
      blog: 'POST /api/mail/blog',
      send: 'POST /api/mail/send'
    },
    templates: ['CONTACT', 'CAREER', 'BLOG']
  });
});

// ==================== ROUTES ====================

// Mount mail routes
app.use('/api', mailRoutes);

// ==================== ERROR HANDLING ====================

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    ok: false, 
    error: 'Endpoint not found',
    path: req.path,
    method: req.method
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err.message);
  res.status(500).json({ 
    ok: false, 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ==================== SERVER STARTUP ====================

const server = app.listen(PORT, async () => {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 IntmavensApi Email Service Started');
  console.log('='.repeat(60));
  console.log(`📍 Server: http://localhost:${PORT}`);
  console.log(`🌐 Frontend: ${FRONTEND_URL}`);
  console.log(`📧 SMTP: ${process.env.SMTP_HOST}:${process.env.SMTP_PORT}`);
  console.log(`👤 Sender: ${process.env.SENDER_NAME} <${process.env.SENDER_EMAIL}>`);
  console.log(`📋 Available Endpoints:`);
  console.log(`   ✉️  POST /api/mail/contact  - Contact form`);
  console.log(`   ✉️  POST /api/mail/career   - Job application`);
  console.log(`   ✉️  POST /api/mail/blog     - Blog comment`);
  console.log(`   ✉️  POST /api/mail/send     - Generic email`);
  console.log(`🏥 Health Check: GET /health`);
  console.log(`ℹ️  API Info: GET /api/version`);
  console.log('='.repeat(60) + '\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n⚠️  SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('✅ HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n⚠️  SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('✅ HTTP server closed');
    process.exit(0);
  });
});
```

**Server Features:**
- ✅ **CORS Enabled** - Allows requests from frontend (http://localhost:5173)
- ✅ **Request Logging** - Logs all incoming requests with timestamp
- ✅ **Health Checks** - `/health` endpoint for monitoring
- ✅ **API Info** - `/api/version` shows available endpoints and templates
- ✅ **Error Handling** - 404 handler and global error middleware
- ✅ **Graceful Shutdown** - Handles SIGTERM and SIGINT signals
- ✅ **Pretty Startup Output** - Beautiful console logs showing configuration

---

## 📧 How the Dual Email System Works

The system automatically sends **two emails** for every form submission: one to admin and one to user.

### **Email Templates Available:**

| Template | Use Case | Admin Subject | User Subject |
|----------|----------|---------------|--------------|
| **CONTACT** | General inquiries | `[ADMIN] New Contact Request from {name}` | `We received your contact request` |
| **CAREER** | Job applications | `[ADMIN] New Career Application from {name}` | `Application received - {role}` |
| **BLOG** | Blog comments | `[ADMIN] New Blog Comment from {name}` | `Thanks for your comment` |

### **Example Workflow: Contact Form Submission**

**1. User submits form:**
```json
POST /api/mail/contact
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1-555-0123",
  "message": "I need information about your services"
}
```

**2. Backend validates and processes:**
- ✅ Validates all required fields
- ✅ Verifies email format
- ✅ Looks up CONTACT template
- ✅ Builds email HTML with data

**3. Admin Email Sent:**
- **To:** yourname@gmail.com (SENDER_EMAIL)
- **Subject:** `[ADMIN] New Contact Request from John Doe`
- **Reply-To:** john@example.com
- **Content:** Full form details with name, email, phone, message
- **Design:** Purple gradient template with professional layout

**4. User Confirmation Email Sent:**
- **To:** john@example.com
- **Subject:** `We received your contact request`
- **Content:** Thank you message, summary, expected response time
- **Design:** Matching template style

**5. Server response:**
```json
{
  "ok": true,
  "message": "Email sent successfully",
  "data": {
    "adminEmail": true,
    "userEmail": true
  }
}
```

### **Email Flow Diagram:**
```
┌─────────────────┐
│  User Submits   │
│ Contact/Career  │
│   Blog Form     │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  POST Request   │
│  /api/mail/*    │
└────────┬────────┘
         │
         ↓
┌─────────────────────┐
│    Validation       │
│  - Required fields  │
│  - Email format     │
└────────┬────────────┘
         │
         ↓
┌───────────────────────┐
│   Template Service    │
│  - Select template    │
│  - Build HTML email   │
└────────┬──────────────┘
         │
      ┌──┴──┐
      │     │
      ↓     ↓
  ┌────┐ ┌──────┐
  │SMTP│ │SMTP  │
  └──┬─┘ └───┬──┘
     │       │
     ↓       ↓
  ┌──────┐ ┌─────────┐
  │Admin │ │ User    │
  │Email │ │Inbox   │
  │Inbox │ │(confirm)│
  └──────┘ └─────────┘
     ↑         ↑
     │         │
  Success Response
  { ok: true, data: { adminEmail: true, userEmail: true } }
```

---

**Key Features of Dual Email System:**
- ✅ **Automatic Notifications** - Admin gets notified of new submissions
- ✅ **User Confirmation** - Users receive confirmation their message was received
- ✅ **Reply-To Setup** - Admin emails have reply-to set to user's email
- ✅ **Template-Based** - Each form type has its own professional template
- ✅ **Error Handling** - Each email tracked independently (one can fail without affecting the other)
- ✅ **Response Details** - API shows which emails were sent successfully

---



---

**`src/routes/mailRoutes.js`**
```javascript
const express = require('express');
const { handleSendMail } = require('../controllers/mailController');

const router = express.Router();

router.post('/send-mail', handleSendMail);

module.exports = router;
```

**`index.js`** (Main server file)
```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mailRoutes = require('./src/routes/mailRoutes');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'IntmavensApi is running' });
});

app.use('/api', mailRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
```

---

### **Step 9: Frontend Integration**

Update your React frontend to call the new API endpoints:

**Contact Form Example (Contact.jsx):**
```javascript
import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:4000/api/mail/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.ok) {
        alert('Message sent successfully!');
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Your Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      <input
        type="email"
        placeholder="Your Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      <input
        type="phone"
        placeholder="Your Phone"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        required
      />
      <textarea
        placeholder="Your Message"
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
```

**Career Form Example (Career.jsx):**
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  const response = await fetch('http://localhost:4000/api/mail/career', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: 'Senior Developer', // or from form
      message: formData.message,
    }),
  });

  const result = await response.json();
  if (result.ok) {
    alert('Application submitted!');
  }
};
```

**Blog Comment Example (BlogPage.jsx):**
```javascript
const handleCommentSubmit = async (e) => {
  e.preventDefault();
  
  const response = await fetch('http://localhost:4000/api/mail/blog', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: commentData.name,
      email: commentData.email,
      message: commentData.comment,
      phone: commentData.phone || undefined,
      postTitle: document.title, // or get from route
    }),
  });

  const result = await response.json();
  if (result.ok) {
    alert('Comment submitted!');
  }
};
```

**Environment Configuration for Production:**

Create `.env` in your React project:
```
VITE_API_URL=https://api.intmavens.com
```

Update API calls:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const response = await fetch(`${API_URL}/api/mail/contact`, { ... });
```

---

### **Step 10: Testing**

**1. Development Testing:**

Start the backend server:
```bash
cd IntmavensApi
npm run dev
```

Test health endpoint:
```bash
curl http://localhost:4000/health
```

Check API version:
```bash
curl http://localhost:4000/api/version
```

---

## 🧪 Complete Postman Testing Guide

### **Method 1: Using Postman Collection (Recommended)**

#### **Step 1: Create a New Postman Collection**

1. Open Postman
2. Click **"Collections"** on the left sidebar
3. Click **"+ Create Collection"**
4. Name it: `IntmavensApi Email Service`
5. Description: `Complete API testing for email service`
6. Click **Create**

#### **Step 2: Create Environment Variables**

1. Click **"Environments"** on the left sidebar
2. Click **"+"** to create a new environment
3. Name: `Local Development`
4. Add variables:

| Variable | Initial Value | Current Value |
|----------|---------------|---------------|
| `base_url` | http://localhost:4000 | http://localhost:4000 |
| `admin_email` | your-email@gmail.com | your-email@gmail.com |
| `test_email` | test@example.com | test@example.com |
| `api_version` | v1 | v1 |

5. Click **Save**
6. Select `Local Development` from environment dropdown (top right)

#### **Step 3: Add Health Check Request**

1. Right-click on collection → **Add request**
2. Name: `Health Check`
3. Method: **GET**
4. URL: `{{base_url}}/health`
5. Click **Send**
6. Expected Response:
   ```json
   {
     "status": "OK",
     "message": "IntmavensApi is running",
     "timestamp": "2025-01-15T10:30:00.000Z"
   }
   ```

#### **Step 4: Add Contact Form Request**

1. Right-click on collection → **Add request**
2. Name: `Contact Form - Success`
3. Method: **POST**
4. URL: `{{base_url}}/api/mail/contact`
5. **Headers Tab:**
   - Key: `Content-Type` | Value: `application/json`

6. **Body Tab** (select **raw** → **JSON**):
   ```json
   {
     "name": "John Doe",
     "email": "{{test_email}}",
     "phone": "+1-555-0123",
     "message": "I'm interested in your cloud migration services. Can you provide more information about your offerings?"
   }
   ```

7. **Tests Tab** (add assertions):
   ```javascript
   // Check status code
   pm.test("Status code is 200", function () {
       pm.response.to.have.status(200);
   });

   // Check response structure
   pm.test("Response has ok property", function () {
       var jsonData = pm.response.json();
       pm.expect(jsonData).to.have.property('ok');
   });

   // Check both emails sent
   pm.test("Both admin and user emails sent", function () {
       var jsonData = pm.response.json();
       pm.expect(jsonData.data.adminEmail).to.equal(true);
       pm.expect(jsonData.data.userEmail).to.equal(true);
   });

   // Check message
   pm.test("Success message present", function () {
       var jsonData = pm.response.json();
       pm.expect(jsonData.message).to.include("successfully");
   });
   ```

8. Click **Send**

#### **Step 5: Add Career Application Request**

1. Right-click on collection → **Add request**
2. Name: `Career Application`
3. Method: **POST**
4. URL: `{{base_url}}/api/mail/career`
5. **Body** (raw JSON):
   ```json
   {
     "name": "Jane Smith",
     "email": "{{test_email}}",
     "phone": "+1-555-0456",
     "role": "Senior Backend Developer",
     "message": "I am very interested in the Senior Backend Developer position. With 5+ years of Node.js experience, I believe I can contribute significantly to your team."
   }
   ```

6. **Tests Tab:**
   ```javascript
   pm.test("Status code is 200", function () {
       pm.response.to.have.status(200);
   });

   pm.test("Career application emails sent", function () {
       var jsonData = pm.response.json();
       pm.expect(jsonData.data.adminEmail).to.equal(true);
       pm.expect(jsonData.data.userEmail).to.equal(true);
   });
   ```

7. Click **Send**

#### **Step 6: Add Blog Comment Request**

1. Right-click on collection → **Add request**
2. Name: `Blog Comment`
3. Method: **POST**
4. URL: `{{base_url}}/api/mail/blog`
5. **Body** (raw JSON):
   ```json
   {
     "name": "Michael Chen",
     "email": "{{test_email}}",
     "message": "This article was incredibly helpful! The step-by-step guide on cloud migration really clarified the process for me. Keep up the great work!",
     "phone": "+1-555-0789",
     "postTitle": "Cloud Migration Best Practices 2025"
   }
   ```

6. **Tests Tab:**
   ```javascript
   pm.test("Status code is 200", function () {
       pm.response.to.have.status(200);
   });

   pm.test("Blog comment emails sent", function () {
       var jsonData = pm.response.json();
       pm.expect(jsonData.data.adminEmail).to.equal(true);
       pm.expect(jsonData.data.userEmail).to.equal(true);
   });
   ```

7. Click **Send**

#### **Step 7: Add Generic Mail Request**

1. Right-click on collection → **Add request**
2. Name: `Generic Mail (CONTACT)`
3. Method: **POST**
4. URL: `{{base_url}}/api/mail/send`
5. **Body** (raw JSON):
   ```json
   {
     "templateType": "CONTACT",
     "name": "Alex Johnson",
     "email": "{{test_email}}",
     "phone": "+1-555-0101",
     "message": "Generic email test using CONTACT template"
   }
   ```

6. Click **Send**

#### **Step 8: Add Validation Error Test**

1. Right-click on collection → **Add request**
2. Name: `Contact Form - Missing Field (Error Test)`
3. Method: **POST**
4. URL: `{{base_url}}/api/mail/contact`
5. **Body** (raw JSON) - **missing phone field**:
   ```json
   {
     "name": "Test User",
     "email": "{{test_email}}",
     "message": "This is missing the phone field"
   }
   ```

6. **Tests Tab:**
   ```javascript
   pm.test("Status code is 400", function () {
       pm.response.to.have.status(400);
   });

   pm.test("Error response for missing field", function () {
       var jsonData = pm.response.json();
       pm.expect(jsonData.ok).to.equal(false);
       pm.expect(jsonData.error).to.include("required");
   });
   ```

7. Click **Send** - Should see error response

#### **Step 9: Add Email Format Validation Test**

1. Right-click on collection → **Add request**
2. Name: `Contact Form - Invalid Email (Error Test)`
3. Method: **POST**
4. URL: `{{base_url}}/api/mail/contact`
5. **Body** (raw JSON) - **invalid email**:
   ```json
   {
     "name": "Test User",
     "email": "invalid-email-format",
     "phone": "+1-555-0123",
     "message": "This email is invalid"
   }
   ```

6. **Tests Tab:**
   ```javascript
   pm.test("Status code is 400", function () {
       pm.response.to.have.status(400);
   });

   pm.test("Email validation error", function () {
       var jsonData = pm.response.json();
       pm.expect(jsonData.ok).to.equal(false);
   });
   ```

7. Click **Send** - Should see validation error

#### **Step 10: Add API Version Request**

1. Right-click on collection → **Add request**
2. Name: `Get API Version`
3. Method: **GET**
4. URL: `{{base_url}}/api/version`
5. Click **Send**
6. Expected Response:
   ```json
   {
     "version": "1.0.0",
     "service": "IntmavensApi Email Service",
     "endpoints": {
       "contact": "POST /api/mail/contact",
       "career": "POST /api/mail/career",
       "blog": "POST /api/mail/blog",
       "send": "POST /api/mail/send"
     },
     "templates": ["CONTACT", "CAREER", "BLOG"]
   }
   ```

---

### **Method 2: Import Pre-made Collection (Postman JSON)**

Save this as `IntmavensApi-Collection.json`:

```json
{
  "info": {
    "name": "IntmavensApi Email Service",
    "description": "Complete API testing collection for IntmavensApi",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Health & Info",
      "item": [
        {
          "name": "Health Check",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/health"
          }
        },
        {
          "name": "API Version",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/api/version"
          }
        }
      ]
    },
    {
      "name": "Email Endpoints",
      "item": [
        {
          "name": "Contact Form",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/api/mail/contact",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\"name\": \"John Doe\", \"email\": \"{{test_email}}\", \"phone\": \"+1-555-0123\", \"message\": \"Test message\"}"
            }
          }
        },
        {
          "name": "Career Application",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/api/mail/career",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\"name\": \"Jane Smith\", \"email\": \"{{test_email}}\", \"phone\": \"+1-555-0456\", \"role\": \"Senior Developer\", \"message\": \"Interested in role\"}"
            }
          }
        },
        {
          "name": "Blog Comment",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/api/mail/blog",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\"name\": \"Michael Chen\", \"email\": \"{{test_email}}\", \"message\": \"Great article!\", \"postTitle\": \"Cloud Migration\"}"
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:4000"
    },
    {
      "key": "test_email",
      "value": "test@example.com"
    }
  ]
}
```

**To Import:**
1. Click **Import** button in Postman
2. Choose **Paste Raw Text**
3. Paste the JSON above
4. Click **Import**

---

### **Method 3: Quick Testing Checklist**

Use this checklist to test all endpoints systematically:

#### **Pre-Testing Setup**
- [ ] Backend running: `npm run dev`
- [ ] Postman open with environment set to `Local Development`
- [ ] Gmail inbox ready to receive test emails
- [ ] `.env` file has valid SMTP credentials

#### **Basic Functionality Tests**
- [ ] **Health Check** - GET `/health` → Status 200
- [ ] **API Version** - GET `/api/version` → Shows all endpoints
- [ ] **Contact Form** - POST `/api/mail/contact` → Both emails sent
- [ ] **Career Form** - POST `/api/mail/career` → Both emails sent
- [ ] **Blog Comment** - POST `/api/mail/blog` → Both emails sent
- [ ] **Generic Mail** - POST `/api/mail/send` → Works with any template

#### **Validation Tests**
- [ ] **Missing Name** - POST with empty name → Error 400
- [ ] **Missing Email** - POST with empty email → Error 400
- [ ] **Invalid Email** - POST with invalid format → Error 400
- [ ] **Missing Phone** - POST without phone → Error 400
- [ ] **Invalid Template Type** - POST with wrong templateType → Error 400

#### **Email Delivery Tests**
- [ ] Admin email received in inbox ✅
- [ ] User confirmation email received ✅
- [ ] Email subject contains correct format
- [ ] Email body has form data
- [ ] Email styling looks professional

#### **Edge Cases**
- [ ] Very long message (500+ chars) → Sends successfully
- [ ] Special characters in name (é, ñ, etc.) → Sends successfully
- [ ] Multiple spaces in message → Sends successfully
- [ ] Phone with different formats (+1-555, +1 555, etc.) → Accepts all

---

### **Method 4: Using cURL (Terminal)**

```bash
# Test Contact Form
curl -X POST http://localhost:4000/api/mail/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "test@example.com",
    "phone": "+1-555-0123",
    "message": "Test message"
  }'

# Test Career Form
curl -X POST http://localhost:4000/api/mail/career \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "test@example.com",
    "phone": "+1-555-0456",
    "role": "Senior Developer",
    "message": "Interested in role"
  }'

# Test Blog Comment
curl -X POST http://localhost:4000/api/mail/blog \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Michael Chen",
    "email": "test@example.com",
    "message": "Great article!",
    "postTitle": "Cloud Migration"
  }'

# Health Check
curl http://localhost:4000/health

# API Version
curl http://localhost:4000/api/version
```

---

### **Method 5: Testing with Thunder Client (VS Code Extension)**

1. Install **Thunder Client** extension in VS Code
2. Click Thunder Client icon in left sidebar
3. Create new request:
   - **Method:** POST
   - **URL:** `http://localhost:4000/api/mail/contact`
4. **Body Tab** (select JSON):
   ```json
   {
     "name": "Test User",
     "email": "test@example.com",
     "phone": "+1-555-0123",
     "message": "Test message"
   }
   ```
5. Click **Send**

---

### **Common Response Scenarios**

#### **Success Response (Both emails sent)**
```json
{
  "ok": true,
  "message": "Email sent successfully",
  "data": {
    "adminEmail": true,
    "userEmail": true
  }
}
```
Status Code: **200**

#### **Validation Error (Missing field)**
```json
{
  "ok": false,
  "error": "Missing required field: phone"
}
```
Status Code: **400**

#### **Email Format Error**
```json
{
  "ok": false,
  "error": "Invalid email format"
}
```
Status Code: **400**

#### **Server Error (SMTP failure)**
```json
{
  "ok": false,
  "error": "Failed to send email. Please check server logs."
}
```
Status Code: **500**

#### **Partial Success (One email failed)**
```json
{
  "ok": true,
  "message": "Email sending completed",
  "data": {
    "adminEmail": true,
    "userEmail": false
  }
}
```
Status Code: **200**

---

**2. Testing with cURL:**

```bash
# Test Contact endpoint
curl -X POST http://localhost:4000/api/mail/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1-555-0123",
    "message": "Test message"
  }'

# Test Career endpoint
curl -X POST http://localhost:4000/api/mail/career \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "+1-555-0456",
    "role": "Senior Developer",
    "message": "Interested in role"
  }'

# Test Blog endpoint
curl -X POST http://localhost:4000/api/mail/blog \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Michael Chen",
    "email": "michael@example.com",
    "message": "Great article!",
    "postTitle": "Cloud Migration"
  }'
```

**3. Testing with Postman/Insomnia:**

1. Create new POST request
2. Set URL to `http://localhost:4000/api/mail/contact`
3. Set body to JSON:
   ```json
   {
     "name": "Test User",
     "email": "test@example.com",
     "phone": "+1-555-0123",
     "message": "Test message"
   }
   ```
4. Send and check:
   - Response shows `"ok": true`
   - Both `adminEmail` and `userEmail` are `true`
   - Check email inbox for received emails

**4. Testing from React Frontend:**

1. Run React app: `npm run dev`
2. Fill out contact form
3. Click submit
4. Check:
   - Success/error message appears
   - Browser console for errors
   - Server console shows request logs
   - Email inbox for received emails

**5. Troubleshooting:**

If emails don't send:
```bash
# 1. Check .env file has all variables
cat .env

# 2. Check SMTP connection
node -e "require('./src/config/mailConfig').transporter.verify((err, success) => { console.log(err || success ? '✅ Connected' : '❌ Not connected'); })"

# 3. Check server logs
npm run dev

# 4. Verify Gmail App Password
# - Go to Google Account → Security
# - Confirm 2-Step Verification is enabled
# - Generate new App Password for Mail
# - Update SMTP_PASS in .env

# 5. Allow less secure apps (if not using App Password)
# - Go to myaccount.google.com/lesssecureapps
```

---

## 📋 API Reference

### **Base URL**
- Development: `http://localhost:4000`
- Production: `https://your-domain.com`

### **Available Endpoints**

#### **1. POST /api/mail/contact**
Send a contact form email

**Request:**
```json
{
  "name": "string (required)",
  "email": "string (required, email format)",
  "phone": "string (required)",
  "message": "string (required)"
}
```

**Response:**
```json
{
  "ok": true,
  "message": "Email sent successfully",
  "data": {
    "adminEmail": true,
    "userEmail": true
  }
}
```

---

#### **2. POST /api/mail/career**
Send a job application email

**Request:**
```json
{
  "name": "string (required)",
  "email": "string (required, email format)",
  "phone": "string (required)",
  "role": "string (optional)",
  "message": "string (optional)"
}
```

**Response:**
```json
{
  "ok": true,
  "message": "Email sent successfully",
  "data": {
    "adminEmail": true,
    "userEmail": true
  }
}
```

---

#### **3. POST /api/mail/blog**
Send a blog comment email

**Request:**
```json
{
  "name": "string (required)",
  "email": "string (required, email format)",
  "message": "string (required)",
  "phone": "string (optional)",
  "postTitle": "string (optional)"
}
```

**Response:**
```json
{
  "ok": true,
  "message": "Email sent successfully",
  "data": {
    "adminEmail": true,
    "userEmail": true
  }
}
```

---

#### **4. POST /api/mail/send** (Generic)
Send email with custom template type

**Request:**
```json
{
  "templateType": "CONTACT|CAREER|BLOG (required)",
  "name": "string (required)",
  "email": "string (required, email format)",
  "message": "string (required)",
  "phone": "string (optional)",
  "role": "string (optional)",
  "postTitle": "string (optional)"
}
```

**Response:**
```json
{
  "ok": true,
  "message": "Email sent successfully",
  "data": {
    "adminEmail": true,
    "userEmail": true
  }
}
```

---

#### **5. GET /health**
Health check endpoint

**Response:**
```json
{
  "status": "OK",
  "message": "IntmavensApi is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

#### **6. GET /api/version**
Get API version and available endpoints

**Response:**
```json
{
  "version": "1.0.0",
  "service": "IntmavensApi Email Service",
  "endpoints": {
    "contact": "POST /api/mail/contact",
    "career": "POST /api/mail/career",
    "blog": "POST /api/mail/blog",
    "send": "POST /api/mail/send"
  },
  "templates": ["CONTACT", "CAREER", "BLOG"]
}
```

---

## 🚀 Deployment

### **Production Deployment Steps**

**1. Environment Variables:**
```bash
# Set in production environment
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
SENDER_EMAIL=noreply@intmavens.com
SENDER_NAME=Intmavens Team
FRONTEND_URL=https://intmavens.com
PORT=4000
NODE_ENV=production
```

**2. Install Production Dependencies:**
```bash
npm install --production
```

**3. Build and Start:**
```bash
npm start
```

**4. Use a Process Manager (PM2 recommended):**
```bash
npm install -g pm2

# Start with PM2
pm2 start index.js --name "intmavens-api"

# Save PM2 configuration
pm2 save

# Enable startup on reboot
pm2 startup
```

**5. Setup Reverse Proxy (Nginx):**
```nginx
server {
    listen 80;
    server_name api.intmavens.com;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**6. Enable HTTPS (Let's Encrypt):**
```bash
sudo certbot --nginx -d api.intmavens.com
```

---



### Debugging Checklist

- ✅ Check `.env` file exists and has correct values
- ✅ Verify SMTP credentials are valid
- ✅ Check firewall/network allows SMTP port (587/465)
- ✅ Review server console logs for errors
- ✅ Test with Mailtrap first (easier to debug)
- ✅ Ensure CORS allows your frontend origin

---

## 🚀 Deployment

### Pre-deployment Checklist

- ✅ All dependencies in `package.json`
- ✅ `.gitignore` includes `.env` and `node_modules`
- ✅ Environment variables documented
- ✅ Health check endpoint working
- ✅ Error handling implemented
- ✅ Logging configured

### Deployment Options

**Option 1: Azure App Service**
```bash
# Install Azure CLI
az login
az webapp up --name intmavens-api --resource-group intmavens-rg
```

**Option 2: Render**
1. Connect GitHub repo
2. Select "Web Service"
3. Set environment variables in dashboard
4. Deploy automatically

**Option 3: Railway**
1. Connect GitHub repo
2. Add environment variables
3. Deploy with one click

**Option 4: VPS (Linux)**
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone and setup
git clone <repo-url>
cd IntmavensApi
npm install
npm install -g pm2

# Setup environment
nano .env  # Add production variables

# Start with PM2
pm2 start index.js --name intmavens-api
pm2 save
pm2 startup
```

### Environment Variables (Production)

Set these in your hosting platform:

```env
NODE_ENV=production
PORT=4000
SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASS=your-smtp-password
SENDER_EMAIL=noreply@intmavens.com
SENDER_NAME=Intmavens Support
ADMIN_EMAIL=admin@intmavens.com
REPLY_TO=support@intmavens.com
FRONTEND_URL=https://intmavens.com
```

### Post-deployment Steps

1. ✅ Update React app's API URL to production backend
2. ✅ Restrict CORS to your domain only
3. ✅ Test all email templates in production
4. ✅ Monitor server logs for errors
5. ✅ Set up SSL/HTTPS for backend

---

## 🔐 Production Enhancements

### Optional Improvements

**1. Rate Limiting**
```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const mailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many requests, please try again later',
});

app.use('/api/send-mail', mailLimiter);
```

**2. Request Validation**
```bash
npm install joi
```

**3. Database Logging**
Save email records to MongoDB/PostgreSQL for audit trail.

**4. Anti-spam Measures**
- Add honeypot field in form
- Implement reCAPTCHA
- Use Akismet API for spam detection

**5. Email Queue**
For high volume, use Bull/BullMQ with Redis:
```bash
npm install bull redis
```

---

## 📞 API Reference

### Endpoints

#### `GET /health`
Health check endpoint.

**Response:**
```json
{
  "status": "OK",
  "message": "IntmavensApi is running"
}
```

#### `POST /api/send-mail`
Send an email using a template.

**Request Body:**
```json
{
---

## 📚 Available Email Templates

| Template | Purpose | Admin Subject | User Subject | Required Fields | Optional Fields |
|----------|---------|---------------|---------------|-----------------|-----------------|
| **CONTACT** | General contact inquiries | `[ADMIN] New Contact Request from {name}` | `We received your contact request` | name, email, phone, message | — |
| **CAREER** | Job applications | `[ADMIN] New Career Application from {name}` | `Application received - {role}` | name, email, phone | role, message |
| **BLOG** | Blog comments | `[ADMIN] New Blog Comment from {name}` | `Thanks for your comment` | name, email, message | phone, postTitle |

Each template features:
- ✅ Professional HTML design with gradient backgrounds
- ✅ Mobile-responsive layout
- ✅ Branding colors (Contact: Purple, Career: Red, Blog: Blue)
- ✅ Clear call-to-action buttons
- ✅ Contact information display

---

## 🆘 Troubleshooting

### Common Issues and Solutions

**Issue: "Nodemailer connection error" or "Cannot connect to SMTP"**

**Solution:**
1. Verify `.env` file exists in IntmavensApi root directory
2. Check all SMTP variables are set:
   ```bash
   cat .env | grep SMTP
   ```
3. Test SMTP connection:
   ```bash
   node -e "
     require('dotenv').config();
     const nodemailer = require('nodemailer');
     const transporter = nodemailer.createTransport({
       host: process.env.SMTP_HOST,
       port: process.env.SMTP_PORT,
       secure: process.env.SMTP_PORT == 465,
       auth: {
         user: process.env.SMTP_USER,
         pass: process.env.SMTP_PASS
       }
     });
     transporter.verify((err, success) => {
       if (err) console.log('❌ Error:', err.message);
       else console.log('✅ SMTP Connected Successfully');
     });
   "
   ```

---

**Issue: "Gmail SMTP failed" or "535 Authentication failed"**

**Solution:** Gmail requires an App Password, NOT your regular password:
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Step Verification (if not already enabled)
3. Search for "App passwords" in Security settings
4. Select "Mail" and "Windows Computer"
5. Copy the generated 16-character password
6. Update `.env`:
   ```
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=xxxx xxxx xxxx xxxx
   ```
7. Restart server: `npm run dev`

---

**Issue: "CORS error" - emails work in Postman but not from frontend**

**Solution:**
1. Check `FRONTEND_URL` in `.env`:
   ```
   FRONTEND_URL=http://localhost:5173
   ```
2. Verify frontend is running on that URL
3. Clear browser cache and cookies
4. Check browser console for specific CORS error
5. Make sure backend is allowing that origin

---

**Issue: "Email sent but not received in inbox"**

**Solutions:**
1. Check email spam/junk folder
2. Verify recipient email is correct
3. Check Gmail settings → Forwarding and POP/IMAP
4. For Gmail accounts, ensure IMAP is enabled
5. Try sending to a different email provider first
6. Check server logs for errors:
   ```bash
   npm run dev  # Shows detailed logs
   ```

---

**Issue: "Port 4000 already in use"**

**Solution:**
```bash
# Find process using port 4000
netstat -ano | findstr :4000

# Kill the process (Windows)
taskkill /PID <PID> /F

# Or use different port
PORT=5000 npm run dev
```

---

**Issue: "Form fields not mapping to email template"**

**Solution:**
1. Check form field names match expected parameters:
   - Contact: `name`, `email`, `phone`, `message`
   - Career: `name`, `email`, `phone`, `role` (optional), `message` (optional)
   - Blog: `name`, `email`, `message`, `phone` (optional), `postTitle` (optional)
2. Verify template type is correct
3. Check server logs for validation errors
4. Send test request with cURL to isolate frontend issues

---

**Issue: "Only admin email sent, user confirmation failed" (or vice versa)**

**Solution:**
This is normal behavior! Each email is sent independently. Check:
1. Response shows `"adminEmail": false` or `"userEmail": false`
2. Verify both email addresses are correct
3. One email might be blocked by spam filter
4. Check sender reputation with email provider
5. Consider using email service like SendGrid for better deliverability

---

# 📸 Step-by-Step Postman Testing Instructions

## Setup Phase (Do this once)

### Step 1: Download & Install Postman
```
1. Go to: https://www.postman.com/downloads/
2. Choose your OS (Windows/Mac/Linux)
3. Download and install
4. Launch Postman
5. Create a free account or skip login
```

### Step 2: Start the Backend Server
```bash
# Open terminal/command prompt
cd D:\vs-code\Nick-dev\IntmavensApi

# Start development server
npm run dev

# You should see:
# 🚀 IntmavensApi Email Service Started
# 📍 Server: http://localhost:4000
# 📧 SMTP: smtp.gmail.com:587
```

**Keep this terminal open while testing!**

---

### Step 3: Import Postman Collection

**Option A: Using JSON File (Recommended)**

1. Open Postman
2. Click **Import** button (top-left corner)
3. Choose **File** tab
4. Click **Select Files**
5. Navigate to: `D:\vs-code\Nick-dev\IntmavensApi\`
6. Select: `IntmavensApi-Postman-Collection.json`
7. Click **Import**
8. You should see collection appears in left sidebar with all requests organized

**Option B: Manual Creation**

If import doesn't work, create requests manually (see detailed instructions below)

---

### Step 4: Create Environment Variables

1. In Postman, look at **top-right corner** for **Manage Environments** icon (gear icon)
2. Click **Manage Environments**
3. Click **Create Environment**
4. Fill in details:
   - **Environment Name:** `Local Development`
   - **Variable:** `base_url` = `http://localhost:4000`
   - **Variable:** `test_email` = `test@example.com`
5. Click **Save**
6. Close the modal
7. In the top-right, select `Local Development` from dropdown

**Now you're ready to test!**

---

## Testing Phase

### Test 1: Health Check (Verify Server Running)

**Location in Postman:**
```
IntmavensApi Email Service
  ├─ Health & Info
      ├─ Health Check  ← Click here
```

**Steps:**
1. Click **Health Check** in left sidebar
2. Verify **GET** is selected (method)
3. Verify URL shows: `{{base_url}}/health`
4. Click blue **Send** button (right side)
5. Wait for response

**Expected Result:**
```
Status: 200 OK

Response:
{
  "status": "OK",
  "message": "IntmavensApi is running",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

✅ If you see this, your server is ready!

---

### Test 2: Contact Form Email

**Location in Postman:**
```
IntmavensApi Email Service
  ├─ Email Endpoints - Success Cases
      ├─ Contact Form - Valid Request  ← Click here
```

**Steps:**
1. Click **Contact Form - Valid Request**
2. Verify method is **POST**
3. Verify URL: `{{base_url}}/api/mail/contact`
4. Check **Body** tab shows JSON:
   ```json
   {
     "name": "John Doe",
     "email": "{{test_email}}",
     "phone": "+1-555-0123",
     "message": "Test message..."
   }
   ```
5. Click **Send** button
6. Look at response below

**Expected Result:**
```
Status: 200 OK

Response:
{
  "ok": true,
  "message": "Email sent successfully",
  "data": {
    "adminEmail": true,
    "userEmail": true
  }
}
```

✅ **Check Your Email!**
- Open your Gmail inbox
- You should see 2 emails:
  1. **Admin Email** (from IntmavensApi) - Subject: `[ADMIN] New Contact Request from John Doe`
  2. **User Confirmation** - Subject: `We received your contact request`

---

### Test 3: Career Application Email

**Location in Postman:**
```
IntmavensApi Email Service
  ├─ Email Endpoints - Success Cases
      ├─ Career Application - Valid Request  ← Click here
```

**Steps:**
1. Click **Career Application - Valid Request**
2. Verify method is **POST**
3. Click **Send**
4. Check response

**Expected Result:**
```
Status: 200 OK
Data: {
  "adminEmail": true,
  "userEmail": true
}
```

✅ **Check Your Email!**
- You should see 2 new emails
- Admin receives job application details
- User gets confirmation email

---

### Test 4: Blog Comment Email

**Location in Postman:**
```
IntmavensApi Email Service
  ├─ Email Endpoints - Success Cases
      ├─ Blog Comment - Valid Request  ← Click here
```

**Steps:**
1. Click **Blog Comment - Valid Request**
2. Click **Send**
3. Check response status 200 OK
4. Verify both emails: `adminEmail: true`, `userEmail: true`

✅ **Check Your Email!**
- Look for blog comment notification emails

---

### Test 5: Generic Email Endpoint

**Location in Postman:**
```
IntmavensApi Email Service
  ├─ Email Endpoints - Success Cases
      ├─ Generic Mail - CONTACT Template  ← Click here
```

**Steps:**
1. Click **Generic Mail - CONTACT Template**
2. Look at **Body** to see different format:
   ```json
   {
     "templateType": "CONTACT",
     "name": "Alex Johnson",
     "email": "{{test_email}}",
     "phone": "+1-555-0101",
     "message": "Generic email test using CONTACT template"
   }
   ```
3. Click **Send**

✅ Works just like the specific endpoints!

---

### Test 6: Error Testing - Missing Field

**Location in Postman:**
```
IntmavensApi Email Service
  ├─ Email Endpoints - Error Cases
      ├─ Contact - Missing Phone (Validation Error)  ← Click here
```

**Steps:**
1. Click **Contact - Missing Phone (Validation Error)**
2. Look at Body - notice `phone` field is missing
3. Click **Send**
4. Look at response

**Expected Result:**
```
Status: 400 Bad Request

Response:
{
  "ok": false,
  "error": "Missing required field: phone"
}
```

⚠️ **Important:** No emails should be sent for this test!

---

### Test 7: Error Testing - Invalid Email Format

**Location in Postman:**
```
IntmavensApi Email Service
  ├─ Email Endpoints - Error Cases
      ├─ Contact - Invalid Email Format  ← Click here
```

**Steps:**
1. Click **Contact - Invalid Email Format**
2. Look at Body - email is `"invalid-email-format"`
3. Click **Send**

**Expected Result:**
```
Status: 400 Bad Request

Response:
{
  "ok": false,
  "error": "Invalid email format"
}
```

⚠️ **No emails sent** - Request blocked by validation

---

### Test 8: Error Testing - Invalid Template Type

**Location in Postman:**
```
IntmavensApi Email Service
  ├─ Email Endpoints - Error Cases
      ├─ Generic Mail - Invalid Template Type  ← Click here
```

**Steps:**
1. Click **Generic Mail - Invalid Template Type**
2. Look at Body - `templateType: "INVALID_TYPE"`
3. Click **Send**

**Expected Result:**
```
Status: 400 Bad Request

Response:
{
  "ok": false,
  "error": "Invalid template type"
}
```

---

## Manual Request Creation (If Needed)

If you can't import the collection, create requests manually:

### Create Contact Request Manually

1. In Postman, click **+** tab at top
2. **Method:** Change to **POST** (click dropdown)
3. **URL:** Type `http://localhost:4000/api/mail/contact`
4. Click **Body** tab
5. Select **raw**
6. Change type to **JSON** (dropdown on right)
7. Paste this:
   ```json
   {
     "name": "John Doe",
     "email": "test@example.com",
     "phone": "+1-555-0123",
     "message": "Test message from contact form"
   }
   ```
8. Click **Send**
9. You should get status 200 with `"ok": true`

**Repeat for other endpoints:**
- Change URL to `/api/mail/career` for career form
- Change URL to `/api/mail/blog` for blog comment
- Adjust JSON body for different endpoints

---

## Complete Testing Checklist

Print this and check off each test as you complete it:

### Health & Setup
- [ ] Server is running (`npm run dev` shows startup message)
- [ ] Postman is open and loaded
- [ ] Environment variables set (base_url, test_email)
- [ ] Health Check request returns 200 OK

### Success Cases (Should all return 200 with both emails true)
- [ ] Contact Form sends successfully
- [ ] Career Application sends successfully
- [ ] Blog Comment sends successfully
- [ ] Generic Mail (CONTACT) sends successfully
- [ ] Check inbox for 4+ emails (2 per contact test)

### Validation Tests (Should all return 400 errors)
- [ ] Missing Phone returns error
- [ ] Invalid Email returns error
- [ ] Invalid Template Type returns error
- [ ] Verify NO emails sent for error cases

### Email Verification
- [ ] Admin emails have `[ADMIN]` prefix in subject
- [ ] User emails have appropriate subject
- [ ] Email bodies contain form data
- [ ] Emails are properly formatted (not plain text)

### Server Stability
- [ ] Server doesn't crash after tests
- [ ] Multiple requests work in sequence
- [ ] Error responses don't break server

---

## Troubleshooting During Testing

### "Cannot GET /health"
**Problem:** Server not running
**Solution:** 
```bash
cd IntmavensApi
npm run dev
```

### "Connection refused" on request
**Problem:** Backend not accessible
**Solution:**
- Make sure `base_url` environment variable is `http://localhost:4000`
- Make sure port 4000 is not used by another app

### Response shows "Missing required field"
**Problem:** Request body incomplete
**Solution:**
- Make sure all required fields are in JSON body
- Contact: needs name, email, phone, message
- Career: needs name, email, phone (role & message optional)
- Blog: needs name, email, message (phone & postTitle optional)

### No emails received
**Problem:** SMTP configuration or credentials issue
**Solution:**
1. Check `.env` file has valid Gmail credentials
2. Run SMTP test:
   ```bash
   node -e "require('./src/config/mailConfig').transporter.verify((err, success) => { console.log(err || 'SMTP OK'); })"
   ```
3. Check response shows `adminEmail: true` AND `userEmail: true`
4. Check spam/junk folders
5. Verify test email address is correct

### Email sending shows only partial success
**Example:** `adminEmail: true`, `userEmail: false`
**Problem:** One recipient email might be blocked
**Solution:**
- Verify recipient email is correct
- Check if that email provider is blocking emails
- Try different email address
- Check server logs for detailed error

### Status 500 error
**Problem:** Server error
**Solution:**
1. Check server terminal for error message
2. Restart server: `npm run dev`
3. Verify SMTP connection works
4. Check `.env` has all required variables

---

## Next Steps After Testing

Once all tests pass:

1. ✅ Update frontend to use actual API URLs
2. ✅ Test from React forms (contact, career, blog)
3. ✅ Deploy backend to production
4. ✅ Update production API URLs in frontend `.env`
5. ✅ Run full end-to-end testing

---

## Tips for Success

1. **Always start with Health Check** - confirms server is up
2. **Check all 3 email templates** - contact, career, blog each have different styling
3. **Look for BOTH emails** - admin email AND user confirmation
4. **Check spam folder** - emails might go there
5. **Review error responses** - helpful for debugging
6. **Keep server logs visible** - shows detailed errors if something fails
7. **Test error cases** - ensures validation is working
8. **Use realistic test data** - helps spot issues with formatting

---

**You're all set! Start with Test 1 (Health Check) and work your way through. 🚀**

---

**Developed by Intmavens Team** 🚀

**Last Updated:** January 2025  
**Version:** 1.0.0

