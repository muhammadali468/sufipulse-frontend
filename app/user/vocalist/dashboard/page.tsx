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
import RichTextEditor from "../../../components/ui/RichTextEditor"
// import { BtnBold, BtnClearFormatting, BtnItalic, Editor, EditorProvider, Toolbar } from 'react-simple-wysiwyg';
import Editor, {
  EditorProvider,
} from "react-simple-wysiwyg";
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

export interface Sada {
  title: string;
  user_id: string;
  id: string;
  vocalist_id: string;
  status: string;
  language: string;
  performance_style: string;
  link: string;
  revision_notes?: string;
  created_at?: any;
  updated_at?: any;
}

export default function UserDashboard() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  // const [loading, setLoading] = useState(false);
  const { user, profileStatus } = useAuth();
  const [activeTab, setActiveTab] = useState<'submissions' | 'notifications' | 'archives'>('submissions');
  const [status, setStatus] = useState("")
  const [contentModal, setContentModal] = useState(false)
  const [error, setError] = useState('');
  const router = useRouter()

  const [vocalist, setVocalist] = useState({
    languages_performed: [],
    performance_styles: [],
  })
  const [sada, setSada] = useState<Sada | null>(null)
  const [sadas, setSadas] = useState<Sada[]>([])
  const [editingSada, setEditingSada] = useState<Sada | null>(null)
  const [loading, setLoading] = useState(false)
  const [sadaUnderDraft, setSadaUnderDraft] = useState({
    title: "",
    link: "",
    performance_style: "",
    language: "",
  })
   const loadVocalistSadas = async () => {
      try {
        const res = await api.getUserAllSadas();
        setSadas(res.data)
        console.log("Sadas fetched!", sadas)
      } catch (error) {
        console.log(error)
      }
    }
  const loadVocalistProfile = async () => {
    try {
      setLoading(true)
      const res = await api.readVocalistProfile();
      console.log(res)
      setStatus(res.data.status)
      setVocalist({
        languages_performed: res.data.languages_performed,
        performance_styles: res.data.performance_styles
      })
    } catch (error) {
      console.log(error)
    } finally{
      setLoading(false)
    }
  }
  useEffect(() => {
    loadVocalistProfile()
    loadVocalistSadas()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this Sada?")) return;

    try {
      await api.deleteSada(id);
      alert("Sada deleted");
    } catch (err: any) {
      alert(err.response?.data?.error || err.message);
    }
  };

  const handleEdit = (sada: Sada) => {
    setEditingSada(sada);
    setSadaUnderDraft({
      title: sada.title,
      link: sada.link,
      performance_style: sada.performance_style,
      language: sada.language,
    });

    setActiveTab("submissions");
  };

  const handleShowContent = (sada: any) => {
    setSada(sada)
    setContentModal(true)
    // console.log(showContent)
  }

  const handleUpdateStatus = async (sada: Sada, status: string) => {
    if (!sada) return;

    try {
      await api.updateSadaStatus(
        sada.id,
        status,
      );

      alert("Status updated");

      setSada(null);
      setContentModal(false);

      loadVocalistProfile(); // refresh table
    } catch (err: any) {
      alert(err.response?.data?.error || err.message);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {

      if (editingSada) {
        await api.updateSada(editingSada.id, sadaUnderDraft);
        alert("Sada updated!");
        setEditingSada(null);
      } else {
        await api.createSada(sadaUnderDraft);
        alert("Sada submitted!");
      }

      loadVocalistProfile();
      setActiveTab("archives");

    } catch (err: any) {
      alert(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setSadaUnderDraft(prev => ({
      ...prev,
      [name]: value
    }))

  }
  return (
    <Layout>
      <PageContainer>
        {loading ? 
        <Loader className="animate-spin" /> :
        <div className="py-16">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">My Dashboard</h1>
              <p className="text-neutral-400">
                Track your submissions and view notifications
              </p>
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
                My Submissions
                {activeTab === 'submissions' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"></div>
                )}
              </button>
              {/* <button
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
              </button> */}
              <button
                onClick={() => setActiveTab('archives')}
                className={`pb-4 px-4 font-semibold transition-colors relative ${activeTab === 'archives'
                  ? 'text-white'
                  : 'text-neutral-400 hover:text-neutral-300'
                  }`}
              >
                {/* <Bell className="w-5 h-5 inline-block mr-2" /> */}
                <FileText className="w-5 h-5 inline-block mr-2" />
                Archives

              </button>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                <p className="mt-4 text-neutral-400">Loading your dashboard...</p>
              </div>
            ) : (
              <>
                {/* Submissions Tab */}
                {activeTab === 'submissions' && (
                  <div className="space-y-4">

                    {status !== "approved" && false ? (
                      <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-12 text-center">
                        <FileText className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">Your Writer Profile hasn't approved yet</h3>
                        <p className="text-neutral-400">
                          You can submit your kalam once your profile is approved.
                        </p>
                      </div>
                    ) : (
                      <div>
                        {/* <RichTextEditor /> */}
                        <div className='mb-4'>
                          <div className="flex gap-4 mb-4">
                            <div>
                              <label className="block text-neutral-400 text-xs mb-2">Vocalist Singing Style</label>
                              <div className="space-y-2">
                                {vocalist.performance_styles.map(style => (
                                  <label key={style} className="flex items-center gap-2 text-neutral-300 text-sm">
                                    <input
                                      type="radio"
                                      value={style}
                                      checked={sadaUnderDraft.performance_style === style}
                                      onChange={(e) =>
                                        setSadaUnderDraft({ ...sadaUnderDraft, performance_style: e.target.value })
                                      }
                                      className="w-4 h-4 bg-neutral-900/50 border border-neutral-800 rounded"
                                    />
                                    {style}
                                  </label>
                                ))}
                              </div>
                            </div>
                            {vocalist.languages_performed.length > 0 ?
                              <div>
                                <label className="block text-neutral-400 text-xs mb-2">Kalam Language</label>
                                <div className="space-y-2">
                                  {vocalist.languages_performed.map(language => (
                                    <label key={language} className="flex items-center gap-2 text-neutral-300 text-sm">
                                      <input
                                        type="radio"
                                        value={language}
                                        checked={sadaUnderDraft.language === language}
                                        onChange={(e) =>
                                          setSadaUnderDraft({ ...sadaUnderDraft, language: e.target.value })
                                        }
                                        className="lowercase! w-4 h-4 bg-neutral-900/50 border border-neutral-800 rounded"
                                      />
                                      {language}
                                    </label>
                                  ))}
                                </div>
                              </div> : ""}
                          </div>
                          <label className="block text-sm font-semibold text-[var(--color-text-primary)]! mb-2">
                            Sada Title <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            name='title'
                            value={sadaUnderDraft.title}
                            onChange={handleChange}
                            maxLength={100}
                            className="form-input w-full px-4 py-3 rounded-lg bg-[var(--color-surface)] text-[var(--color-text-primary)]"
                            placeholder="The name you wish to your sada to be called"
                          />
                        </div>
                        {/* <EditorProvider>
                          <Editor name='content' className='border border-white!' value={kalamUnderDraft.content} onChange={handleChange}
                            style={{ minHeight: "300px", maxHeight: "600px", overflowY: "auto" }}
                          >
                          </Editor>
                        </EditorProvider> */}
                        <label className="block text-sm font-semibold text-[var(--color-text-primary)]! mb-2">
                            Sada Link <span className="text-red-500">*</span>
                          </label>
                        <input
                          type="url"
                          required
                          name='link'
                          value={sadaUnderDraft.link}
                          onChange={handleChange}
                          maxLength={100}
                          className="form-input w-full px-4 py-3 rounded-lg bg-[var(--color-surface)] text-[var(--color-text-primary)]"
                          placeholder="The name you wish to your sada to be called"
                        />
                        <div className="flex w-full justify-end">
                          <button className='bg-yellow-400 text-black px-4 py-2 rounded-lg mt-4' onClick={handleSubmit}>
                            {loading ? <Loader className='animate' /> : "Save & Submit"}
                          </button>
                        </div>
                        {/* <button onClick={handleSubmitKalam}>Save</button> */}
                      </div>
                    )}
                  </div>
                )}

                {/* Archive Tab */}

                {contentModal && sada ?
                  <div className="dashboard-modal-overlay">
                    <div className="dashboard-modal">
                      <div className="dashboard-modal-header">
                        <div className="flex items-center justify-between">
                          <h2 className="text-2xl font-bold text-[var(--dash-text-primary)]">Sada Review</h2>
                          <button
                            onClick={() => {
                              // setSelectedKalam(null);
                              // setReviewNotes('');
                              setContentModal(false)
                            }}
                            className="text-[var(--dash-text-muted)] hover:text-[var(--dash-text-secondary)]"
                          >
                            <XCircle className="w-6 h-6" />
                          </button>
                        </div>
                      </div>

                      <div className="dashboard-modal-body overflow-y-scroll scrollbar-hide">
                        <div className="space-y-4">

                          {sada.revision_notes ?
                            <div>
                              <label className="dashboard-label">
                                Admin Notes
                              </label>
                              <div className="bg-red-600 rounded p-4 max-h-60 overflow-y-auto border border-[var(--dash-border)]">
                                <p className="text-[var(--dash-text-primary)] font-arabic text-lg leading-relaxed">
                                  {sada.revision_notes}
                                </p>
                              </div>
                            </div>
                            : ""}
                          <div>
                            <label className="dashboard-label">
                              Title
                            </label>
                            <div className="bg-[var(--dash-bg-primary)] rounded p-4 max-h-60 overflow-y-auto border border-[var(--dash-border)]">
                              <p className="text-[var(--dash-text-primary)] font-arabic text-lg leading-relaxed">
                                {sada.title}
                              </p>
                            </div>
                          </div>
                          <div>
                            <label className="dashboard-label">
                              Link
                            </label>
                            <div className="bg-[var(--dash-bg-primary)] rounded p-4 max-h-60 overflow-y-auto border border-[var(--dash-border)]">
                              <p className="text-[var(--dash-text-primary)] font-arabic text-lg leading-relaxed">
                                {sada.link}
                              </p>
                            </div>
                          </div>

                        </div>
                      </div>

                      <div className="dashboard-modal-footer">
                        <button
                          disabled={sada.status !== "draft"}
                          onClick={() => handleUpdateStatus(sada, 'under review')}
                          className="flex-1 disabled:opacity-50 bg-[var(--dash-status-approved)] hover:opacity-90 text-white rounded-lg px-4 py-3 transition-opacity flex items-center justify-center gap-2 font-medium"
                        >
                          {sada.status === "draft" ? <CheckCircle className="w-5 h-5" /> : ""}
                          {sada.status === "draft" ? "Submit Kalam" : sada.status === "under review" ? "Under Review" : "Submitted"}
                        </button>
                        <button
                          disabled={sada.status !== "draft"}
                          onClick={() => {
                            handleDelete(sada.id)
                          }}
                          className="flex-1 disabled:opacity-50 dashboard-btn-danger flex items-center justify-center gap-2"
                        >
                          <XCircle className="w-5 h-5" />
                          Delete Kalam
                        </button>
                      </div>
                    </div>
                  </div>
                  : ""}

                {activeTab === 'archives' && vocalist.languages_performed.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200">
                      <thead className="">
                        <tr>
                          <th className="p-3 border">ID</th>
                          <th className="p-3 border">Title</th>
                          {/* <th className="p-3 border">User ID</th> */}
                          {/* <th className="p-3 border">Writer ID</th> */}
                          <th className="p-3 border">Language</th>
                          <th className="p-3 border">Writing Style</th>
                          <th className="p-3 border">Status</th>
                          <th className="p-3 border">Content</th>
                        </tr>
                      </thead>

                      <tbody>
                        {sadas.map((sada: Sada) => (
                            <tr key={sada.id} className="text-center">
                              <td className="p-3 border">{sada.id}</td>
                              <td className="p-3 border">{sada.title}</td>
                              <td className="p-3 border">{sada.language}</td>
                              <td className="p-3 border">{sada.performance_style}</td>
                              <td className="p-3 border capitalize">{sada.status}</td>
                              <td className="p-3 border flex gap-3 justify-center">
                                <button
                                  onClick={() => handleShowContent(sada)}
                                  className="bg-blue-500 text-black rounded-lg px-4 py-2"
                                >
                                  View
                                </button>

                                <button
                                  onClick={() => handleEdit(sada)}
                                  className="bg-yellow-500 text-black rounded-lg px-4 py-2"
                                >
                                  Edit
                                </button>
                              </td>
                            </tr>
                        
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}

          </div>
        </div>}
      </PageContainer>
    </Layout>
  );
}
