import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import type { Contact } from '../../types/contact';
import { INDIA_EMERGENCY_NUMBERS, UNIVERSAL_EMERGENCY } from '../../types/contact';
import { getContacts, addContact, updateContact, deleteContact } from '../../services/firebase/contactService';

export const ContactsPage: React.FC = () => {
  const { user, signInWithGoogle } = useAuth();

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingContactId, setEditingContactId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState('Family');
  const [isPrimary, setIsPrimary] = useState(false);

  const fetchContacts = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getContacts(user.uid);
      setContacts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load contacts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [user]);

  const resetForm = () => {
    setName('');
    setPhone('');
    setRelationship('Family');
    setIsPrimary(false);
    setEditingContactId(null);
    setIsFormOpen(false);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const handleOpenEdit = (contact: Contact) => {
    setEditingContactId(contact.id);
    setName(contact.name);
    setPhone(contact.phone);
    setRelationship(contact.relationship);
    setIsPrimary(contact.isPrimary);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setError(null);
    setSuccess(null);

    try {
      if (editingContactId) {
        await updateContact(user.uid, editingContactId, {
          name,
          phone,
          relationship,
          isPrimary,
        });
        setSuccess('Contact updated successfully.');
      } else {
        await addContact(user.uid, {
          name,
          phone,
          relationship,
          isPrimary,
        });
        setSuccess('Trusted contact added successfully.');
      }

      resetForm();
      await fetchContacts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save contact.');
    }
  };

  const handleDelete = async (contactId: string) => {
    if (!user) return;
    if (!window.confirm('Are you sure you want to delete this emergency contact?')) return;

    setError(null);
    setSuccess(null);

    try {
      await deleteContact(user.uid, contactId);
      setSuccess('Contact deleted.');
      await fetchContacts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete contact.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-[#e8e8f0] px-4 py-6 max-w-3xl mx-auto space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <span>📞</span> Emergency Contacts
        </h1>
        <p className="text-sm text-gray-400">
          Official national hotlines and trusted personal emergency contacts.
        </p>
      </div>

      {/* Official Hotlines Banner */}
      <div className="bg-[#1a1a2e] border border-red-500/30 rounded-xl p-5 shadow-lg space-y-4">
        <h2 className="text-lg font-bold text-red-400 flex items-center gap-2">
          <span>🚨</span> Official National Hotlines ({INDIA_EMERGENCY_NUMBERS.country})
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="bg-[#0f0f1a] border border-[#2d2d44] p-3 rounded-lg flex justify-between items-center">
            <div>
              <div className="text-gray-400">Universal Emergency</div>
              <div className="font-bold text-white text-sm">National Helpline</div>
            </div>
            <a href={`tel:${UNIVERSAL_EMERGENCY}`} className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white font-extrabold rounded-lg">
              📞 {UNIVERSAL_EMERGENCY}
            </a>
          </div>

          <div className="bg-[#0f0f1a] border border-[#2d2d44] p-3 rounded-lg flex justify-between items-center">
            <div>
              <div className="text-gray-400">Ambulance</div>
              <div className="font-bold text-white text-sm">Medical Emergency</div>
            </div>
            <a href={`tel:${INDIA_EMERGENCY_NUMBERS.ambulance}`} className="px-3 py-1.5 bg-pink-600 hover:bg-pink-500 text-white font-extrabold rounded-lg">
              📞 {INDIA_EMERGENCY_NUMBERS.ambulance}
            </a>
          </div>

          <div className="bg-[#0f0f1a] border border-[#2d2d44] p-3 rounded-lg flex justify-between items-center">
            <div>
              <div className="text-gray-400">Police Hotline</div>
              <div className="font-bold text-white text-sm">Police Control</div>
            </div>
            <a href={`tel:${INDIA_EMERGENCY_NUMBERS.police}`} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold rounded-lg">
              📞 {INDIA_EMERGENCY_NUMBERS.police}
            </a>
          </div>

          <div className="bg-[#0f0f1a] border border-[#2d2d44] p-3 rounded-lg flex justify-between items-center">
            <div>
              <div className="text-gray-400">Fire Services</div>
              <div className="font-bold text-white text-sm">Fire Control</div>
            </div>
            <a href={`tel:${INDIA_EMERGENCY_NUMBERS.fire}`} className="px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white font-extrabold rounded-lg">
              📞 {INDIA_EMERGENCY_NUMBERS.fire}
            </a>
          </div>
        </div>
      </div>

      {/* Trusted Personal Contacts Firestore Section */}
      <div className="bg-[#1a1a2e] border border-[#2d2d44] rounded-xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>👥</span> Trusted Personal Contacts
          </h2>
          {user && !isFormOpen && (
            <button
              onClick={handleOpenAdd}
              className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1"
            >
              <span>➕</span> Add Contact
            </button>
          )}
        </div>

        {error && (
          <div className="p-3 bg-red-950/80 border border-red-500/40 text-red-300 text-xs font-semibold rounded-lg">
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-950/80 border border-green-500/40 text-green-300 text-xs font-semibold rounded-lg">
            ✓ {success}
          </div>
        )}

        {!user ? (
          <div className="p-6 bg-[#0f0f1a] border border-[#2d2d44] rounded-lg text-center space-y-3">
            <p className="text-sm text-gray-300">Sign in to sync your trusted emergency contacts with Firestore.</p>
            <button
              onClick={() => signInWithGoogle()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-md cursor-pointer"
            >
              Sign In with Google
            </button>
          </div>
        ) : (
          <>
            {/* Contact Add/Edit Form */}
            {isFormOpen && (
              <form onSubmit={handleSubmit} className="p-4 bg-[#0f0f1a] border border-blue-500/40 rounded-xl space-y-3">
                <h3 className="text-sm font-bold text-blue-400">
                  {editingContactId ? 'Edit Contact' : 'Add Trusted Contact'}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-400 font-semibold block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full p-2.5 bg-[#1a1a2e] border border-[#2d2d44] rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 font-semibold block mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+919876543210"
                      className="w-full p-2.5 bg-[#1a1a2e] border border-[#2d2d44] rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-400 font-semibold block mb-1">Relationship</label>
                    <select
                      value={relationship}
                      onChange={(e) => setRelationship(e.target.value)}
                      className="w-full p-2.5 bg-[#1a1a2e] border border-[#2d2d44] rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                    >
                      <option value="Family">Family</option>
                      <option value="Friend">Friend</option>
                      <option value="Neighbor">Neighbor</option>
                      <option value="Doctor">Doctor</option>
                      <option value="Colleague">Colleague</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="flex items-center pt-5">
                    <label className="flex items-center gap-2 text-xs text-gray-300 font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isPrimary}
                        onChange={(e) => setIsPrimary(e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-[#1a1a2e] border-[#2d2d44] rounded"
                      />
                      <span>Set as Primary Contact</span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-3 py-1.5 bg-gray-800 text-gray-300 text-xs font-semibold rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg"
                  >
                    Save Contact
                  </button>
                </div>
              </form>
            )}

            {/* Contacts List */}
            {loading ? (
              <div className="text-center p-4 text-xs text-gray-400">Loading contacts from Firestore...</div>
            ) : contacts.length === 0 ? (
              <div className="text-center p-4 text-xs text-gray-400 bg-[#0f0f1a] rounded-lg">
                No trusted contacts added yet. Click "Add Contact" to store emergency numbers.
              </div>
            ) : (
              <div className="space-y-2">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="p-3.5 bg-[#0f0f1a] border border-[#2d2d44] rounded-lg flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{contact.name}</span>
                        {contact.isPrimary && (
                          <span className="bg-green-950 border border-green-500/40 text-green-300 text-[10px] px-2 py-0.5 rounded-full font-bold">
                            PRIMARY
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
                        <span>{contact.relationship}</span>
                        <span>•</span>
                        <a href={`tel:${contact.phone}`} className="text-blue-400 hover:underline">
                          {contact.phone}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(contact)}
                        className="p-1.5 text-xs text-gray-400 hover:text-white bg-[#1a1a2e] rounded border border-[#2d2d44]"
                        title="Edit Contact"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(contact.id)}
                        className="p-1.5 text-xs text-red-400 hover:text-red-300 bg-[#1a1a2e] rounded border border-[#2d2d44]"
                        title="Delete Contact"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
