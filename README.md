# EventSphere 🎓✨

EventSphere is a premium, modern, full-stack MERN (MongoDB, Express, React, Node.js) application built to seamlessly manage college events. It offers a stunning user interface featuring an Emerald & Teal color palette, sleek dark mode, and smooth micro-animations using Framer Motion. 

EventSphere simplifies the entire lifecycle of an event from creation and registration to QR code ticketing, check-in, and automated certificate generation.

---

## 🚀 Key Features

### 👤 Role-Based Access Control
- **Admin**: Create and manage events, review and approve student registrations, scan QR tickets to check-in attendees, and track event metrics.
- **Student**: Browse events, request registration, view and download PDF tickets, and download achievement certificates after attending.

### 📅 Comprehensive Event Management
- Admins can create events with details like category, venue, date, time, and capacity.
- Beautiful event listing cards with category badges and status indicators.
- Event deletion and status toggling (Draft vs Published).

### 🎟️ Smart Registration & Ticketing
- Students apply for events. Admins review pending applications and approve or reject them.
- Upon approval, a **Custom PDF Ticket** is dynamically generated using PDFKit.
- The ticket features a premium dark/light "tear-away" stub design, complete with an embedded **QR Code** for scanning.

### 📲 QR Code Check-in System
- Admins have access to a built-in QR Code scanner (via device camera) to verify tickets at the venue.
- Scanning a valid ticket automatically marks the student as "Checked In".

### 🎓 Automated Certificate Generation
- The moment a student is checked in via the QR scanner, the system dynamically draws and generates an elegant **Certificate of Achievement** PDF.
- The certificate features a custom maroon/gold theme with vector shapes, borders, and signature lines.
- Students can instantly download their certificate from their dashboard.

### 🤖 AI-Powered Recommendations
- Integrates with Google's **Gemini AI**.
- Analyzes a student's past registrations and bookmarks to recommend the most relevant upcoming events.

---

## 🛠️ Technology Stack

**Frontend:**
- React (Vite)
- Tailwind CSS (for modern, responsive styling)
- Framer Motion (for smooth entrance, hover, and staging animations)
- Redux Toolkit (for state management)
- Lucide React (for beautiful SVG icons)

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- JSON Web Tokens (JWT) for secure authentication
- PDFKit (for dynamic, complex PDF generation of tickets and certificates)
- node-qrcode (for generating QR codes)
- Google Generative AI SDK (Gemini)

---

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Amansharmacs1/EventSphere.git
   cd EventSphere
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   ```
   - Create a `.env` file in the `server` directory.
   - Add your environment variables:
     ```env
     PORT=5000
     NODE_ENV=development
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     GEMINI_API_KEY=your_google_gemini_api_key
     ```
   - Run the development server: `npm run dev`

3. **Setup Frontend**
   ```bash
   cd ../client
   npm install
   ```
   - Run the Vite development server: `npm run dev`

4. **Open Application**
   - Navigate to `http://localhost:5173` in your browser.

---

## 📸 Workflows at a Glance

1. **Discover**: Students view the AI-recommended events.
2. **Register**: Students click "Apply" on an event.
3. **Approve**: Admin goes to the dashboard and approves the registration.
4. **Ticket**: The student downloads their premium PDF ticket featuring a unique QR code.
5. **Check-in**: At the venue, the admin uses the built-in scanner to scan the student's QR code.
6. **Reward**: The student immediately receives a beautiful PDF Certificate of Achievement in their dashboard.

---

*Built with passion to elevate the student event experience.*
