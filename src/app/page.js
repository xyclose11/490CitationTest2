'use client';
import { useState } from 'react';
import styles from './page.module.css';
import Search from '@/components/searchBar';
// ...

export default function Home() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch('/api/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    // Handle response
    console.log(data);
  };

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <div>
          <Search />
        </div>
        <div>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              required
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>

      {/* ... */}
    </main>
  );
}