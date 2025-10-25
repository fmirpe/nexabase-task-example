'use client';

import { useState } from 'react';
import axios from 'axios';

export default function SimpleTestPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult('Probando login...');
    
    console.clear();
    console.log('🧪 TEST LOGIN DIRECTO');
    console.log('Email:', email);
    
    try {
      const response = await axios.post('https://api.nexabase.online/auth/login', {
        email,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      
      console.log('✅ SUCCESS:', response.data);
      
      // Guardar token
      const token = response.data.access_token;
      if (token) {
        document.cookie = `nexabase_token=${token}; path=/; max-age=86400; SameSite=Lax`;
        console.log('Cookie guardada');
      }
      
      setResult(`✅ LOGIN EXITOSO!

Token recibido: ${token?.substring(0, 40)}...

Usuario: ${response.data.user?.email || 'N/A'}

¡LISTO! Token guardado en cookie.

Este test NO usa AuthProvider ni nada más.`);
      
      setLoading(false);
      
    } catch (error: any) {
      console.error('❌ ERROR:', error);
      
      setResult(`❌ ERROR:

${error.message}

Status: ${error.response?.status || 'N/A'}
Mensaje: ${error.response?.data?.message || 'N/A'}

Revisa la consola para más detalles.`);
      
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f3f4f6',
      padding: '20px',
    }}>
      <div style={{
        maxWidth: '500px',
        width: '100%',
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          marginBottom: '10px',
          textAlign: 'center',
        }}>
          🧪 TEST SIMPLE
        </h1>
        <p style={{
          textAlign: 'center',
          color: '#666',
          marginBottom: '30px',
          fontSize: '14px',
        }}>
          Sin AuthProvider, sin middleware, sin nada.<br/>
          Solo Axios directo.
        </p>
        
        <form onSubmit={testLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontWeight: 'bold',
              marginBottom: '5px',
              fontSize: '14px',
            }}>
              Email:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '16px',
                border: '2px solid #ddd',
                borderRadius: '4px',
                backgroundColor: 'white',
                color: 'black',
              }}
              placeholder="tu@email.com"
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontWeight: 'bold',
              marginBottom: '5px',
              fontSize: '14px',
            }}>
              Password:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '16px',
                border: '2px solid #ddd',
                borderRadius: '4px',
                backgroundColor: 'white',
                color: 'black',
              }}
              placeholder="••••••••"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '15px',
              fontSize: '16px',
              fontWeight: 'bold',
              backgroundColor: loading ? '#ccc' : '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? '⏳ Probando...' : '🧪 PROBAR LOGIN'}
          </button>
        </form>
        
        {result && (
          <div style={{
            marginTop: '30px',
            padding: '20px',
            backgroundColor: result.includes('✅') ? '#d4edda' : '#f8d7da',
            border: `3px solid ${result.includes('✅') ? '#28a745' : '#dc3545'}`,
            borderRadius: '8px',
          }}>
            <pre style={{
              whiteSpace: 'pre-wrap',
              fontSize: '14px',
              margin: 0,
              fontFamily: 'monospace',
              color: '#000',
            }}>
              {result}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
