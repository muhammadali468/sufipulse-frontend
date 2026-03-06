import { useState } from 'react';
import { sanitizeInput } from '../../lib/sanitization';

interface ProducerFormData {
  fullName: string;
  professionalName: string;
  country: string;
  city: string;
  email: string;
  yearsExperience: string;
  productionFocus: string[];
  primaryTools: string;
  musicalBackground: string;
  portfolioLink: string;
  structuredVocalExperience: boolean | null;
  workflowAlignment: boolean | null;
  centralizationAcknowledgment: boolean;
  frameworkAcknowledgment: boolean;
}

export function ProducerCredentialsForm() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<ProducerFormData>({
    fullName: '',
    professionalName: '',
    country: '',
    city: '',
    email: '',
    yearsExperience: '',
    productionFocus: [],
    primaryTools: '',
    musicalBackground: '',
    portfolioLink: '',
    structuredVocalExperience: null,
    workflowAlignment: null,
    centralizationAcknowledgment: false,
    frameworkAcknowledgment: false,
  });

  const handleCheckboxChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      productionFocus: prev.productionFocus.includes(value)
        ? prev.productionFocus.filter(f => f !== value)
        : [...prev.productionFocus, value]
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
      <h3 className="text-lg font-semibold text-white mb-6">Submit Producer Profile</h3>

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
                <label className="block text-neutral-400 text-xs mb-1.5">Years of Experience</label>
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
            <h4 className="text-sm font-medium text-white mb-4">Musical Competence</h4>

            <div className="space-y-4">
              <div>
                <label className="block text-neutral-400 text-xs mb-2">Primary Production Focus</label>
                <div className="space-y-2">
                  {[
                    'Vocal arrangement',
                    'Composition structuring',
                    'Instrumental arrangement',
                    'Orchestration',
                    'Digital production (DAW-based)',
                    'Acoustic ensemble coordination'
                  ].map(focus => (
                    <label key={focus} className="flex items-center gap-2 text-neutral-300 text-sm">
                      <input
                        type="checkbox"
                        checked={formData.productionFocus.includes(focus)}
                        onChange={() => handleCheckboxChange(focus)}
                        className="w-4 h-4 bg-neutral-900/50 border border-neutral-800 rounded"
                      />
                      {focus}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 text-xs mb-1.5">Primary Tools / DAW</label>
                <input
                  type="text"
                  required
                  value={formData.primaryTools}
                  onChange={e => setFormData({ ...formData, primaryTools: sanitizeInput(e.target.value) })}
                  className="form-input w-full bg-neutral-900/50 rounded px-3 py-2 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-neutral-400 text-xs mb-1.5">Musical Background</label>
                <textarea
                  required
                  rows={4}
                  value={formData.musicalBackground}
                  onChange={e => setFormData({ ...formData, musicalBackground: sanitizeInput(e.target.value) })}
                  placeholder="Brief overview of training, influences, or structured experience"
                  className="form-input w-full bg-neutral-900/50 rounded px-3 py-2 text-white text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-neutral-400 text-xs mb-1.5">Portfolio Link (optional)</label>
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
            <h4 className="text-sm font-medium text-white mb-4">Workflow Alignment</h4>

            <div className="space-y-4">
              <div>
                <label className="block text-neutral-400 text-xs mb-2">
                  Have you worked with structured vocal production before?
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-neutral-300 text-sm">
                    <input
                      type="radio"
                      name="structuredExperience"
                      required
                      checked={formData.structuredVocalExperience === true}
                      onChange={() => setFormData({ ...formData, structuredVocalExperience: true })}
                      className="w-4 h-4"
                    />
                    Yes
                  </label>
                  <label className="flex items-center gap-2 text-neutral-300 text-sm">
                    <input
                      type="radio"
                      name="structuredExperience"
                      required
                      checked={formData.structuredVocalExperience === false}
                      onChange={() => setFormData({ ...formData, structuredVocalExperience: false })}
                      className="w-4 h-4"
                    />
                    No
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 text-xs mb-2">
                  Are you willing to operate within a defined production sequence?
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
                  Do you acknowledge that final mixing, mastering, and registry authorization remain centralized?
                </label>
                <label className="flex items-center gap-2 text-neutral-300 text-sm">
                  <input
                    type="checkbox"
                    required
                    checked={formData.centralizationAcknowledgment}
                    onChange={e => setFormData({ ...formData, centralizationAcknowledgment: e.target.checked })}
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
                <p>Producers operate within an approved kalam workflow.</p>
                <p>Assignments follow editorial confirmation and vocalist alignment.</p>
                <p>All releases pass through studio validation prior to registry authorization.</p>
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
              <span>I acknowledge and accept the institutional production framework.</span>
            </label>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          className="px-8 py-2.5 bg-amber-400 hover:bg-amber-500 text-neutral-950 font-medium text-sm rounded transition-colors"
        >
          Submit Producer Profile
        </button>
      </div>
    </form>
  );
}
