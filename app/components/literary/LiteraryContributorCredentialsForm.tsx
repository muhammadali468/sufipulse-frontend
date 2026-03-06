import { useState } from 'react';
import { sanitizeInput } from '../../lib/sanitization';

interface LiteraryFormData {
  fullName: string;
  professionalName: string;
  country: string;
  city: string;
  email: string;
  yearsExperience: string;
  writingFocus: string[];
  primaryLanguages: string;
  academicBackground: string;
  portfolioLink: string;
  editorialExperience: boolean | null;
  structuredReviewAlignment: boolean | null;
  publicationAcknowledgment: boolean;
  frameworkAcknowledgment: boolean;
}

export function LiteraryContributorCredentialsForm() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<LiteraryFormData>({
    fullName: '',
    professionalName: '',
    country: '',
    city: '',
    email: '',
    yearsExperience: '',
    writingFocus: [],
    primaryLanguages: '',
    academicBackground: '',
    portfolioLink: '',
    editorialExperience: null,
    structuredReviewAlignment: null,
    publicationAcknowledgment: false,
    frameworkAcknowledgment: false,
  });

  const handleCheckboxChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      writingFocus: prev.writingFocus.includes(value)
        ? prev.writingFocus.filter(f => f !== value)
        : [...prev.writingFocus, value]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-neutral-950/50 border border-neutral-800/50 rounded p-8 text-center">
        <p className="text-neutral-300 text-sm">
          Your profile has been received for institutional review.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-neutral-950/50 border border-neutral-800/50 rounded p-8">
      <h3 className="text-lg font-semibold text-white mb-6">Submit Literary Contributor Profile</h3>

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
                <label className="block text-neutral-400 text-xs mb-1.5">Professional Name (if applicable)</label>
                <input
                  type="text"
                  value={formData.professionalName}
                  onChange={e => setFormData({ ...formData, professionalName: sanitizeInput(e.target.value) })}
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
                <label className="block text-neutral-400 text-xs mb-1.5">Years of Writing Experience</label>
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
                        checked={formData.writingFocus.includes(focus)}
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
                  value={formData.primaryLanguages}
                  onChange={e => setFormData({ ...formData, primaryLanguages: sanitizeInput(e.target.value) })}
                  placeholder="e.g., English, Urdu, Arabic"
                  className="form-input w-full bg-neutral-900/50 rounded px-3 py-2 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-neutral-400 text-xs mb-1.5">Academic or Literary Background</label>
                <textarea
                  required
                  rows={4}
                  value={formData.academicBackground}
                  onChange={e => setFormData({ ...formData, academicBackground: sanitizeInput(e.target.value) })}
                  placeholder="Brief overview of education, training, or literary experience"
                  className="form-input w-full bg-neutral-900/50 rounded px-3 py-2 text-white text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-neutral-400 text-xs mb-1.5">Portfolio or Published Work Link (optional)</label>
                <input
                  type="url"
                  value={formData.portfolioLink}
                  onChange={e => setFormData({ ...formData, portfolioLink: e.target.value })}
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
                      checked={formData.editorialExperience === true}
                      onChange={() => setFormData({ ...formData, editorialExperience: true })}
                      className="w-4 h-4"
                    />
                    Yes
                  </label>
                  <label className="flex items-center gap-2 text-neutral-300 text-sm">
                    <input
                      type="radio"
                      name="editorialExperience"
                      required
                      checked={formData.editorialExperience === false}
                      onChange={() => setFormData({ ...formData, editorialExperience: false })}
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
                    checked={formData.structuredReviewAlignment === true}
                    onChange={e => setFormData({ ...formData, structuredReviewAlignment: e.target.checked ? true : null })}
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
                    checked={formData.publicationAcknowledgment}
                    onChange={e => setFormData({ ...formData, publicationAcknowledgment: e.target.checked })}
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
                checked={formData.frameworkAcknowledgment}
                onChange={e => setFormData({ ...formData, frameworkAcknowledgment: e.target.checked })}
                className="w-4 h-4 bg-neutral-900/50 border border-neutral-800 rounded mt-0.5 shrink-0"
              />
              <span>I acknowledge and accept the institutional editorial framework.</span>
            </label>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          className="px-8 py-2.5 bg-amber-400 hover:bg-amber-500 text-neutral-950 font-medium text-sm rounded transition-colors"
        >
          Submit Literary Contributor Profile
        </button>
      </div>
    </form>
  );
}
