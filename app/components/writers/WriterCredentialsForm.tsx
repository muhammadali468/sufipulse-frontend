import { useEffect, useState } from 'react';
import DOMPurify from "dompurify";
// import { DOMPurify.sanitize } from '../../lib/sanitization';
import { WriterSubmissionSuccessModal } from './WriterSubmissionSuccessModal';
// import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import Link from 'next/link';
import * as api from "../../api/auth"
import { useRouter } from 'next/navigation';
import { Loader } from 'lucide-react';

export interface WriterFormData {
  full_name: string;
  pen_name: string;
  country: string;
  city: string;
  email: string;
  years_experience: string;
  primary_languages: string | string[];
  writing_styles: string[];
  literary_background: string;
  thematic_focus: string;
  sample_kalam: string;
  previous_publications: string;
  editorial_review_experience: boolean | null;
  willing_editorial_process: boolean | null;
  revision_acknowledged: boolean;
  institutional_acknowledged: boolean;
  profile_status?:string;
  id?:string;
  created_at?:string;
}

export function WriterCredentialsForm() {
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter()
  const [loading, setLoading] = useState(false);
  const [submissionId] = useState(`SP-WRT-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`);
  const [formData, setFormData] = useState<WriterFormData>({
    full_name: user ? user.full_name : "",
    pen_name: "",
    country: "",
    city: "",
    email: user ? user.email : "",
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

  const handleCheckboxChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      writingStyle: prev.writing_styles.includes(value)
        ? prev.writing_styles.filter(s => s !== value)
        : [...prev.writing_styles, value]
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    try {
      setLoading(true)
      const res = await api.createWriterProfile(formData)
      if (res.data.status === 401 || res.data.status === 400) {
        router.push("/login")
      }
      alert("Writer profile Submitted")
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
  // useEffect(() => {
  //   const handleLoadWriterProfile = async () => {
  //     try {
  //       setLoading(true)
  //       const res = await api.readWriterProfile()
  //       if (res.data.status === 401 || res.data.status === 400) {
  //         router.push("/login")
  //       }
  //       console.log(res)
  //       alert("Writer profile Submitted")
  //     } catch (error) {
  //       console.log(error)
  //     } finally {
  //       setLoading(false)
  //     }
  //   }
  // }, [])

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError('');
  //   setSubmitting(true);

  //   try {
  //     // Get current user's public ID if authenticated
  //     let userId: string | null = null;
  //     if (user) {
  //       const { data: publicUser } = await supabase
  //         .from('users')
  //         .select('id')
  //         .eq('auth_user_id', user.id)
  //         .maybeSingle();
  //       userId = publicUser?.id || null;
  //     }

  //     // Insert application into database
  //     const { error: insertError } = await supabase
  //       .from('writer_applications')
  //       .insert({
  //         user_id: userId,
  //         email: formData.email,
  //         pen_name: formData.penName || formData.fullName,
  //         bio: `${formData.literaryBackground}\n\nThematic Focus: ${formData.thematicFocus}\n\nYears Writing: ${formData.yearsWriting}\nLanguages: ${formData.primaryLanguages}\nStyles: ${formData.writingStyle.join(', ')}`,
  //         sample_work: formData.sampleWork,
  //         previous_publications: formData.previousPublications || null,
  //         status: 'pending',
  //         submitted_at: new Date().toISOString(),
  //       });

  //     if (insertError) throw insertError;

  //     setSubmitted(true);
  //   } catch (err) {
  //     console.error('Error submitting writer application:', err);
  //     setError('Failed to submit application. Please try again.');
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };

  if (submitted) {
    return (
      <WriterSubmissionSuccessModal
        onClose={() => setSubmitted(false)}
        submissionId={submissionId}
      />
    );
  }

  return (
    <form className="bg-neutral-950/50 border border-neutral-800/50 rounded p-8">
      <h3 className="text-lg font-semibold text-white mb-6">Submit Writer Profile</h3>

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
                  // onChange={e => setFormData({ ...formData, fullName: DOMPurify.sanitize(e.target.value) })}
                  className="form-input w-full bg-neutral-900/50 rounded px-3 py-2 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-neutral-400 text-xs mb-1.5">Pen Name (if applicable)</label>
                <input
                  type="text"
                  maxLength={200}
                  value={formData.pen_name}
                  // onChange={e => setFormData({ ...formData, penName: DOMPurify.sanitize(e.target.value) })}
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
                  // onChange={e => setFormData({ ...formData, primaryLanguages: DOMPurify.sanitize(e.target.value) })}
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
                        checked={formData.writing_styles.includes(style)}
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
                  // onChange={e => setFormData({ ...formData, literaryBackground: DOMPurify.sanitize(e.target.value) })}
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
                  // onChange={e => setFormData({ ...formData, thematicFocus: DOMPurify.sanitize(e.target.value) })}
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
                  // onChange={e => setFormData({ ...formData, sampleWork: DOMPurify.sanitize(e.target.value) })}
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
                  // onChange={e => setFormData({ ...formData, previousPublications: DOMPurify.sanitize(e.target.value) })}
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

      <div className="mt-8 flex justify-end">
        {user ? <button
          // type="submit"
          onClick={handleSubmit}
          disabled={!user.is_verified || !formData.institutional_acknowledged || !formData.revision_acknowledged}
          className="px-8 py-2.5 bg-amber-400 hover:bg-amber-500 text-neutral-950 font-medium text-sm rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ?
            <Loader className='animate-spin' />
            :
            'Submit Writer Profile'
          }
        </button> :
          <Link
            className="px-8 py-2.5 bg-amber-400 hover:bg-amber-500 text-neutral-950! font-medium text-sm rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            href="/login">
            Login
          </Link>
        }
      </div>
    </form>
  );
}
