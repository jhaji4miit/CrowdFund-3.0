/* Reset default browser styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Body */
body {
  font-family: 'Poppins', sans-serif;
  background: linear-gradient(to bottom right, #ff6600 10%, #ffffff 90%);
  color: #333;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Navbar */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 1rem 2rem;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.nav-brand {
  display: flex;
  align-items: center;
}

.logo {
  width: 40px;
  margin-right: 10px;
}

.brand-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ff6600;
}

.btn-connect {
  background: #ff6600;
  border: none;
  padding: 0.6rem 1.4rem;
  color: white;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.btn-connect:hover {
  background: #e65c00;
}

/* Hero Section */
.hero {
  text-align: center;
  padding: 3rem 2rem;
  background: url('assets/background.jpg') no-repeat center/cover;
  color: white;
}

.hero h1 {
  font-size: 2.8rem;
  margin-bottom: 1rem;
}

.hero span {
  color: #ffcc00;
}

.hero p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.btn-primary {
  background: #ff6600;
  border: none;
  padding: 0.8rem 2rem;
  color: white;
  font-weight: bold;
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.btn-primary:hover {
  background: #e65c00;
}

/* Campaign Summary */
.campaign-summary {
  padding: 2rem;
  background: #fff;
  text-align: center;
}

.campaign-summary h2 {
  margin-bottom: 2rem;
  font-size: 2rem;
  color: #ff6600;
}

.stats {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem;
}

.stat-box {
  background: #f9f9f9;
  padding: 1.5rem;
  border-radius: 12px;
  width: 200px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.stat-box h3 {
  color: #ff6600;
  font-size: 1.6rem;
}

.stat-box p {
  margin-top: 0.5rem;
  font-size: 1rem;
  color: #555;
}

/* Leaderboard */
.leaderboard {
  padding: 2rem;
  background: #ffe5cc;
  text-align: center;
}

.leaderboard h2 {
  margin-bottom: 1.5rem;
  font-size: 2rem;
  color: #ff6600;
}

.leaderboard-list {
  list-style: none;
}

.leaderboard-list li {
  background: #fff;
  margin: 0.5rem auto;
  padding: 0.8rem;
  width: 90%;
  max-width: 500px;
  border-radius: 8px;
  font-weight: bold;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

/* Admin Panel */
.admin-panel {
  padding: 2rem;
  background: #ffffff;
  text-align: center;
}

.admin-panel h2 {
  margin-bottom: 1rem;
  color: #ff6600;
}

.admin-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}

.btn-admin {
  background: #ff6600;
  color: white;
  border: none;
  padding: 0.8rem 1.6rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.btn-admin:hover {
  background: #e65c00;
}

/* Footer */
footer {
  margin-top: auto;
  background: #fff;
  text-align: center;
  padding: 1rem;
  font-size: 0.9rem;
  color: #777;
}

/* Hidden Class */
.hidden {
  display: none;
}

/* Toast */
.toast {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #ff6600;
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  display: none;
  font-weight: bold;
  z-index: 999;
  animation: fadeInOut 4s ease-in-out;
}

@keyframes fadeInOut {
  0%,100% { opacity: 0; }
  10%,90% { opacity: 1; }
}

/* Responsive */
@media(max-width: 768px) {
  .stats {
    flex-direction: column;
    align-items: center;
  }

  .admin-actions {
    flex-direction: column;
  }

  .hero h1 {
    font-size: 2rem;
  }
}
