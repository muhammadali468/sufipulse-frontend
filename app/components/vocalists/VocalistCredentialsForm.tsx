import { useState } from 'react';
import { sanitizeInput } from '../../lib/sanitization';
import { VocalistSubmissionSuccessModal } from './VocalistSubmissionSuccessModal';

interface VocalistFormData {
  fullName: string;
  performanceName: string;
  country: string;
  city: string;
  email: string;
  yearsExperience: string;
  vocalRange: string;
  performanceStyle: string[];
  languagesPerformed: string;
  musicalTraining: string;
  performanceLink: string;
  studioRecordingExperience: boolean | null;
  workflowAlignment: boolean | null;
  interpretationAcknowledgment: boolean;
  frameworkAcknowledgment: boolean;
}

export function VocalistCredentialsForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submissionId] = useState(`SP-VOC-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`);
  const [formData, setFormData] = useState<VocalistFormData>({
    fullName: '',
    performanceName: '',
    country: '',
    city: '',
    email: '',
    yearsExperience: '',
    vocalRange: '',
    performanceStyle: [],
    languagesPerformed: '',
    musicalTraining: '',
    performanceLink: '',
    studioRecordingExperience: null,
    workflowAlignment: null,
    interpretationAcknowledgment: false,
    frameworkAcknowledgment: false,
  });

  const handleCheckboxChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      performanceStyle: prev.performanceStyle.includes(value)
        ? prev.performanceStyle.filter(s => s !== value)
        : [...prev.performanceStyle, value]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <VocalistSubmissionSuccessModal
        onClose={() => setSubmitted(false)}
        submissionId={submissionId}
      />
    );
  }

  return (
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
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: sanitizeInput(e.target.value) })}
                  className="form-input w-full bg-neutral-900/50 rounded px-3 py-2 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-neutral-400 text-xs mb-1.5">Performance Name (if applicable)</label>
                <input
                  type="text"
                  value={formData.performanceName}
                  onChange={e => setFormData({ ...formData, performanceName: sanitizeInput(e.target.value) })}
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
                  onChange={e => setFormData({ ...formData, city: sanitizeInput(e.target.value) })}
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
                <label className="block text-neutral-400 text-xs mb-1.5">Years of Vocal Performance</label>
                <select
                  required
                  value={formData.yearsExperience}
                  onChange={e => setFormData({ ...formData, yearsExperience: e.target.value })}
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
                  value={formData.vocalRange}
                  onChange={e => setFormData({ ...formData, vocalRange: e.target.value })}
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
                        checked={formData.performanceStyle.includes(style)}
                        onChange={() => handleCheckboxChange(style)}
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
                  value={formData.languagesPerformed}
                  onChange={e => setFormData({ ...formData, languagesPerformed: sanitizeInput(e.target.value) })}
                  placeholder="e.g., Urdu, Arabic, Persian, English"
                  className="form-input w-full bg-neutral-900/50 rounded px-3 py-2 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-neutral-400 text-xs mb-1.5">Musical Training</label>
                <textarea
                  required
                  rows={4}
                  value={formData.musicalTraining}
                  onChange={e => setFormData({ ...formData, musicalTraining: sanitizeInput(e.target.value) })}
                  placeholder="Brief overview of vocal training, teachers, or structured practice"
                  className="form-input w-full bg-neutral-900/50 rounded px-3 py-2 text-white text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-neutral-400 text-xs mb-1.5">Performance Sample Link (optional)</label>
                <input
                  type="url"
                  value={formData.performanceLink}
                  onChange={e => setFormData({ ...formData, performanceLink: e.target.value })}
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
                      checked={formData.studioRecordingExperience === true}
                      onChange={() => setFormData({ ...formData, studioRecordingExperience: true })}
                      className="w-4 h-4"
                    />
                    Yes
                  </label>
                  <label className="flex items-center gap-2 text-neutral-300 text-sm">
                    <input
                      type="radio"
                      name="studioExperience"
                      required
                      checked={formData.studioRecordingExperience === false}
                      onChange={() => setFormData({ ...formData, studioRecordingExperience: false })}
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
                    checked={formData.workflowAlignment === true}
                    onChange={e => setFormData({ ...formData, workflowAlignment: e.target.checked ? true : null })}
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
                    checked={formData.interpretationAcknowledgment}
                    onChange={e => setFormData({ ...formData, interpretationAcknowledgment: e.target.checked })}
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
                checked={formData.frameworkAcknowledgment}
                onChange={e => setFormData({ ...formData, frameworkAcknowledgment: e.target.checked })}
                className="w-4 h-4 bg-neutral-900/50 border border-neutral-800 rounded mt-0.5 shrink-0"
              />
              <span>I acknowledge and accept the institutional performance framework.</span>
            </label>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          className="px-8 py-2.5 bg-amber-400 hover:bg-amber-500 text-neutral-950 font-medium text-sm rounded transition-colors"
        >
          Submit Vocalist Profile
        </button>
      </div>
    </form>
  );
}
