import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

function ContactsApp({ user }) {
  // Estados para contactos
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para empresas
  const [companies, setCompanies] = useState([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  
  // Estados para formulario de contactos
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company_id: '', // ← NUEVO: company_id en lugar de company
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  
  // Estados para formulario de empresas
  const [companyFormData, setCompanyFormData] = useState({
    name: '',
    industry: '',
    website: '',
    description: ''
  });
  const [submittingCompany, setSubmittingCompany] = useState(false);
  
  // Estados para edición
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  
  // Estados para búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados para pestañas
  const [activeTab, setActiveTab] = useState('contacts'); // 'contacts' o 'companies'

  // Cargar datos al iniciar
  useEffect(() => {
    fetchContacts();
    fetchCompanies();
  }, []);

  // Función para obtener contactos con información de empresa (JOIN)
  async function fetchContacts() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('contacts')
        .select(`
          *,
          companies (
            id,
            name,
            industry,
            website
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      alert('Error al cargar contactos: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  // Función para obtener empresas
  async function fetchCompanies() {
    try {
      setLoadingCompanies(true);
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setCompanies(data || []);
    } catch (error) {
      console.error('Error fetching companies:', error);
      alert('Error al cargar empresas: ' + error.message);
    } finally {
      setLoadingCompanies(false);
    }
  }

  // Función para crear una nueva empresa
  async function handleCompanySubmit(e) {
    e.preventDefault();
    
    try {
      setSubmittingCompany(true);
      
      if (!companyFormData.name) {
        alert('Nombre de empresa es obligatorio');
        return;
      }

      const companyData = {
        ...companyFormData,
        user_id: user.id
      };

      const { data, error } = await supabase
        .from('companies')
        .insert([companyData])
        .select();

      if (error) throw error;

      setCompanyFormData({
        name: '',
        industry: '',
        website: '',
        description: ''
      });

      fetchCompanies();
      alert('¡Empresa creada exitosamente!');
      
    } catch (error) {
      console.error('Error creating company:', error);
      alert('Error al crear empresa: ' + error.message);
    } finally {
      setSubmittingCompany(false);
    }
  }

  // Función para manejar cambios en el formulario de contactos
  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  // Función para manejar cambios en el formulario de empresas
  function handleCompanyInputChange(e) {
    const { name, value } = e.target;
    setCompanyFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  // Función para crear un nuevo contacto
  async function handleSubmit(e) {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      
      if (!formData.name || !formData.email) {
        alert('Nombre y email son obligatorios');
        return;
      }

      const contactData = {
        ...formData,
        user_id: user.id,
        company_id: formData.company_id || null // Si no hay empresa, NULL
      };

      const { data, error } = await supabase
        .from('contacts')
        .insert([contactData])
        .select();

      if (error) throw error;

      setFormData({
        name: '',
        email: '',
        phone: '',
        company_id: '',
        notes: ''
      });

      fetchContacts();
      alert('¡Contacto creado exitosamente!');
      
    } catch (error) {
      console.error('Error creating contact:', error);
      alert('Error al crear contacto: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  }

  // Función para eliminar un contacto
  async function handleDelete(contactId, contactName) {
    const confirmed = window.confirm(
      `¿Estás seguro de eliminar a "${contactName}"?\n\nEsta acción no se puede deshacer.`
    );
    
    if (!confirmed) return;
    
    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', contactId);

      if (error) throw error;

      setContacts(prev => prev.filter(contact => contact.id !== contactId));
      alert(`✅ ${contactName} eliminado exitosamente`);
      
    } catch (error) {
      console.error('Error deleting contact:', error);
      alert('❌ Error al eliminar contacto: ' + error.message);
    }
  }

  // Función para eliminar una empresa
  async function handleDeleteCompany(companyId, companyName) {
    const confirmed = window.confirm(
      `¿Estás seguro de eliminar "${companyName}"?\n\nEsta acción no se puede deshacer.`
    );
    
    if (!confirmed) return;
    
    try {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', companyId);

      if (error) throw error;

      setCompanies(prev => prev.filter(company => company.id !== companyId));
      alert(`✅ ${companyName} eliminada exitosamente`);
      
    } catch (error) {
      console.error('Error deleting company:', error);
      alert('❌ Error al eliminar empresa: ' + error.message);
    }
  }

  // Función para activar modo edición
  function startEditing(contact) {
    setEditingId(contact.id);
    setEditData({
      name: contact.name,
      email: contact.email,
      phone: contact.phone || '',
      company_id: contact.company_id || '',
      notes: contact.notes || ''
    });
  }

  // Función para cancelar edición
  function cancelEditing() {
    setEditingId(null);
    setEditData({});
  }

  // Función para manejar cambios en edición
  function handleEditChange(e) {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  // Función para guardar cambios
  async function saveEdit(contactId) {
    try {
      if (!editData.name || !editData.email) {
        alert('Nombre y email son obligatorios');
        return;
      }

      const updateData = {
        ...editData,
        company_id: editData.company_id || null
      };

      const { error } = await supabase
        .from('contacts')
        .update(updateData)
        .eq('id', contactId);

      if (error) throw error;

      setEditingId(null);
      setEditData({});
      fetchContacts(); // Recargar para obtener datos actualizados con JOIN
      alert('✅ Contacto actualizado exitosamente');
      
    } catch (error) {
      console.error('Error updating contact:', error);
      alert('❌ Error al actualizar contacto: ' + error.message);
    }
  }

  // Función para filtrar contactos en tiempo real
  const filteredContacts = contacts.filter(contact => {
    const searchLower = searchTerm.toLowerCase();
    return (
      contact.name.toLowerCase().includes(searchLower) ||
      contact.email.toLowerCase().includes(searchLower) ||
      (contact.phone && contact.phone.includes(searchTerm)) ||
      (contact.companies && contact.companies.name.toLowerCase().includes(searchLower)) ||
      (contact.notes && contact.notes.toLowerCase().includes(searchTerm))
    );
  });

  // Función para limpiar búsqueda
  function clearSearch() {
    setSearchTerm('');
  }

  // Función para cerrar sesión
  async function handleSignOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      alert('Error al cerrar sesión: ' + error.message);
    }
  }

  return (
    <div style={{
      padding: '10px',
      maxWidth: '100%',
      overflow: 'hidden',
      backgroundColor: '#282c34',
      minHeight: '100vh',
      color: 'white'
    }}>
      <header style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px 10px'
      }}>
        {/* Header con información del usuario */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          maxWidth: '600px',
          marginBottom: '20px',
          padding: '10px',
          background: '#1e1e1e',
          borderRadius: '8px',
          border: '1px solid #61dafb'
        }}>
          <div>
            <h2 style={{ margin: 0, color: '#61dafb' }}>👋 Hola!</h2>
            <p style={{ margin: 0, fontSize: '14px', color: '#ccc' }}>
              {user.email}
            </p>
          </div>
          <button
            onClick={handleSignOut}
            style={{
              padding: '8px 16px',
              borderRadius: '5px',
              border: 'none',
              background: '#ff4757',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            🚪 Cerrar Sesión
          </button>
        </div>

        <h1 style={{
          fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
          textAlign: 'center',
          margin: '0 0 20px 0'
        }}>📋 Mi CRM</h1>

        {/* PESTAÑAS */}
        <div style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '20px',
          background: '#1e1e1e',
          padding: '5px',
          borderRadius: '8px',
          border: '1px solid #61dafb'
        }}>
          <button
            onClick={() => setActiveTab('contacts')}
            style={{
              padding: '10px 20px',
              borderRadius: '5px',
              border: 'none',
              background: activeTab === 'contacts' ? '#61dafb' : 'transparent',
              color: activeTab === 'contacts' ? '#000' : '#61dafb',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            📋 Contactos ({contacts.length})
          </button>
          <button
            onClick={() => setActiveTab('companies')}
            style={{
              padding: '10px 20px',
              borderRadius: '5px',
              border: 'none',
              background: activeTab === 'companies' ? '#61dafb' : 'transparent',
              color: activeTab === 'companies' ? '#000' : '#61dafb',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            🏢 Empresas ({companies.length})
          </button>
        </div>

        {/* CONTENIDO DE PESTAÑAS */}
        {activeTab === 'contacts' ? (
          // ===== PESTAÑA CONTACTOS =====
          <>
            {/* FORMULARIO PARA CREAR CONTACTOS */}
            <div style={{
              background: '#1e1e1e',
              padding: '20px',
              borderRadius: '10px',
              margin: '20px 0',
              width: '100%',
              maxWidth: '600px',
              border: '2px solid #61dafb',
              boxSizing: 'border-box'
            }}>
              <h2>➕ Agregar Nuevo Contacto</h2>
              
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                  <input
                    type="text"
                    name="name"
                    placeholder="Nombre completo *"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '5px',
                      border: '1px solid #61dafb',
                      background: '#282c34',
                      color: 'white',
                      fontSize: '16px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email *"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '5px',
                      border: '1px solid #61dafb',
                      background: '#282c34',
                      color: 'white',
                      fontSize: '16px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Teléfono"
                    value={formData.phone}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '5px',
                      border: '1px solid #61dafb',
                      background: '#282c34',
                      color: 'white',
                      fontSize: '16px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                
                {/* DROPDOWN DE EMPRESAS */}
                <div style={{ marginBottom: '15px' }}>
                  <select
                    name="company_id"
                    value={formData.company_id}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '5px',
                      border: '1px solid #61dafb',
                      background: '#282c34',
                      color: 'white',
                      fontSize: '16px',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="">Seleccionar empresa (opcional)</option>
                    {companies.map(company => (
                      <option key={company.id} value={company.id}>
                        {company.name} - {company.industry}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                  <textarea
                    name="notes"
                    placeholder="Notas adicionales"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '5px',
                      border: '1px solid #61dafb',
                      background: '#282c34',
                      color: 'white',
                      fontSize: '16px',
                      resize: 'vertical',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '5px',
                    border: 'none',
                    background: submitting ? '#555' : '#61dafb',
                    color: submitting ? '#ccc' : '#000',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: submitting ? 'not-allowed' : 'pointer'
                  }}
                >
                  {submitting ? '⏳ Guardando...' : '💾 Guardar Contacto'}
                </button>
              </form>
            </div>

            {/* LISTA DE CONTACTOS */}
            {loading ? (
              <p>Cargando contactos...</p>
            ) : (
              <div>
                {/* BUSCADOR */}
                {contacts.length > 0 && (
                  <div style={{
                    background: '#1e1e1e',
                    padding: '15px',
                    borderRadius: '8px',
                    margin: '20px 0',
                    width: '100%',
                    maxWidth: '600px',
                    border: '1px solid #61dafb',
                    boxSizing: 'border-box'
                  }}>
                    <h3 style={{
                      fontSize: 'clamp(1rem, 3vw, 1.2rem)',
                      margin: '0 0 15px 0'
                    }}>🔍 Buscar Contactos</h3>
                    <div style={{ 
                      display: 'flex', 
                      gap: '10px', 
                      alignItems: 'center',
                      flexWrap: 'wrap'
                    }}>
                      <input
                        type="text"
                        placeholder="Buscar por nombre, email, empresa..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                          flex: '1',
                          minWidth: '200px',
                          padding: '10px',
                          borderRadius: '5px',
                          border: '1px solid #61dafb',
                          background: '#282c34',
                          color: 'white',
                          fontSize: '14px',
                          boxSizing: 'border-box'
                        }}
                      />
                      {searchTerm && (
                        <button
                          onClick={clearSearch}
                          style={{
                            padding: '10px 15px',
                            borderRadius: '5px',
                            border: 'none',
                            background: '#95a5a6',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '14px',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          ❌ Limpiar
                        </button>
                      )}
                    </div>
                    
                    {searchTerm && (
                      <p style={{ margin: '10px 0 0 0', color: '#61dafb', fontSize: '14px' }}>
                        {filteredContacts.length} de {contacts.length} contactos encontrados
                        {filteredContacts.length === 0 && (
                          <span style={{ color: '#ff4757' }}>
                            {' '}• No se encontraron resultados para "{searchTerm}"
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                )}
                
                {contacts.length === 0 ? (
                  <p>No hay contactos aún. ¡Agrega el primero!</p>
                ) : filteredContacts.length === 0 && searchTerm ? (
                  <div style={{
                    background: '#282c34',
                    padding: '20px',
                    borderRadius: '8px',
                    border: '1px solid #ff4757',
                    width: '100%',
                    maxWidth: '600px',
                    textAlign: 'center',
                    boxSizing: 'border-box'
                  }}>
                    <h3>🔍 Sin resultados</h3>
                    <p>No se encontraron contactos que coincidan con "{searchTerm}"</p>
                    <button
                      onClick={clearSearch}
                      style={{
                        padding: '10px 20px',
                        borderRadius: '5px',
                        border: 'none',
                        background: '#61dafb',
                        color: '#000',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        marginTop: '10px'
                      }}
                    >
                      Ver todos los contactos
                    </button>
                  </div>
                ) : (
                  filteredContacts.map(contact => (
                    <div key={contact.id} style={{
                      background: '#282c34',
                      margin: '10px 0',
                      padding: '15px',
                      borderRadius: '8px',
                      border: '1px solid #61dafb',
                      width: '100%',
                      maxWidth: '600px',
                      position: 'relative',
                      boxSizing: 'border-box'
                    }}>
                      {/* Botones de acción */}
                      <div style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        display: 'flex',
                        gap: '5px',
                        flexWrap: 'wrap'
                      }}>
                        {editingId === contact.id ? (
                          <>
                            <button
                              onClick={() => saveEdit(contact.id)}
                              style={{
                                background: '#2ecc71',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                width: '35px',
                                height: '35px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                              title="Guardar cambios"
                            >
                              💾
                            </button>
                            <button
                              onClick={cancelEditing}
                              style={{
                                background: '#95a5a6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                width: '35px',
                                height: '35px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                              title="Cancelar edición"
                            >
                              ❌
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEditing(contact)}
                              style={{
                                background: '#3498db',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                width: '35px',
                                height: '35px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                              title={`Editar ${contact.name}`}
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDelete(contact.id, contact.name)}
                              style={{
                                background: '#ff4757',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                width: '35px',
                                height: '35px',
                                cursor: 'pointer',
                                fontSize: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                              title={`Eliminar ${contact.name}`}
                            >
                              🗑️
                            </button>
                          </>
                        )}
                      </div>

                      {/* Contenido del contacto */}
                      {editingId === contact.id ? (
                        <div style={{marginRight: '80px'}}>
                          <div style={{marginBottom: '10px'}}>
                            <input
                              type="text"
                              name="name"
                              value={editData.name}
                              onChange={handleEditChange}
                              style={{
                                width: '100%',
                                padding: '8px',
                                borderRadius: '4px',
                                border: '1px solid #61dafb',
                                background: '#1e1e1e',
                                color: 'white',
                                fontSize: 'clamp(14px, 2.5vw, 16px)',
                                fontWeight: 'bold',
                                boxSizing: 'border-box'
                              }}
                            />
                          </div>
                          <div style={{marginBottom: '10px'}}>
                            <input
                              type="email"
                              name="email"
                              value={editData.email}
                              onChange={handleEditChange}
                              style={{
                                width: '100%',
                                padding: '8px',
                                borderRadius: '4px',
                                border: '1px solid #61dafb',
                                background: '#1e1e1e',
                                color: 'white',
                                fontSize: 'clamp(12px, 2.5vw, 14px)',
                                boxSizing: 'border-box'
                              }}
                            />
                          </div>
                          <div style={{marginBottom: '10px'}}>
                            <input
                              type="tel"
                              name="phone"
                              value={editData.phone}
                              onChange={handleEditChange}
                              placeholder="Teléfono"
                              style={{
                                width: '100%',
                                padding: '8px',
                                borderRadius: '4px',
                                border: '1px solid #61dafb',
                                background: '#1e1e1e',
                                color: 'white',
                                fontSize: 'clamp(12px, 2.5vw, 14px)',
                                boxSizing: 'border-box'
                              }}
                            />
                          </div>
                          <div style={{marginBottom: '10px'}}>
                            <select
                              name="company_id"
                              value={editData.company_id}
                              onChange={handleEditChange}
                              style={{
                                width: '100%',
                                padding: '8px',
                                borderRadius: '4px',
                                border: '1px solid #61dafb',
                                background: '#1e1e1e',
                                color: 'white',
                                fontSize: 'clamp(12px, 2.5vw, 14px)',
                                boxSizing: 'border-box'
                              }}
                            >
                              <option value="">Sin empresa</option>
                              {companies.map(company => (
                                <option key={company.id} value={company.id}>
                                  {company.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div style={{marginBottom: '10px'}}>
                            <textarea
                              name="notes"
                              value={editData.notes}
                              onChange={handleEditChange}
                              placeholder="Notas"
                              rows={2}
                              style={{
                                width: '100%',
                                padding: '8px',
                                borderRadius: '4px',
                                border: '1px solid #61dafb',
                                background: '#1e1e1e',
                                color: 'white',
                                fontSize: 'clamp(12px, 2.5vw, 14px)',
                                resize: 'vertical',
                                boxSizing: 'border-box'
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div style={{marginRight: '80px'}}>
                          <h3 style={{
                            fontSize: 'clamp(1rem, 3vw, 1.3rem)',
                            margin: '0 0 10px 0',
                            wordBreak: 'break-word'
                          }}>👤 {contact.name}</h3>
                          <p style={{
                            fontSize: 'clamp(0.8rem, 2.5vw, 1rem)',
                            margin: '5px 0',
                            wordBreak: 'break-all'
                          }}>📧 {contact.email}</p>
                          {contact.phone && (
                            <p style={{
                              fontSize: 'clamp(0.8rem, 2.5vw, 1rem)',
                              margin: '5px 0'
                            }}>📱 {contact.phone}</p>
                          )}
                          {contact.companies && (
                            <p style={{
                              fontSize: 'clamp(0.8rem, 2.5vw, 1rem)',
                              margin: '5px 0',
                              wordBreak: 'break-word'
                            }}>🏢 {contact.companies.name} - {contact.companies.industry}</p>
                          )}
                          {contact.notes && (
                            <p style={{
                              fontSize: 'clamp(0.8rem, 2.5vw, 1rem)',
                              margin: '5px 0',
                              wordBreak: 'break-word'
                            }}>📝 {contact.notes}</p>
                          )}
                          <small style={{
                            color: '#888',
                            fontSize: 'clamp(0.7rem, 2vw, 0.8rem)'
                          }}>
                            Creado: {new Date(contact.created_at).toLocaleDateString('es-ES')}
                          </small>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        ) : (
          // ===== PESTAÑA EMPRESAS =====
          <>
            {/* FORMULARIO PARA CREAR EMPRESAS */}
            <div style={{
              background: '#1e1e1e',
              padding: '20px',
              borderRadius: '10px',
              margin: '20px 0',
              width: '100%',
              maxWidth: '600px',
              border: '2px solid #61dafb',
              boxSizing: 'border-box'
            }}>
              <h2>🏢 Agregar Nueva Empresa</h2>
              
              <form onSubmit={handleCompanySubmit}>
                <div style={{ marginBottom: '15px' }}>
                  <input
                    type="text"
                    name="name"
                    placeholder="Nombre de empresa *"
                    value={companyFormData.name}
                    onChange={handleCompanyInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '5px',
                      border: '1px solid #61dafb',
                      background: '#282c34',
                      color: 'white',
                      fontSize: '16px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                  <input
                    type="text"
                    name="industry"
                    placeholder="Industria/Sector"
                    value={companyFormData.industry}
                    onChange={handleCompanyInputChange}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '5px',
                      border: '1px solid #61dafb',
                      background: '#282c34',
                      color: 'white',
                      fontSize: '16px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                  <input
                    type="url"
                    name="website"
                    placeholder="Sitio web (https://...)"
                    value={companyFormData.website}
                    onChange={handleCompanyInputChange}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '5px',
                      border: '1px solid #61dafb',
                      background: '#282c34',
                      color: 'white',
                      fontSize: '16px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                  <textarea
                    name="description"
                    placeholder="Descripción de la empresa"
                    value={companyFormData.description}
                    onChange={handleCompanyInputChange}
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '5px',
                      border: '1px solid #61dafb',
                      background: '#282c34',
                      color: 'white',
                      fontSize: '16px',
                      resize: 'vertical',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={submittingCompany}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '5px',
                    border: 'none',
                    background: submittingCompany ? '#555' : '#61dafb',
                    color: submittingCompany ? '#ccc' : '#000',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: submittingCompany ? 'not-allowed' : 'pointer'
                  }}
                >
                  {submittingCompany ? '⏳ Guardando...' : '🏢 Guardar Empresa'}
                </button>
              </form>
            </div>

            {/* LISTA DE EMPRESAS */}
            {loadingCompanies ? (
              <p>Cargando empresas...</p>
            ) : (
              <div>
                {companies.length === 0 ? (
                  <p>No hay empresas aún. ¡Agrega la primera!</p>
                ) : (
                  companies.map(company => (
                    <div key={company.id} style={{
                      background: '#282c34',
                      margin: '10px 0',
                      padding: '15px',
                      borderRadius: '8px',
                      border: '1px solid #61dafb',
                      width: '100%',
                      maxWidth: '600px',
                      position: 'relative',
                      boxSizing: 'border-box'
                    }}>
                      {/* Botón eliminar empresa */}
                      <button
                        onClick={() => handleDeleteCompany(company.id, company.name)}
                        style={{
                          position: 'absolute',
                          top: '10px',
                          right: '10px',
                          background: '#ff4757',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          width: '35px',
                          height: '35px',
                          cursor: 'pointer',
                          fontSize: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        title={`Eliminar ${company.name}`}
                      >
                        🗑️
                      </button>

                      <div style={{marginRight: '50px'}}>
                        <h3 style={{
                          fontSize: 'clamp(1rem, 3vw, 1.3rem)',
                          margin: '0 0 10px 0',
                          wordBreak: 'break-word'
                        }}>🏢 {company.name}</h3>
                        {company.industry && (
                          <p style={{
                            fontSize: 'clamp(0.8rem, 2.5vw, 1rem)',
                            margin: '5px 0',
                            color: '#61dafb'
                          }}>🔧 {company.industry}</p>
                        )}
                        {company.website && (
                          <p style={{
                            fontSize: 'clamp(0.8rem, 2.5vw, 1rem)',
                            margin: '5px 0',
                            wordBreak: 'break-all'
                          }}>
                            🌐 <a href={company.website} target="_blank" rel="noopener noreferrer" style={{color: '#61dafb'}}>
                              {company.website}
                            </a>
                          </p>
                        )}
                        {company.description && (
                          <p style={{
                            fontSize: 'clamp(0.8rem, 2.5vw, 1rem)',
                            margin: '5px 0',
                            wordBreak: 'break-word'
                          }}>📝 {company.description}</p>
                        )}
                        <small style={{
                          color: '#888',
                          fontSize: 'clamp(0.7rem, 2vw, 0.8rem)'
                        }}>
                          Creada: {new Date(company.created_at).toLocaleDateString('es-ES')}
                        </small>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </header>
    </div>
  );
}

export default ContactsApp;