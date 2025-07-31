# 🧠 Theralink - Mental Health & Support Platform

**Theralink** is a full-stack mental health support and therapy platform designed to connect clients with therapists **and** support friends. It enables users to **book therapy sessions**, **chat with friends**, and even **initiate video meetings**, all hosted securely on the **Azure Cloud**.

## 🔗 Live Hosting

The project is hosted on **Azure** and supports video calls through **Google Meet integration**.

---

## 🚀 Key Features

### 👥 Authentication

- Secure login/register using **Supabase Auth**.
- Role-based access (client,friend, therapist, admin).

### 💼 Therapist Management

- Onboarding flow for therapists.
- Manage and complete bookings.
- View client profiles and session history.

### 🤝 Friend Support System

- Clients can book sessions with friends for peer support.
- Integrated **chat system** for client-friend communication.

### 📆 Booking System

- Book sessions with both therapists and friends.
- Session completion tracking.
- Booking status updates.

### 🎥 Google Meet Integration

- Automatically generates Google Meet links for virtual sessions.

### 💳 Payments (via IntaSend)

- Clients pay therapists after session completion.
- Integration with **IntaSend API** for secure transactions.

---

## 🛠️ Tech Stack

| Layer      | Technology                                |
| ---------- | ----------------------------------------- |
| Frontend   | React + TypeScript + Tailwind CSS         |
| Backend    | Supabase (Database, Auth, Edge Functions) |
| Payment    | IntaSend API                              |
| Deployment | Azure Cloud                               |
| Video Call | Google Meet API                           |

---

## 📁 Project Structure

```

src/
├── components/
│ ├── admin/
│ ├── booking/
│ ├── feedback/
│ ├── friend/
│ ├── layout/
│ ├── payments/
│ ├── profile/
│ ├── reviews/
│ ├── sections/
│ ├── seo/
│ ├── therapist/
│ ├── ui/
│ └── video/
├── contexts/
│ └── AuthContext.tsx
├── hooks/
├── integrations/
├── lib/
├── pages/
│ ├── admin/
│ ├── auth/
│ ├── client/
│ ├── friend/
│ ├── therapist/
│ └── various pages like:
│ ├── AboutPage.tsx
│ ├── ClientDashboard.tsx
│ ├── TherapistOnboardingPage.tsx
│ ├── ChatPage.tsx
│ ├── ContactPage.tsx
│ └── BookingPage.tsx
├── supabase/
│ ├── functions/
│ ├── config.toml
│ └── supabaseClient.ts

```

---

## 📄 .env Setup

Create a `.env` file in the root directory and include:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_INTASEND_PUBLIC_KEY=your-intasend-pub-key
VITE_INTASEND_SECRET_KEY=your-intasend-secret-key
VITE_GOOGLE_MEET_API_KEY=your-google-api-key
```

---

## 🧪 Installation & Running Locally

1. **Clone the repository:**

```bash
git clone https://github.com/Bricklabsai/theralink.git
cd theralink
```

2. **Install dependencies:**

```bash
npm install
```

3. **Add `.env` config as shown above.**

4. **Run the development server:**

```bash
npm run dev
```

---

## 🧾 Contribution Guidelines

We welcome contributions! If you're taking over development or making a feature improvement:

1. Clone the repository.
2. Create a new branch:

```bash
git checkout -b your-branch-name
```

3. Commit and push your changes:

```bash
git push origin your-branch-name
```

4. Go to [GitHub repo](https://github.com/Bricklabsai/theralink.git), and create a **Pull Request** to `main`.

---

## ✅ Suggested Improvements

- [ ] Add session review/ratings.
- [ ] Enhance chat (real-time via WebSockets).
- [ ] Integrate notification system (email/SMS).

---

## 📜 License

This project is licensed under the MIT License.
