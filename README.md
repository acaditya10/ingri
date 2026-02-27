# Ingri Restaurant Reservation System

Ingri is a complete, modern restaurant reservation system featuring beautiful styling, an intuitive customer booking flow, and a powerful premium admin dashboard. The application is built using Next.js (App Router), Firebase (Firestore), and Tailwind CSS v4.

## 🚀 Features

- **Customer Reservation Flow**: A seamless booking process with an intuitive interface and responsive design.
- **Premium Admin Dashboard**: Manage table reservations quickly using a slide-out drawer interface and monitor key actions via toast notifications.
- **Restaurant Menu Management**: Admin functionality to upload and manage menu images (Securely encoded via Base64 and stored in Firestore).
- **Automated Email Notifications**: Integration with Resend and React Email to automatically send confirmation emails to customers.
- **Modern UI & Animations**: Smooth animations with Framer Motion and an aesthetic design powered by standard Tailwind CSS and Lucide React icons.
- **Dark/Light Mode**: Ambient toggle options allowing users to switch themes according to preference.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database Backend**: [Firebase (Firestore)](https://firebase.google.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Email Delivery**: [Resend](https://resend.com/) & [React Email](https://react.email/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Toast Notifications**: [Sonner](https://sonner.emilkowal.ski/)

## 🏁 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- A Firebase Project (with Firestore and Authentication configured if needed)
- A Resend API Key for Email service

### Installation

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <your-repository-url>
   cd ingri
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Create a `.env.local` file in the root directory and add the following configurations based on your setup:
   ```env
   # Firebase Client Config (For customer-facing queries)
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   # Firebase Admin Config (For secure server-side admin operations)
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_CLIENT_EMAIL=your_client_email
   FIREBASE_PRIVATE_KEY="your_private_key"

   # Resend Configuration (For automated emails)
   RESEND_API_KEY=your_resend_api_key
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 📦 Deployment

The application is fully configured and ready to be deployed.
To create a production build and run tests locally:
```bash
npm run build
npm start
```

### Deployment Strategy
Given the Next.js setup, the easiest and most optimized platform for deployment is **[Vercel](https://vercel.com)**. You can easily link this GitHub repository directly to Vercel, which will handle the deployment automatically. Since the domain is hosted on Name.com, you will just need to configure the Custom Domain settings from Vercel to point to your Name.com domain (by adding the required A and CNAME records).

## 📄 License
This project is proprietary.
