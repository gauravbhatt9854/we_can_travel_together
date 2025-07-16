
# 🚶‍♂️🚗 We Can Travel Together

**We Can Travel Together** is a real-time, location-based travel-matching web app. It connects people traveling in the same direction — whether by cab, rickshaw, metro, or on foot — for smarter, cost-effective, and social commuting.

🔗 **Live Demo**: [https://travel-partner.golu.codes](https://travel-partner.golu.codes)

---

## 🔍 Purpose

> Help users discover others near them going in the **same direction** from similar origins to nearby destinations — enabling them to **travel together** and split costs within a ~3 km match radius.

---

## 🧱 Tech Stack

| Tech           | Purpose                                          |
|----------------|--------------------------------------------------|
| **Next.js**    | Fullstack React + API Routes                     |
| **Redis**      | Fast in-memory store for live user locations     |
| **Mapbox**     | Location autocomplete & reverse geocoding        |
| **TailwindCSS**| Utility-first CSS for modern responsive UI       |
| **Docker**     | Containerized deployment for multi-instance use  |
| **Caddy/Nginx**| Load balancing between multiple containers        |

---

## 📁 Project Structure

```bash
app/
├── (component)/home/helper/
│   ├── Dashboard.tsx
│   ├── LocationForm.tsx
│   ├── LocationInput.tsx
│   ├── MyLocationCard.tsx
│   ├── PeopleNearbyList.tsx
│   └── PersonCard.tsx

├── login/page.tsx

├── api/
│   ├── send-location/route.ts
│   ├── check-location/route.ts
│   ├── delete-location/route.ts
│   ├── get-user/route.ts
│   └── check-login/route.ts

lib/
├── locationStore.ts      # Redis location logic
├── redis.ts              # Redis config/setup

globals.css               # Tailwind + base styles
layout.tsx                # Shared layout
page.tsx                  # Main home entry
````

---

## ⚙️ How It Works

### 👤 Authentication

* Users log in using **phone number** and **name**
* Secure `HttpOnly` cookie stores session using **NextAuth**
* Auto-logout after **24 hours**

### 📍 Location Sharing

* Users submit:

  * **Current location** (with geocoordinates)
  * **Destination**
* Redis stores user location data with TTL (Time To Live)
* Posts auto-expire after **3 hours**

### 🔍 Matchmaking

* System compares:

  * Your `from` & `to` lat/lng
  * With other users' saved routes
* Returns nearby people **within 3 km**
* UI shows dynamic live matches

---

## 🧹 Data Lifecycle

| Data Type     | Duration | Management                      |
| ------------- | -------- | ------------------------------- |
| Auth Session  | 24 hours | HttpOnly JWT cookie             |
| Location Post | 3 hours  | `setTimeout()` + Redis `EXPIRE` |

---

## 🚀 Docker Deployment

### Scalable Setup (5 Instances)

* App runs across **5 Docker containers**
* Load balanced using **Caddy reverse proxy**

#### 🌀 Caddy Round-Robin Example

```caddyfile
travel-partner.golu.codes {
  reverse_proxy {
    to instance1a:3000 instance2a:3000 instance3a:3000 instance4a:3000 instance5a:3000
    lb_policy round_robin
  }
}
```

---

## 🧪 Sample User Flow

1. Login with your mobile number + name
2. Search and select **Current Location** + **Destination**
3. Click **Send Location**
4. Instantly see:

   * Your route summary
   * Nearby users traveling similar paths
5. Optionally **delete/reset** your post

---

## 🧰 Local Development

### 🔧 Install Dependencies

```bash
git clone https://github.com/gauravbhatt9854/we_can_travel_together.git
cd we_can_travel_together
npm install
```

### 📄 Setup `.env`

```env
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
```

### 🚀 Start Development Server

```bash
# Start Redis locally
redis-server

# Run the dev server
npm run dev

# Open in browser
http://localhost:3000
```

---

## 🔐 Authentication Notes

* JWT stored in secure, HttpOnly cookie
* Single session per user
* Cookie auto-expires in 24h (Max-Age = 86400)
* Session handled entirely on the server

---

## 📦 Deployment Notes

* Use **Redis Cloud** (e.g., Upstash) for production scale
* Run multiple app containers via **Docker Compose / K8s**
* Use **Caddy/Nginx** to:

  * Terminate SSL
  * Load balance across replicas
  * Set health checks

---

## 🧩 Future Ideas

* 🧭 Route distance optimization
* 🗺️ Show people on a map view (Mapbox markers)
* 🔔 Real-time chat between matched users
* 📅 Schedule rides in advance
* 📱 PWA/mobile-first version

---

## 📜 License

MIT © [Gaurav Bhatt](https://github.com/gauravbhatt9854)

---

## 📬 Contact & Collaboration

* ✉️ Email: [gbhatt570@gmail.com](mailto:gbhatt570@gmail.com)
* 🔗 GitHub: [github.com/gauravbhatt9854/we\_can\_travel\_together](https://github.com/gauravbhatt9854/we_can_travel_together)
* 🌐 Live Site: [https://travel-partner.golu.codes](https://travel-partner.golu.codes)
