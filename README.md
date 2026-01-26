# 🚗 Async Race

A frontend application that simulates a car race using asynchronous requests.  
Users can create cars, start engines, run races, and track winners.

---

## ✨ Features

### 🏎 Car Management
- Create a new car  
- Edit car name & color  
- Delete car  
- Pagination (**7 cars per page**)

---

### ⚙️ Engine Control
Each car supports:
- `started`  
- `stopped`  
- `drive`  

The **drive** mode animates the movement based on the engine velocity.

---

### 🏁 Race Mode
- Start race (all cars drive simultaneously)  
- Stop race  
- Determine the winner  
- Store winner results

---

### 📊 Winners Page
- Pagination  
- Winners update automatically after each race

## 🛠 Tech Stack

| Category      | Tools                      |
|---------------|-----------------------------|
| **Language**  | TypeScript                  |
| **Framework** | Vite                        |
| **Tests**     | Jest + ts-jest              |
| **HTTP**      | fetch()                     |
| **Build**     | npm scripts                 |
| **State**     | Custom state management     |
| **Backend API** | Async Race REST API       |

## ⚙️ Installation

```bash
git clone https://github.com/ermukhanoff007/async-race.git
cd async-race
npm install
```

---

## ▶️ Run the Project

### 🚀 Development server
```bash
npm run dev
```

### 📦 Production build
```bash
npm run build
```

### 🔍 Preview production
```bash
npm run preview
```


