"use client";
import { useEffect, useState } from 'react';
import DOMPurify from "dompurify";
import { Layout } from '../../../components/layout/Layout';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Bell, FileText, Clock, CheckCircle, XCircle, AlertCircle, Eye, Loader } from 'lucide-react';
import * as api from "../../../api/auth"
import { useAuth } from '@/app/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { VocalistProfileType } from '@/app/types/vocalist.types';
import { WriterFormData } from '@/app/types/writer.types';

interface Submission {
  id: string;
  submission_reference: string;
  submission_type: string;
  current_status: string;
  submitter_name: string;
  submission_data: any;
  created_at: string;
  status_updated_at: string;
  admin_notes?: string;
}

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
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'submissions' | 'notifications'>('submissions');
  const [status, setStatus] = useState("")
  // const [writerProfile,setWriterProfile] = useState()
  const [formData, setFormData] = useState<WriterFormData>({
    full_name: "",
    pen_name: "",
    country: "",
    city: "",
    email: "",
    years_experience: "",
    primary_languages: [],
    writing_styles: [],
    literary_background: "",
    thematic_focus: "",
    sample_kalam: "",
    previous_publications: "",
    editorial_review_experience: false,
    willing_editorial_process: false,
    revision_acknowledged: false,
    institutional_acknowledged: false,

  });
  const [vocalist, setVocalist] = useState<VocalistProfileType>({
    full_name: '',
    performance_name: '',
    country: '',
    city: '',
    email: '',
    years_experience: '',
    vocal_range: '',
    performance_styles: [],
    languages_performed: '',
    musical_training: '',
    sample_link: '',
    worked_in_studio: null,
    willing_editorial_approval: null,
    accept_producer_coordination: false,
    accept_framework: false,
  });
  const [error, setError] = useState('');
  const router = useRouter()
  const loadWriterProfile = async () => {
    try {
      const res = await api.readWriterProfile();
      setFormData(prev => ({
        ...prev,
        ...res.data
      }))
      setStatus(res.data.profile_status)
      console.log("formData", formData)
    } catch (error) {
      console.log(formData)
      console.log(error)
    }
  }
  const loadVocalistProfile = async () => {
    try {
      const res = await api.readVocalistProfile();

      setVocalist(prev => ({
        ...prev,
        ...res.data
      }));

      setStatus(res.data.profile_status);

      console.log("vocalist", res.data);

    } catch (error) {
      console.log(formData);
      console.log(error);
    }
  };
  useEffect(() => {

    loadVocalistProfile();
    loadWriterProfile()
    console.log(formData)
  }, [])
  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'approved' || statusLower === 'published') return 'text-green-400';
    if (statusLower === 'rejected' || statusLower === 'declined') return 'text-red-400';
    if (statusLower === 'under_review') return 'text-blue-400';
    if (statusLower === 'revision_requested') return 'text-yellow-400';
    return 'text-neutral-400';
  };

  const getStatusIcon = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'approved' || statusLower === 'published') return <CheckCircle className="w-5 h-5" />;
    if (statusLower === 'rejected' || statusLower === 'declined') return <XCircle className="w-5 h-5" />;
    if (statusLower === 'under_review') return <Eye className="w-5 h-5" />;
    if (statusLower === 'revision_requested') return <AlertCircle className="w-5 h-5" />;
    return <Clock className="w-5 h-5" />;
  };

  const formatSubmissionType = (type: string) => {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDeleteProfile = async () => {
    try {
      const res = await api.deleteWriterProfile();
      alert(res.data.message)
      loadWriterProfile()
    } catch (error) {
      console.log(error)
    }
  }

    const handleDeleteVocalistProfile = async () => {
    try {
      const res = await api.deleteVocalistProfile();
      alert(res.data.message)
      loadVocalistProfile()
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    // const payload = {
    //   ...formData,
    //   primary_languages: formData.primary_languages ? formData.primary_languages.trim().split(/[,\s]+/).filter(Boolean) : [] // split by space
    // };
    const payload = {
      ...vocalist,
      primary_languages:
        formData.primary_languages && formData.primary_languages.length > 0
          ? String(formData.primary_languages).trim().split(/[,\s]+/).filter(Boolean)
          : []
    };
    try {
      setLoading(true)
      const res = await api.updateWriterProfile(payload)
      if (res.data.status === 401 || res.data.status === 400) {
        router.push("/login")
      }
      alert("Writer profile Updated")
      setLoading(false)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateVocalistProfile = async (e: any) => {
    e.preventDefault()
    const payload = {
      ...vocalist,
      languages_performed: vocalist.languages_performed
    ? vocalist.languages_performed.trim().split(/[,\s]+/).filter(Boolean)
    : [] // split by space
    };
    try {
      setLoading(true)
      const res = await api.updateVocalistProfile(payload)
      if (res.data.status === 401 || res.data.status === 400) {
        router.push("/login")
      }
      alert("Vocalist profile Updated")
      setLoading(false)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length;
  const handleCheckboxChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      writing_styles: prev.writing_styles.includes(value)
        ? prev.writing_styles.filter(s => s !== value)
        : [...prev.writing_styles, value]
    }));
  };
    const handleVocalistCheckboxChange = (value: string) => {
    setVocalist(prev => ({
      ...prev,
      performance_styles: prev.performance_styles.includes(value)
        ? prev.performance_styles.filter(s => s !== value)
        : [...prev.performance_styles, value]
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
                    {formData.email === "" ? (
                      <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-12 text-center">
                        <FileText className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">No Profile yet</h3>
                        <p className="text-neutral-400 mb-4">
                          Your profile will appear here once you apply or submit form.
                        </p>
                        {/* <Link className='bg-amber-400 text-black! px-4 py-2 rounded-lg' href={"/writers/#submission"}>
                          Submit Profile
                        </Link> */}

                      </div>
                    ) : (
                      <form className="bg-neutral-950/50 border border-neutral-800/50 rounded p-8">
                        <div className="flex items-center gap-4 mb-6">
                          <h3 className="text-lg font-semibold text-white">Writer Profile Status</h3>
                          <div className="bg-yellow-400 capitalize text-black rounded-lg px-4 py-2">{status}</div>
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
                                    maxLength={200}
                                    value={formData.full_name}
                                    onChange={e => setFormData({ ...formData, full_name: DOMPurify.sanitize(e.target.value) })}
                                    className="form-input w-full bg-neutral-900/50 rounded px-3 py-2 text-white text-sm"
                                  />
                                </div>

                                <div>
                                  <label className="block text-neutral-400 text-xs mb-1.5">Pen Name (if applicable)</label>
                                  <input
                                    type="text"
                                    maxLength={200}
                                    value={formData.pen_name}
                                    onChange={e => setFormData({ ...formData, pen_name: DOMPurify.sanitize(e.target.value) })}
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
                                    maxLength={200}
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
                                  <label className="block text-neutral-400 text-xs mb-1.5">Primary Writing Languages</label>
                                  <input
                                    type="text"
                                    required
                                    maxLength={500}
                                    value={formData.primary_languages}
                                    onChange={e => setFormData({ ...formData, primary_languages: DOMPurify.sanitize(e.target.value) })}
                                    placeholder="e.g., Urdu, Arabic, Persian, English"
                                    className="form-input w-full bg-neutral-900/50 rounded px-3 py-2 text-white text-sm"
                                  />
                                </div>

                                <div>
                                  <label className="block text-neutral-400 text-xs mb-2">Writing Style & Form</label>
                                  <div className="space-y-2">
                                    {[
                                      'Classical Ghazal',
                                      'Nazm',
                                      'Qasida',
                                      'Hamd & Naat',
                                      'Contemporary devotional',
                                      'Free verse'
                                    ].map(style => (
                                      <label key={style} className="flex items-center gap-2 text-neutral-300 text-sm">
                                        <input
                                          type="checkbox"
                                          checked={formData.writing_styles?.includes(style)}
                                          onChange={() => handleCheckboxChange(style)}
                                          className="w-4 h-4 bg-neutral-900/50 border border-neutral-800 rounded"
                                        />
                                        {style}
                                      </label>
                                    ))}
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-neutral-400 text-xs mb-1.5">Literary Background</label>
                                  <textarea
                                    required
                                    rows={4}
                                    maxLength={2000}
                                    value={formData.literary_background}
                                    onChange={e => setFormData({ ...formData, literary_background: DOMPurify.sanitize(e.target.value) })}
                                    placeholder="Brief overview of literary training, influences, or formal education"
                                    className="form-input w-full bg-neutral-900/50 rounded px-3 py-2 text-white text-sm resize-none"
                                  />
                                </div>

                                <div>
                                  <label className="block text-neutral-400 text-xs mb-1.5">Thematic Focus</label>
                                  <textarea
                                    required
                                    rows={3}
                                    maxLength={1000}
                                    value={formData.thematic_focus}
                                    onChange={e => setFormData({ ...formData, thematic_focus: DOMPurify.sanitize(e.target.value) })}
                                    placeholder="Core themes you explore in your writing"
                                    className="form-input w-full bg-neutral-900/50 rounded px-3 py-2 text-white text-sm resize-none"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-5">
                            <div>
                              <h4 className="text-sm font-medium text-white mb-4">Sample Work & Publications</h4>

                              <div className="space-y-4">
                                <div>
                                  <label className="block text-neutral-400 text-xs mb-1.5">Sample Kalam</label>
                                  <textarea
                                    required
                                    rows={8}
                                    maxLength={10000}
                                    value={formData.sample_kalam}
                                    onChange={e => setFormData({ ...formData, sample_kalam: DOMPurify.sanitize(e.target.value) })}
                                    placeholder="Paste original kalam (must be unpublished work)"
                                    className="form-input w-full bg-neutral-900/50 rounded px-3 py-2 text-white text-sm resize-none font-mono"
                                  />
                                </div>

                                <div>
                                  <label className="block text-neutral-400 text-xs mb-1.5">Previous Publications (optional)</label>
                                  <textarea
                                    rows={3}
                                    maxLength={2000}
                                    value={formData.previous_publications}
                                    onChange={e => setFormData({ ...formData, previous_publications: DOMPurify.sanitize(e.target.value) })}
                                    placeholder="List any published works or credentials"
                                    className="form-input w-full bg-neutral-900/50 rounded px-3 py-2 text-white text-sm resize-none"
                                  />
                                </div>
                              </div>
                            </div>

                            <div>
                              <h4 className="text-sm font-medium text-white mb-4">Workflow Alignment</h4>

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
                                        checked={formData.willing_editorial_process === true}
                                        onChange={() => setFormData({ ...formData, willing_editorial_process: true })}
                                        className="w-4 h-4"
                                      />
                                      Yes
                                    </label>
                                    <label className="flex items-center gap-2 text-neutral-300 text-sm">
                                      <input
                                        type="radio"
                                        name="editorialExperience"
                                        required
                                        checked={formData.editorial_review_experience === false}
                                        onChange={() => setFormData({ ...formData, editorial_review_experience: false })}
                                        className="w-4 h-4"
                                      />
                                      No
                                    </label>
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-neutral-400 text-xs mb-2">
                                    Are you willing to participate in the structured editorial process?
                                  </label>
                                  <label className="flex items-center gap-2 text-neutral-300 text-sm">
                                    <input
                                      type="checkbox"
                                      required
                                      checked={formData.willing_editorial_process === true}
                                      onChange={e => setFormData({ ...formData, willing_editorial_process: e.target.checked ? true : false })}
                                      className="w-4 h-4 bg-neutral-900/50 border border-neutral-800 rounded"
                                    />
                                    Yes
                                  </label>
                                </div>

                                <div>
                                  <label className="block text-neutral-400 text-xs mb-2">
                                    Do you acknowledge that submitted kalam may require revision before approval?
                                  </label>
                                  <label className="flex items-center gap-2 text-neutral-300 text-sm">
                                    <input
                                      type="checkbox"
                                      required
                                      checked={formData.revision_acknowledged}
                                      onChange={e => setFormData({ ...formData, revision_acknowledged: e.target.checked })}
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
                                  <p>All kalam submissions undergo institutional editorial review.</p>
                                  <p>Writers do not independently authorize publication or production.</p>
                                  <p>Origination does not equal production clearance or registry authorization.</p>
                                </div>
                              </div>

                              <label className="flex items-start gap-2 text-neutral-300 text-sm">
                                <input
                                  type="checkbox"
                                  required
                                  checked={formData.institutional_acknowledged}
                                  onChange={e => setFormData({ ...formData, institutional_acknowledged: e.target.checked })}
                                  className="w-4 h-4 bg-neutral-900/50 border border-neutral-800 rounded mt-0.5 shrink-0"
                                />
                                <span>I acknowledge and accept the institutional editorial framework.</span>
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="mt-8 flex justify-end gap-3">
                          <button
                            // type="submit"
                            onClick={handleDeleteProfile}
                            // disabled={!user.is_verified || !formData.institutional_acknowledged || !formData.revision_acknowledged}
                            className="px-8 py-2.5 text-amber-400 hover:bg-amber-500 hover:text-black border-amber-400 border font-medium text-sm rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {loading ?
                              <Loader className='animate-spin' />
                              :
                              'Delete Profile'
                            }
                          </button>
                          <button
                            // type="submit"
                            onClick={handleSubmit}
                            // disabled={!user.is_verified || !formData.institutional_acknowledged || !formData.revision_acknowledged}
                            className="px-8 py-2.5 bg-amber-400 hover:bg-amber-500 text-neutral-950 font-medium text-sm rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {loading ?
                              <Loader className='animate-spin' />
                              :
                              'Save Changes'
                            }
                          </button>


                        </div>
                      </form>
                    )}

                    {vocalist.email === "" ? (
                      <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-12 text-center">
                        <FileText className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">No Profile yet</h3>
                        <p className="text-neutral-400 mb-4">
                          Your profile will appear here once you apply or submit form.
                        </p>
                        {/* <Link className='bg-amber-400 text-black! px-4 py-2 rounded-lg' href={"/writers/#submission"}>
                          Submit Profile
                        </Link> */}

                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="bg-neutral-950/50 border border-neutral-800/50 rounded p-8">
                        <h3 className="text-lg font-semibold text-white mb-6">Submit Vocalist Profile</h3>
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
                                    value={vocalist.full_name}
                                    onChange={e => setVocalist({ ...vocalist, full_name: DOMPurify.sanitize(e.target.value) })}
                                    className="form-input w-full bg-neutral-900/50 rounded px-3 py-2 text-white text-sm"
                                  />
                                </div>

                                <div>
                                  <label className="block text-neutral-400 text-xs mb-1.5">Performance Name (if applicable)</label>
                                  <input
                                    type="text"
                                    value={vocalist.performance_name}
                                    onChange={e => setVocalist({ ...vocalist, performance_name: DOMPurify.sanitize(e.target.value) })}
                                    className="form-input w-full bg-neutral-900/50 rounded px-3 py-2 text-white text-sm"
                                  />
                                </div>

                                <div>
                                  <label className="block text-neutral-400 text-xs mb-1.5">Country</label>
                                  <select
                                    required
                                    value={vocalist.country}
                                    onChange={e => setVocalist({ ...vocalist, country: e.target.value })}
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
                                    value={vocalist.city}
                                    onChange={e => setVocalist({ ...vocalist, city: DOMPurify.sanitize(e.target.value) })}
                                    className="form-input w-full bg-neutral-900/50 rounded px-3 py-2 text-white text-sm"
                                  />
                                </div>

                                <div>
                                  <label className="block text-neutral-400 text-xs mb-1.5">Email Address</label>
                                  <input
                                    type="email"
                                    required
                                    value={vocalist.email}
                                    onChange={e => setVocalist({ ...vocalist, email: e.target.value })}
                                    className="form-input w-full bg-neutral-900/50 rounded px-3 py-2 text-white text-sm"
                                  />
                                </div>

                                <div>
                                  <label className="block text-neutral-400 text-xs mb-1.5">Years of Vocal Performance</label>
                                  <select
                                    required
                                    value={vocalist.years_experience}
                                    onChange={e => setVocalist({ ...vocalist, years_experience: e.target.value })}
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
                              <h4 className="text-sm font-medium text-white mb-4">Vocal Competence</h4>

                              <div className="space-y-4">
                                <div>
                                  <label className="block text-neutral-400 text-xs mb-1.5">Vocal Range</label>
                                  <select
                                    required
                                    value={vocalist.vocal_range}
                                    onChange={e => setVocalist({ ...vocalist, vocal_range: e.target.value })}
                                    className="form-input w-full bg-neutral-900/50 rounded px-3 py-2 text-white text-sm"
                                  >
                                    <option value="">Select vocal range</option>
                                    <option value="soprano">Soprano</option>
                                    <option value="mezzo-soprano">Mezzo-Soprano</option>
                                    <option value="alto">Alto</option>
                                    <option value="tenor">Tenor</option>
                                    <option value="baritone">Baritone</option>
                                    <option value="bass">Bass</option>
                                    <option value="other">Other/Unsure</option>
                                  </select>
                                </div>

                                <div>
                                  <label className="block text-neutral-400 text-xs mb-2">Performance Style</label>
                                  <div className="space-y-2">
                                    {[
                                      'Classical devotional',
                                      'Qawwali',
                                      'Contemporary devotional',
                                      'Traditional hymnal',
                                      'Sufi melodic',
                                      'World fusion'
                                    ].map(style => (
                                      <label key={style} className="flex items-center gap-2 text-neutral-300 text-sm">
                                        <input
                                          type="checkbox"
                                          checked={vocalist.performance_styles.includes(style)}
                                          onChange={() => handleVocalistCheckboxChange(style)}
                                          className="w-4 h-4 bg-neutral-900/50 border border-neutral-800 rounded"
                                        />
                                        {style}
                                      </label>
                                    ))}
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-neutral-400 text-xs mb-1.5">Languages Performed</label>
                                  <input
                                    type="text"
                                    required
                                    value={vocalist.languages_performed}
                                    onChange={e => setVocalist({ ...vocalist, languages_performed: DOMPurify.sanitize(e.target.value) })}
                                    placeholder="e.g., Urdu, Arabic, Persian, English"
                                    className="form-input w-full bg-neutral-900/50 rounded px-3 py-2 text-white text-sm"
                                  />
                                </div>

                                <div>
                                  <label className="block text-neutral-400 text-xs mb-1.5">Musical Training</label>
                                  <textarea
                                    required
                                    rows={4}
                                    value={vocalist.musical_training}
                                    onChange={e => setVocalist({ ...vocalist, musical_training: DOMPurify.sanitize(e.target.value) })}
                                    placeholder="Brief overview of vocal training, teachers, or structured practice"
                                    className="form-input w-full bg-neutral-900/50 rounded px-3 py-2 text-white text-sm resize-none"
                                  />
                                </div>

                                <div>
                                  <label className="block text-neutral-400 text-xs mb-1.5">Performance Sample Link</label>
                                  <label className="block text-neutral-400 text-xs mb-1.5">Please upload the sample file on YouTube and share the link:</label>
                                  <input
                                    type="url"
                                    value={vocalist.sample_link}
                                    onChange={e => setVocalist({ ...vocalist, sample_link: e.target.value })}
                                    className="form-input w-full bg-neutral-900/50 rounded px-3 py-2 text-white text-sm"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-5">
                            <div>
                              <h4 className="text-sm font-medium text-white mb-4">Workflow Alignment</h4>

                              <div className="space-y-4">
                                <div>
                                  <label className="block text-neutral-400 text-xs mb-2">
                                    Have you worked in professional studio recording environments?
                                  </label>
                                  <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-neutral-300 text-sm">
                                      <input
                                        type="radio"
                                        name="studioExperience"
                                        required
                                        checked={vocalist.worked_in_studio === true}
                                        onChange={() => setVocalist({ ...vocalist, worked_in_studio: true })}
                                        className="w-4 h-4"
                                      />
                                      Yes
                                    </label>
                                    <label className="flex items-center gap-2 text-neutral-300 text-sm">
                                      <input
                                        type="radio"
                                        name="studioExperience"
                                        required
                                        checked={vocalist.worked_in_studio === false}
                                        onChange={() => setVocalist({ ...vocalist, worked_in_studio: false })}
                                        className="w-4 h-4"
                                      />
                                      No
                                    </label>
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-neutral-400 text-xs mb-2">
                                    Are you willing to perform assigned kalam following editorial approval?
                                  </label>
                                  <label className="flex items-center gap-2 text-neutral-300 text-sm">
                                    <input
                                      type="checkbox"
                                      required
                                      checked={vocalist.willing_editorial_approval === true}
                                      onChange={e => setVocalist({ ...vocalist, willing_editorial_approval: e.target.checked ? true : null })}
                                      className="w-4 h-4 bg-neutral-900/50 border border-neutral-800 rounded"
                                    />
                                    Yes
                                  </label>
                                </div>

                                <div>
                                  <label className="block text-neutral-400 text-xs mb-2">
                                    Do you acknowledge that vocal interpretation operates within producer and studio coordination?
                                  </label>
                                  <label className="flex items-center gap-2 text-neutral-300 text-sm">
                                    <input
                                      type="checkbox"
                                      required
                                      checked={vocalist.accept_producer_coordination}
                                      onChange={e => setVocalist({ ...vocalist, accept_producer_coordination: e.target.checked })}
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
                                  <p>Vocalists receive assigned kalam after editorial approval.</p>
                                  <p>Performance operates within producer and studio framework.</p>
                                  <p>Vocal delivery does not equal publication or registry authorization.</p>
                                </div>
                              </div>

                              <label className="flex items-start gap-2 text-neutral-300 text-sm">
                                <input
                                  type="checkbox"
                                  required
                                  checked={vocalist.accept_framework}
                                  onChange={e => setVocalist({ ...vocalist, accept_framework: e.target.checked })}
                                  className="w-4 h-4 bg-neutral-900/50 border border-neutral-800 rounded mt-0.5 shrink-0"
                                />
                                <span>I acknowledge and accept the institutional performance framework.</span>
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="mt-8 flex gap-2 justify-end">
                          <button
                            // type="submit"
                            onClick={handleDeleteVocalistProfile}
                            // disabled={!user.is_verified || !formData.institutional_acknowledged || !formData.revision_acknowledged}
                            className="px-8 py-2.5 text-amber-400 hover:bg-amber-500 hover:text-black border-amber-400 border font-medium text-sm rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {loading ?
                              <Loader className='animate-spin' />
                              :
                              'Delete Profile'
                            }
                          </button>
                           <button
                            // type="submit"
                            onClick={handleUpdateVocalistProfile}
                            disabled={!vocalist.accept_producer_coordination || !vocalist.accept_framework}
                            className="cursor-pointer px-8 py-2.5 bg-amber-400 hover:bg-amber-500 text-neutral-950 font-medium text-sm rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {loading ?
                              <Loader className='animate-spin' />
                              :
                              'Save Changes'
                            }
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
                                // onClick={() => markNotificationAsRead(notification.id)}
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
