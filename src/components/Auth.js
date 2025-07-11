import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

/**
 * Componente de autenticación.
 * Permite a los usuarios iniciar sesión o registrarse.
 * @returns {JSX.Element} El componente Auth renderizado.
 */
function Auth() {
  // Estados para el formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false); // false = login, true = signup

  /**
   * Maneja el proceso de inicio de sesión del usuario.
   * Utiliza Supabase para autenticar al usuario con email y contraseña.
   * @async
   */
  // Función para manejar el login
  async function handleLogin() {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });

      if (error) throw error;
      
      alert('¡Login exitoso!');
      
    } catch (error) {
      alert('Error en login: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Maneja el proceso de registro de un nuevo usuario.
   * Utiliza Supabase para registrar al usuario con email y contraseña.
   * @async
   */
  // Función para manejar el registro
  async function handleSignUp() {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password
      });

      if (error) throw error;
      
      alert('¡Registro exitoso! Revisa tu email para confirmar la cuenta.');
      
    } catch (error) {
      alert('Error en registro: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Maneja el envío del formulario de autenticación.
   * Llama a `handleSignUp` o `handleLogin` dependiendo del estado de `isSignUp`.
   * @param {React.FormEvent<HTMLFormElement>} e - El evento del formulario.
   */
  // Función que se ejecuta cuando el usuario envía el formulario
  function handleSubmit(e) {
    e.preventDefault(); // Evitar que la página se recargue
    
    if (isSignUp) {
      handleSignUp();
    } else {
      handleLogin();
    }
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: '#282c34',
      color: 'white'
    }}>
      <div style={{
        background: '#1e1e1e',
        padding: '40px',
        borderRadius: '10px',
        border: '2px solid #61dafb',
        maxWidth: '400px',
        width: '100%'
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
          {isSignUp ? '📝 Registrarse' : '🔐 Iniciar Sesión'}
        </h1>
        
        <form onSubmit={handleSubmit}>
          {/* Campo Email */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              📧 Email:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '5px',
                border: '1px solid #61dafb',
                background: '#282c34',
                color: 'white',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
              placeholder="tu@email.com"
            />
          </div>

          {/* Campo Password */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              🔒 Contraseña:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '5px',
                border: '1px solid #61dafb',
                background: '#282c34',
                color: 'white',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
              placeholder="••••••••"
            />
          </div>

          {/* Botón Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '5px',
              border: 'none',
              background: loading ? '#555' : '#61dafb',
              color: loading ? '#ccc' : '#000',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: '20px'
            }}
          >
            {loading ? (
              isSignUp ? '⏳ Registrando...' : '⏳ Iniciando sesión...'
            ) : (
              isSignUp ? '📝 Registrarse' : '🔐 Iniciar Sesión'
            )}
          </button>
        </form>

        {/* Botón para cambiar entre Login y Signup */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ marginBottom: '10px' }}>
            {isSignUp ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
          </p>
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            style={{
              background: 'transparent',
              border: '1px solid #61dafb',
              color: '#61dafb',
              padding: '8px 16px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            {isSignUp ? 'Ir a Iniciar Sesión' : 'Ir a Registrarse'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Auth;