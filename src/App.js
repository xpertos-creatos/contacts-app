import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Auth from './components/Auth';
import ContactsApp from './components/ContactsApp';
import './App.css';

/**
 * Componente principal de la aplicación.
 * Maneja la autenticación del usuario y renderiza la interfaz de usuario apropiada.
 * @returns {JSX.Element} El componente App renderizado.
 */
function App() {
  // Estado para guardar la sesión del usuario
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * useEffect hook to manage user session.
   * It fetches the current session on component mount and listens for auth state changes.
   */
  // useEffect para verificar la sesión al cargar la app
  useEffect(() => {
    // Obtener sesión inicial
    getSession();

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth event:', event);
        setSession(session);
        setLoading(false);
      }
    );

    // Cleanup: remover listener cuando el componente se desmonte
    return () => subscription.unsubscribe();
  }, []);

  /**
   * Obtiene la sesión actual del usuario desde Supabase.
   * Actualiza el estado de `session` y `loading`.
   * @async
   */
  // Función para obtener la sesión actual
  async function getSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      setSession(session);
    } catch (error) {
      console.error('Error getting session:', error);
    } finally {
      setLoading(false);
    }
  }

  // Mostrar loading mientras verifica la sesión
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#282c34',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2>⏳ Cargando...</h2>
          <p>Verificando sesión de usuario</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {/* 
        Lógica principal:
        - Si NO hay sesión → Mostrar Auth (login/signup)
        - Si SÍ hay sesión → Mostrar ContactsApp
      */}
      {!session ? (
        <Auth />
      ) : (
        <ContactsApp user={session.user} />
      )}
    </div>
  );
}

export default App;