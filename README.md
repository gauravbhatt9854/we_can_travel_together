# 🚕 We Can Cab Together

**We Can Cab Together** is a real-time, location-based travel-sharing web app. It helps users find others nearby going to the same destination — ideal for cost-sharing cabs, autos, or rickshaws in colleges, offices, or urban cities.

🔗 **Live Demo**: [https://cab.golu.codes](https://cab.golu.codes)

---

## 🔍 Purpose

> Help users connect and travel together from similar starting points to nearby destinations — saving money and time within a 3 km radius.

---

## 🧱 Tech Stack

| Tech       | Purpose                                      |
|------------|----------------------------------------------|
| **Next.js**    | Frontend + API backend in one framework     |
| **Redis**      | Fast in-memory data store for live users    |
| **Mapbox**     | Location autocomplete and geocoding         |
| **TailwindCSS**| Responsive and clean styling                |
| **Docker**     | Containerized deployment for scalability    |
| **Caddy/Nginx**| Load balancer across multiple containers    |

---

## 📁 Project Structure

app/
├── (component)/home/helper/
│ ├── Dashboard.tsx
│ ├── LocationForm.tsx
│ ├── LocationInput.tsx
│ ├── MyLocationCard.tsx
│ ├── PeopleNearbyList.tsx
│ └── PersonCard.tsx

├── login/page.tsx

├── api/
│ ├── send-location/route.ts
│ ├── check-location/route.ts
│ ├── delete-location/route.ts
│ ├── get-user/route.ts
│ └── check-login/route.ts

lib/
├── locationStore.ts # Redis operations
├── redis.ts # Redis config

.env # Secrets: Redis, Mapbox
globals.css # Tailwind + custom styles
layout.tsx # App layout
page.tsx # Main entry

yaml
Copy
Edit

---

## ⚙️ How It Works

### 👨‍💼 Auth

- Login via phone number + name
- Session stored in an `HttpOnly` cookie (secure)
- Automatically expires in **24 hours**

### 📍 Location Posting

- Users post their **current location** and **destination**
- Redis stores it temporarily
- Post is **auto-deleted after 3 hours**

### 🔁 Matching

- Shows nearby people with the same route (within 3 km)
- Backend calculates matching using geo-coordinates
- UI updates instantly with nearby matches

---

## 🧹 Data Cleanup

- 🧍 User data (auth session): **Expires after 24 hours**
- 📍 Location data: **Expires after 3 hours**
- Managed with:
  - `setTimeout()` in server code
  - Optional Redis `EXPIRE` (TTL) for robustness

---

## 🚀 Dockerized Deployment

- 5 container instances (`instance1a` to `instance5a`)
- All run same app, load-balanced via:

### 🔁 Caddy Example (round robin)

```caddyfile
cab.golu.codes {
  reverse_proxy {
    to instance1a:3000 instance2a:3000 instance3a:3000 instance4a:3000 instance5a:3000
    lb_policy round_robin
  }
}
🛠 GitHub Actions
On push to master, GitHub Action builds once

Starts or restarts 5 Docker containers

All use the same image and .env variables

💻 Local Development
🔧 Install
bash
Copy
Edit
git clone https://github.com/golubhattuk01/we_can_cab_together.git
cd we_can_cab_together
npm install
📄 Setup .env
env
Copy
Edit
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
🚀 Start
bash
Copy
Edit
redis-server
npm run dev
Go to http://localhost:3000

🧪 Sample User Flow
Login with phone and name

Choose Current Location and Destination

Click Send Location

See your post + nearby people going same route

Optionally delete and reset post

🔒 Authentication
Session stored in HttpOnly cookie

Auto-expiry in 24 hours (Max-Age=86400)

Only one active session per user

Secure backend-only cookie reading

📦 Deployment Tips
Use a managed Redis service (like Upstash, RedisCloud)

Use Caddy for load balancing

Docker setup uses 5 container replicas

Caddy supports health checks and load policies (e.g., round robin)

📜 License
MIT © [GAURAV BHATT]

📬 Contact
Want to collaborate or contribute?

📧 Email: youremail@example.com
🌐 GitHub: golubhattuk01/we_can_cab_together