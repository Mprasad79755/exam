# SkillUp Exam Module

A comprehensive React-based examination platform with integrity monitoring, Firebase integration, and PDF certificate generation.

## Features

- 🔐 **Exam Integrity**: Fullscreen enforcement, tab-switch detection, copy/paste prevention
- ⏱️ **Timer Management**: Real-time countdown with auto-submission
- 🔥 **Firebase Integration**: Firestore for secure, write-once submissions
- 📄 **PDF Certificates**: Automatic generation with branding and verification
- 📱 **Mobile-First Design**: Responsive UI with Tailwind CSS
- 🎯 **Question Types**: Multiple choice, true/false, and text responses
- ⚠️ **Warning System**: Progressive warnings with disqualification rules
- 🎨 **Modern UI**: Framer Motion animations and toast notifications

## Quick Start

### 1. Installation

```bash
npm install
npm run dev
```

### 2. Configure Firebase

Update `src/utils/firebase.js` with your Firebase configuration:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

### 3. Set Up Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /skillup_submissions/{docId} {
      allow read: if true;
      allow create: if request.auth == null
                    && request.resource.data.uid is string
                    && request.resource.data.recordId is string
                    && request.resource.data.submittedAt == request.time;
      allow update, delete: if false; // no edits allowed
    }
  }
}
```

**Important**: For production, implement server-side UID uniqueness checks using Cloud Functions to prevent race conditions.

### 4. Configure Exam Settings

Edit `public/questions.json` to customize:

```json
{
  "meta": {
    "title": "Your Exam Title",
    "durationMinutes": 60,
    "startAt": "2025-01-15T09:00:00+05:30",
    "endAt": "2025-01-15T18:00:00+05:30"
  },
  "questions": [...]
}
```

### 5. Testing

For testing purposes, the app automatically generates a demo UID. In production:

```javascript
// Set UID before launching exam
localStorage.setItem('skillup_exam_uid', 'student_unique_id');
```

## Architecture

### State Management
- **ExamContext**: Centralized state with useReducer
- **Custom Hooks**: Modular logic for timer, warnings, and security

### Security Features
- **Fullscreen Enforcement**: Automatic entry and exit detection
- **Tab Switch Detection**: Page visibility API monitoring
- **Copy/Paste Prevention**: Event blocking and CSS user-select
- **DevTools Detection**: Heuristic-based (not foolproof)
- **Warning System**: Progressive alerts with auto-submission

### Component Structure
```
src/
├── components/           # Reusable UI components
├── contexts/            # React Context providers
├── hooks/               # Custom React hooks
├── pages/               # Page components
├── utils/               # Utility functions
└── App.jsx             # Main application
```

## Question Types

### Multiple Choice (MCQ)
```json
{
  "id": "q1",
  "type": "mcq",
  "question": "Question text here?",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "marks": 1
}
```

### True/False
```json
{
  "id": "q2",
  "type": "truefalse", 
  "question": "Statement to evaluate.",
  "marks": 1
}
```

### Text Response
```json
{
  "id": "q3",
  "type": "text",
  "question": "Essay question here.",
  "maxLength": 500,
  "marks": 3
}
```

## Security Considerations

### Client-Side Limitations
⚠️ **Important**: Client-side security cannot be 100% foolproof. Advanced users can potentially:
- Bypass DevTools detection
- Circumvent copy/paste restrictions
- Manipulate client-side code

### Production Recommendations
1. **Authentication**: Implement proper user authentication instead of localStorage UIDs
2. **Server Validation**: Use Cloud Functions for submission validation
3. **Proctoring**: Consider webcam monitoring for high-stakes exams
4. **Time Validation**: Server-side timestamp verification
5. **IP Tracking**: Log submission IP addresses

### Firestore Write-Once Implementation
The current client-side check for existing submissions has race condition vulnerabilities. Implement server-side validation:

```javascript
// Cloud Function example
exports.submitExam = functions.https.onCall(async (data, context) => {
  // Verify authentication
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated');
  }

  // Check for existing submission
  const existing = await admin.firestore()
    .collection('skillup_submissions')
    .where('uid', '==', context.auth.uid)
    .get();

  if (!existing.empty) {
    throw new functions.https.HttpsError('already-exists', 'Exam already submitted');
  }

  // Create submission
  return admin.firestore().collection('skillup_submissions').add({
    uid: context.auth.uid,
    ...data,
    submittedAt: admin.firestore.FieldValue.serverTimestamp()
  });
});
```

## PDF Certificate

Generated certificates include:
- Diplomax Academy branding
- Student UID and Record ID
- Completion status and timestamp
- Watermark and decorative borders
- Contact information for verification

## Monitoring Events

The system tracks and responds to:
- **visibilitychange**: Tab switching/window focus
- **blur/focus**: Window focus changes
- **fullscreenchange**: Fullscreen exit
- **beforeunload**: Page refresh attempts
- **DevTools**: Window size heuristics

## Customization

### Styling
- Modify Tailwind classes in components
- Update color system in `tailwind.config.js`
- Customize animations in Framer Motion components

### Exam Rules
- Edit text in `RulesAgreementModal.jsx`
- Adjust warning thresholds in `ExamContext.jsx`
- Modify PDF layout in `PDFGenerator.jsx`

### Timing
- Change exam duration in `questions.json`
- Adjust warning display times in components
- Customize countdown formats in `useExamTimer.js`

## Deployment

1. Build the application:
```bash
npm run build
```

2. Deploy to your preferred platform (Vercel, Netlify, etc.)
3. Configure Firebase for production
4. Set up proper domain and HTTPS
5. Test exam flow thoroughly

## Support

For technical issues or customization requests, contact:
- Email: admin@diplomax.academy
- Documentation: Check component JSDoc comments
- Firebase Console: Monitor submissions and errors

## License

This project is proprietary to Diplomax Academy. Unauthorized distribution or modification is prohibited.