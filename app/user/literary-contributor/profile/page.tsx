"use client";
import { useEffect, useState } from 'react';
import DOMPurify from "dompurify";
import { Layout } from '../../../components/layout/Layout';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Bell, FileText, Loader } from 'lucide-react';
import * as api from "../../../api/auth"
import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { LiteraryProfileType } from '@/app/types/literary.types';

interface Notification {
  id: string;
  title: string;
  message: string;
  notification_type: string;
  read: boolean;
  created_at: string;
  action_url?: string;
  submission_reference?: string;
}

export default function UserProfile() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'submissions' | 'notifications'>('submissions');
  const [status, setStatus] = useState("")
  const [formData, setFormData] = useState<LiteraryProfileType>({
    full_name: '',
    professional_name: '',
    country: '',
    city: '',
    email: '',
    years_experience: '',
    writing_focus: [],
    languages: '',
    background: '',
    portfolio_link: '',
    worked_editorial_process: null,
    willing_review_process: null,
    acknowledge_editorial_control: false,
    accept_framework: false,
  });
  const [error, setError] = useState('');
  const router = useRouter()
  
  const loadLiteraryProfile = async () => {
    try {
      setLoading(true)
      const res = await api.readLiteraryProfile();
      if(res.data) {
        setFormData(prev => ({
          ...prev,
          ...res.data,
          languages: Array.isArray(res.data.languages) ? res.data.languages.join(', ') : res.data.languages
        }));
        setStatus(res.data.profile_status || "");
      }
    } catch (err: any) {
      if(err.response?.status !== 404) {
         console.error(err);
      }
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    loadLiteraryProfile();
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDeleteProfile = async (e: any) => {
    e.preventDefault();
    try {
      const res = await api.deleteLiteraryProfile();
      alert(res.data?.message || "Profile deleted");
      window.location.reload();
    } catch (err) {
      console.error(err)
    }
  }

  const handleUpdateProfile = async (e: any) => {
    e.preventDefault()
    const payload = {
      ...formData,
      languages: 
         typeof formData.languages === 'string'
          ? formData.languages.split(',').map(lang => lang.trim()).filter(Boolean)
          : formData.languages
    };
    try {
      setLoading(true)
      const res = await api.updateLiteraryProfile(payload as any)
      if (res.data?.status === 401 || res.data?.status === 400) {
        router.push("/login")
      }
      alert("Literary Contributor profile Updated")
    } catch (err) {
      console.error(err)
      setError("Failed to update profile.")
    } finally {
      setLoading(false)
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleCheckboxChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      writing_focus: prev.writing_focus.includes(value)
        ? prev.writing_focus.filter(f => f !== value)
        : [...prev.writing_focus, value]
    }));
  };

  return (
    <Layout>
      <PageContainer>
        <div className="py-16">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">My Profile</h1>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-4 mb-8 border-b border-neutral-800">
              <button
                onClick={() => setActiveTab('submissions')}
                className={`pb-4 px-4 font-semibold transition-colors relative ${activeTab === 'submissions'
                  ? 'text-white'
                  : 'text-neutral-400 hover:text-neutral-300'
                  }`}
              >
                <FileText className="w-5 h-5 inline-block mr-2" />
                Profile
                {activeTab === 'submissions' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`pb-4 px-4 font-semibold transition-colors relative ${activeTab === 'notifications'
                  ? 'text-white'
                  : 'text-neutral-400 hover:text-neutral-300'
                  }`}
              >
                <Bell className="w-5 h-5 inline-block mr-2" />
                Notifications
                {unreadCount > 0 && (
                  <span className="ml-2 px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                    {unreadCount}
                  </span>
                )}
                {activeTab === 'notifications' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"></div>
                )}
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                <p className="mt-4 text-neutral-400">Loading your Profile...</p>
              </div>
            ) : (
              <>
                {/* Submissions Tab */}
                {activeTab === 'submissions' && (
                  <div className="space-y-4">
                    {!formData.email && !status ? (
                      <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-12 text-center">
                        <FileText className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">No Profile yet</h3>
                        <p className="text-neutral-400 mb-4">
                          Your profile will appear here once you apply or submit form.
                        </p>
                      </div>
                    ) : (
                      <form className="bg-neutral-950/50 border border-neutral-800/50 rounded p-8">
                        <div className="flex items-center gap-4 mb-6">
                          <h3 className="text-lg font-semibold text-white">Literary Contributor Profile</h3>
                          {status && <div className="bg-yellow-400 capitalize text-black rounded-lg px-4 py-2">{status.replace(/_/g, " ")}</div>}
                        </div>
                        {error && (
                          <div className="mb-6 p-4 bg-red-900/20 border border-red-800/50 rounded">
                            <p className="text-red-400 text-sm">{error}</p>
                          </div>
                        )}

                        <div className="grid md:grid-cols-2 gap-8">
                          <div className="space-y-5">
                            <div>
                              <h4 className="text-sm font-medium text-white mb-4">Identity & Background</h4>

                              <div className="space-y-4">
                                <div>
                                  <label className="block text-neutral-400 text-xs mb-1.5">Full Name</label>
                                  <input
                                    type="text"
                                    required
                                    value={formData.full_name}
                                    onChange={e => setFormData({ ...formData, full_name: DOMPurify.sanitize(e.target.value) })}
                                    className="form-input w-full bg-neutral-900/50 rounded px-3 py-2 text-white text-sm"
                                  />
                                </div>

                                <div>
                                  <label className="block text-neutral-400 text-xs mb-1.5">Professional Name (if applicable)</label>
                                  <input
                                    type="text"
                                    value={formData.professional_name}
                                    onChange={e => setFormData({ ...formData, professional_name: DOMPurify.sanitize(e.target.value) })}
                                    className="form-input w-full bg-neutral-900/50 rounded px-3 py-2 text-white text-sm"
                                  />
                                </div>

                                <div>
                                  <label className="block text-neutral-400 text-xs mb-1.5">Country</label>
                                  <select
                                    required
                                    value={formData.country}
                                    onChange={e => setFormData({ ...formData, country: e.target.value })}
                                    className="form-input w-full bg-neutral-900/50 rounded px-3 py-2 text-white text-sm"
                                  >
                                    <option value="">Select country</option>
                                    <option value="USA">USA</option>
                                    <option value="Canada">Canada</option>
                                    <option value="UAE">UAE</option>
                                    <option value="India">India</option>
                                    <option value="Pakistan">Pakistan</option>
                                    <option value="UK">UK</option>
                                    <option value="Other">Other</option>
                                  </select>
                                </div>

                                <div>
                                  <label className="block text-neutral-400 text-xs mb-1.5">City</label>
                                  <input
                                    type="text"
                                    required
                                    value={formData.city}
                                    onChange={e => setFormData({ ...formData, city: DOMPurify.sanitize(e.target.value) })}
                                    className="form-input w-full bg-neutral-900/50 rounded px-3 py-2 text-white text-sm"
                                  />
                                </div>

                                <div>
                                  <label className="block text-neutral-400 text-xs mb-1.5">Email Address</label>
                                  <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="form-input w-full bg-neutral-900/50 rounded px-3 py-2 text-white text-sm"
                                  />
                                </div>

                                <div>
                                  <label className="block text-neutral-400 text-xs mb-1.5">Years of Writing Experience</label>
                                  <select
                                    required
                                    value={formData.years_experience}
                                    onChange={e => setFormData({ ...formData, years_experience: e.target.value })}
                                    className="form-input w-full bg-neutral-900/50 rounded px-3 py-2 text-white text-sm"
                                  >
                                    <option value="">Select experience</option>
                                    <option value="0-2">0–2</option>
                                    <option value="2-5">2–5</option>
                                    <option value="5-10">5–10</option>
                                    <option value="10+">10+</option>
                                  </select>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h4 className="text-sm font-medium text-white mb-4">Literary Competence</h4>

                              <div className="space-y-4">
                                <div>
                                  <label className="block text-neutral-400 text-xs mb-2">Primary Writing Focus</label>
                                  <div className="space-y-2">
                                    {[
                                      'Spiritual essays',
                                      'Philosophical discourse',
                                      'Sufi thought analysis',
                                      'Contemporary reflection',
                                      'Thematic commentary',
                                      'Historical contextualization'
                                    ].map(focus => (
                                      <label key={focus} className="flex items-center gap-2 text-neutral-300 text-sm">
                                        <input
                                          type="checkbox"
                                          checked={formData.writing_focus.includes(focus)}
                                          onChange={() => handleCheckboxChange(focus)}
                                          className="w-4 h-4 bg-neutral-900/50 border border-neutral-800 rounded"
                                        />
                                        {focus}
                                      </label>
                                    ))}
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-neutral-400 text-xs mb-1.5">Primary Languages</label>
                                  <input
                                    type="text"
                                    required
                                    value={formData.languages as string}
                                    onChange={e => setFormData({ ...formData, languages: DOMPurify.sanitize(e.target.value) })}
                                    placeholder="e.g., English, Urdu, Arabic"
                                    className="form-input w-full bg-neutral-900/50 rounded px-3 py-2 text-white text-sm"
                                  />
                                </div>

                                <div>
                                  <label className="block text-neutral-400 text-xs mb-1.5">Academic or Literary Background</label>
                                  <textarea
                                    required
                                    rows={4}
                                    value={formData.background}
                                    onChange={e => setFormData({ ...formData, background: DOMPurify.sanitize(e.target.value) })}
                                    placeholder="Brief overview of education, training, or literary experience"
                                    className="form-input w-full bg-neutral-900/50 rounded px-3 py-2 text-white text-sm resize-none"
                                  />
                                </div>

                                <div>
                                  <label className="block text-neutral-400 text-xs mb-1.5">Portfolio or Published Work Link (optional)</label>
                                  <input
                                    type="url"
                                    value={formData.portfolio_link}
                                    onChange={e => setFormData({ ...formData, portfolio_link: e.target.value })}
                                    className="form-input w-full bg-neutral-900/50 rounded px-3 py-2 text-white text-sm"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-5">
                            <div>
                              <h4 className="text-sm font-medium text-white mb-4">Editorial Alignment</h4>

                              <div className="space-y-4">
                                <div>
                                  <label className="block text-neutral-400 text-xs mb-2">
                                    Have you worked with editorial review processes before?
                                  </label>
                                  <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-neutral-300 text-sm">
                                      <input
                                        type="radio"
                                        name="editorialExperience"
                                        required
                                        checked={formData.worked_editorial_process === true}
                                        onChange={() => setFormData({ ...formData, worked_editorial_process: true })}
                                        className="w-4 h-4"
                                      />
                                      Yes
                                    </label>
                                    <label className="flex items-center gap-2 text-neutral-300 text-sm">
                                      <input
                                        type="radio"
                                        name="editorialExperience"
                                        required
                                        checked={formData.worked_editorial_process === false}
                                        onChange={() => setFormData({ ...formData, worked_editorial_process: false })}
                                        className="w-4 h-4"
                                      />
                                      No
                                    </label>
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-neutral-400 text-xs mb-2">
                                    Are you willing to participate in a structured review and revision process?
                                  </label>
                                  <label className="flex items-center gap-2 text-neutral-300 text-sm">
                                    <input
                                      type="checkbox"
                                      required
                                      checked={formData.willing_review_process === true}
                                      onChange={e => setFormData({ ...formData, willing_review_process: e.target.checked ? true : null })}
                                      className="w-4 h-4 bg-neutral-900/50 border border-neutral-800 rounded"
                                    />
                                      Yes
                                  </label>
                                </div>

                                <div>
                                  <label className="block text-neutral-400 text-xs mb-2">
                                    Do you acknowledge that publication decisions remain under editorial authority?
                                  </label>
                                  <label className="flex items-center gap-2 text-neutral-300 text-sm">
                                    <input
                                      type="checkbox"
                                      required
                                      checked={formData.acknowledge_editorial_control}
                                      onChange={e => setFormData({ ...formData, acknowledge_editorial_control: e.target.checked })}
                                      className="w-4 h-4 bg-neutral-900/50 border border-neutral-800 rounded"
                                    />
                                    Yes
                                  </label>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h4 className="text-sm font-medium text-white mb-4">Governance Acknowledgment</h4>

                              <div className="bg-neutral-900/30 border border-neutral-800 rounded p-4 mb-4">
                                <div className="space-y-2 text-neutral-300 text-xs leading-relaxed">
                                  <p>Literary Contributors operate within an editorial review framework.</p>
                                  <p>Submissions undergo structured evaluation and revision cycles.</p>
                                  <p>All publications require formal editorial clearance and institutional alignment.</p>
                                </div>
                              </div>

                              <label className="flex items-start gap-2 text-neutral-300 text-sm">
                                <input
                                  type="checkbox"
                                  required
                                  checked={formData.accept_framework}
                                  onChange={e => setFormData({ ...formData, accept_framework: e.target.checked })}
                                  className="w-4 h-4 bg-neutral-900/50 border border-neutral-800 rounded mt-0.5 shrink-0"
                                />
                                <span>I acknowledge and accept the institutional editorial framework.</span>
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="mt-8 flex justify-end gap-3">
                          <button
                            onClick={handleDeleteProfile}
                            className="px-8 py-2.5 text-amber-400 hover:bg-amber-500 hover:text-black border-amber-400 border font-medium text-sm rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {loading ? <Loader className='animate-spin' /> : 'Delete Profile'}
                          </button>
                          <button
                            onClick={handleUpdateProfile}
                            disabled={!formData.accept_framework || !formData.acknowledge_editorial_control}
                            className="px-8 py-2.5 bg-amber-400 hover:bg-amber-500 text-neutral-950 font-medium text-sm rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                          >
                            {loading && <Loader className="w-4 h-4 animate-spin" />}
                            {loading ? 'Saving...' : 'Save Changes'}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                  <div className="space-y-4">
                    {notifications.length === 0 ? (
                      <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-12 text-center">
                        <Bell className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">No notifications</h3>
                        <p className="text-neutral-400">
                          You will receive notifications here when there are updates to your submissions.
                        </p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`bg-neutral-900/50 border rounded-lg p-6 transition-colors ${notification.read
                            ? 'border-neutral-800'
                            : 'border-blue-500/30 bg-blue-500/5'
                            }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold text-white">
                                  {notification.title}
                                </h3>
                                {!notification.read && (
                                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                )}
                              </div>
                              {notification.submission_reference && (
                                <p className="text-xs text-neutral-500 mb-2">
                                  {notification.submission_reference}
                                </p>
                              )}
                            </div>
                            <span className="text-sm text-neutral-400 whitespace-nowrap ml-4">
                              {formatDate(notification.created_at)}
                            </span>
                          </div>

                          <p className="text-neutral-300 mb-4">{notification.message}</p>

                          <div className="flex gap-3">
                            {notification.action_url && (
                              <a
                                href={notification.action_url}
                                className="px-4 py-2 bg-white text-black font-semibold rounded hover:bg-neutral-200 transition-colors text-sm"
                              >
                                View Details
                              </a>
                            )}
                            {!notification.read && (
                              <button
                                className="px-4 py-2 border border-neutral-700 text-neutral-300 font-semibold rounded hover:bg-neutral-800 transition-colors text-sm"
                              >
                                Mark as Read
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </PageContainer>
    </Layout>
  );
}
