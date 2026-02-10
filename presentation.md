### Product Overview

RoadHelper is a PKR-first, real-time roadside assistance platform for Pakistan. It connects stranded drivers (Customers) with nearby verified mechanics, tow trucks, and helpers (Helpers), coordinated and monitored by an operations team (Admins).

The web app is built as if it were a real startup product: role-based dashboards, live maps, PKR pricing, subscription flows, and admin oversight – all wrapped in a premium, investor-ready UI.

### Problem

- Breaking down on the road in Pakistan is stressful and unsafe.
- Existing solutions are fragmented: random phone numbers, unverified helpers, and no way to track who is coming or what it will cost.
- There is no unified, digital, PKR-native experience that:
  - Verifies helpers.
  - Shows live ETA and location.
  - Manages payments and fairness between platform and helpers.

### Solution – Why RoadHelper is Different

- **Real-time, map-driven experience**: Customers see helpers on a live map with ETA and can jump into a shared “journey” view with WhatsApp and phone shortcuts.
- **Role-enforced authentication**:
  - One email = one account = one role.
  - Google and email/password are harmonized; provider/role conflicts are handled gracefully with clear errors.
- **PKR-native pricing & flows**:
  - Plans and dashboards show PKR only (no leftover dollar thinking).
  - Future-ready payment methods (JazzCash, Easypaisa, Bank) are already modeled.
- **Production-grade structure**:
  - Firebase Auth + Firestore with a normalized `users` collection.
  - Request lifecycle stored in `rideRequests` with real-time listeners.
  - Dedicated service layer and typed models instead of ad-hoc Firebase calls.

### Key Features

- **Multi-role platform**
  - **Customer**:
    - Beautiful landing page, mobile-first dashboard.
    - “Request Help” flow with a guided stepper.
    - Live GPS location capture and map preview.
    - Request history and quick “Live View” access to current jobs.
  - **Helper**:
    - Dashboard with status (online/offline) and revenue insights.
    - Nearby job feed that updates in real time.
    - One-click “Accept Job” that:
      - Locks the request.
      - Shares helper location.
      - Redirects to shared journey view.
  - **Admin**:
    - Rich dashboard with stats (users, helpers, jobs, pending help).
    - Table views for Requests and Users with better spacing and readability.
    - Profile management and exportable CSV reports.

- **Authentication & Role Logic**
  - Centralized `authService`:
    - `signupWithEmail`, `loginWithEmail`, `loginWithGoogle`, `deleteAccountFully`.
    - Enforces:
      - No cross-role logins for the same email.
      - Provider consistency (password vs. Google).
  - Firestore `users` collection:
    - `uid`, `email`, `role`, `authProvider`, `displayName`, optional phone and plan.
  - Cookies (`token`, `role`) stay in sync with Firebase and Firestore.

- **Live Map & Request Lifecycle**
  - Leaflet + OpenStreetMap-based `LiveMap` component.
  - `useLiveLocation` hook:
    - Handles permission, watchPosition, and error states.
  - `rideRequests` documents:
    - `customerId`, `helperId`, `status`, `serviceType`, `location`, `customerLocation`, `helperLocation`, timestamps.
  - Flow:
    - Customer fills the guided “Request Help” form.
    - Request is written to Firestore and shown as “pending”.
    - Helpers subscribe to pending requests in their dashboard.
    - On Accept:
      - Firestore is updated with helperId and status `accepted`.
      - Both roles are redirected to `/journey/[id]`.

- **Shared Journey Page**
  - Role-aware layout for Helpers and Customers.
  - Live map with customer and helper markers + estimated ETA.
  - Contact actions:
    - WhatsApp deep link with a prefilled message.
    - `tel:` link for one-click calls.
  - Status actions:
    - Helper can mark `in_progress` and `completed`.
    - Customer gets a clean, branded completion state with feedback CTA.

- **Profile & Account Management**
  - Customer, Helper, and Admin profiles are now Firestore-backed.
  - “Delete Account” button on each profile:
    - SweetAlert confirmation.
    - Deletes user from Firebase Auth.
    - Deletes the Firestore user document.
    - Cleans up related `rideRequests`.

- **Subscriptions Flow**

  - `/subscriptions` page shows PKR-based plans:
    - Free Plan: 10 rides/helpers, PKR 0.
    - Growth Plan: higher limits, flagged as “Coming soon”.
  - After any signup (customer or helper):
    - User is redirected to `/subscriptions?role=...&next=/role/dashboard`.
    - Plan is assigned to the user in Firestore via `subscriptionService`.
  - This makes the app “monetization-ready” without forcing actual payments yet.

### Tech Stack & Architecture

- **Frontend**
  - Next.js (App Router) with TypeScript.
  - React 19, Mantine UI, Tailwind v4 utility classes.
  - Framer Motion for motion design and micro-interactions.
  - SweetAlert2 for polished dialogs.

- **Backend-as-a-Service**
  - Firebase Auth (email/password + Google).
  - Firestore:
    - `users` – normalized profile & role store.
    - `rideRequests` – real-time job lifecycle.
    - Future-ready collections for `plans`, `payments`, and `notifications`.

- **State & Services**
  - Redux Toolkit for global auth/user state (centralized and cookie-aware).
  - Dedicated service modules:
    - `authService`, `userService`, `requestService`, `subscriptionService`.
  - Strongly typed `/types`:
    - `auth.ts`, `requests.ts`, `subscriptions.ts`.
  - `/data` folder for structured mock data and seeds (`subscriptions.ts`, dashboards).

### Why This Project Stands Out

- **Not just a UI demo**
  - The system enforces real constraints:
    - One Gmail → one role.
    - Provider mismatch errors are explicit, not “invalid password”.
    - Deleting an account is a real cascade through Auth + Firestore.

- **Real-time experience**
  - Live maps, geolocation hooks, and Firestore listeners make the app feel like a real production tool, not static screens.

- **PKR-first and locally contextual**
  - Pricing, labels, and copy are tuned for Pakistan:
    - PKR everywhere.
    - Future payment methods reflect actual local rails (JazzCash, Easypaisa, Bank).

- **Production-minded architecture**
  - No random `any` types in new core logic.
  - Firebase logic is isolated into services instead of spread through components.
  - Layout is responsive from 320px → 1920px.
  - Global loading and first-visit intro give a polished, product-level feel.

- **Investor / Judge Friendly**
  - Clear separation of roles and journeys:
    - Easy to demo; you can walk through Customer → Helper → Admin narratives.
  - Visual dashboards:
    - Admin panels show platform health, volume, and fee insights.
  - Built-in talking points:
    - Safety (verified helpers, live tracking).
    - Reliability (24/7 narrative, uptime, ETA).
    - Revenue model (plans + 20% fee structure).

### Talking Points for Interviews / Presentations

- **End-to-end story**:
  - “Let me show you what happens when a car breaks down at night in Karachi.”
  - Walk through:
    - Landing → Customer signup → Subscription selection.
    - Customer request-help → Live map → Helper accepts → Journey page.
    - Admin monitoring the same traffic from the dashboard.

- **Engineering depth**:
  - Explain how:
    - Auth and role enforcement uses a single `users` collection and typed services.
    - React hooks and Firebase listeners are coordinated, with purity rules respected.
    - Geolocation and Leaflet are wrapped into reusable hooks/components.

- **Product thinking**:
  - Why PKR-only is intentional (localization, trust, familiarity).
  - Why subscriptions appear immediately after signup (monetization and commitment).
  - Why shared journey view includes WhatsApp and phone as primary channels (behavior match with real drivers).

- **Scalability & Future Work**
  - Add real payment integration (Stripe / local gateways) using existing plan IDs.
  - Add ratings and badges for helpers based on feedback documents.
  - Introduce clustering and heatmaps on the admin map based on `rideRequests`.
  - Implement SMS / push notifications for status changes.

### Why This Deserves to Win & Get You Hired

- Demonstrates **full-stack ownership**:
  - From UX and motion design to auth rules, Firestore structure, and deployment-readiness.
- Shows **product instincts**:
  - Subscription flow design, PKR-native pricing, and a story tailored to a real local market.
- Proves **technical maturity**:
  - No fragile “toy” auth; roles, providers, and sessions are handled thoughtfully.
  - Real-time location and map flows show comfort with async, streaming data.
- Visually **stage-ready**:
  - Looks and feels like a SaaS product you could pitch to investors tomorrow.

