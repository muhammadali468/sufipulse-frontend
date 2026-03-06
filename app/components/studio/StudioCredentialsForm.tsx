import { useState } from 'react';
import { sanitizeInput } from '../../lib/sanitization';

export function StudioCredentialsForm() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    studioName: '',
    country: '',
    city: '',
    primaryContactName: '',
    email: '',
    phone: '',
    capabilities: {
      vocalBooth: false,
      treatedAcoustic: false,
      multiTrack: false,
      professionalMic: false,
      dawBased: false,
    },
    equipmentOverview: '',
    yearsInOperation: '',
    previousWorkLink: '',
    agreeCentralReview: false,
    agreeCentralProduction: false,
    acknowledgeTerms: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleCheckboxChange = (field: keyof typeof formData.capabilities) => {
    setFormData({
      ...formData,
      capabilities: {
        ...formData.capabilities,
        [field]: !formData.capabilities[field],
      },
    });
  };

  if (submitted) {
    return (
      <div className="bg-neutral-950/50 border border-neutral-800/50 rounded p-8 text-center">
        <p className="text-neutral-300 text-sm">
          Your submission has been received for institutional review.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-neutral-950/50 border border-neutral-800/50 rounded p-8">
      <h3 className="text-lg font-semibold text-white mb-6">Submit Studio Credentials</h3>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div>
            <h4 className="text-sm font-medium text-white mb-4">Studio Identity</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-neutral-400 text-xs mb-1.5">Studio Name</label>
                <input
                  type="text"
                  required
                  value={formData.studioName}
                  onChange={(e) => setFormData({ ...formData, studioName: sanitizeInput(e.target.value) })}
                  className="form-input w-full bg-neutral-900/50 rounded px-3 py-2 text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-neutral-400 text-xs mb-1.5">Country</label>
                <select
                  required
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="form-input w-full bg-neutral-900/50 rounded px-3 py-2 text-white text-sm"
                >
                  <option value="">Select country</option>
                  <option value="USA">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="UAE">United Arab Emirates</option>
                  <option value="India">India</option>
                  <option value="Pakistan">Pakistan</option>
                  <option value="UK">United Kingdom</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-neutral-400 text-xs mb-1.5">City</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: sanitizeInput(e.target.value) })}
                  className="form-input w-full bg-neutral-900/50 rounded px-3 py-2 text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-neutral-400 text-xs mb-1.5">Primary Contact Name</label>
                <input
                  type="text"
                  required
                  value={formData.primaryContactName}
                  onChange={(e) => setFormData({ ...formData, primaryContactName: sanitizeInput(e.target.value) })}
                  className="form-input w-full bg-neutral-900/50 rounded px-3 py-2 text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-neutral-400 text-xs mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="form-input w-full bg-neutral-900/50 rounded px-3 py-2 text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-neutral-400 text-xs mb-1.5">Phone (optional)</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: sanitizeInput(e.target.value) })}
                  className="form-input w-full bg-neutral-900/50 rounded px-3 py-2 text-white text-sm"
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-white mb-4">Technical Profile</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-neutral-400 text-xs mb-2">Recording Capability</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-neutral-300 text-sm">
                    <input
                      type="checkbox"
                      checked={formData.capabilities.vocalBooth}
                      onChange={() => handleCheckboxChange('vocalBooth')}
                      className="w-4 h-4 bg-neutral-900/50 border border-neutral-800 rounded"
                    />
                    Vocal recording booth
                  </label>
                  <label className="flex items-center gap-2 text-neutral-300 text-sm">
                    <input
                      type="checkbox"
                      checked={formData.capabilities.treatedAcoustic}
                      onChange={() => handleCheckboxChange('treatedAcoustic')}
                      className="w-4 h-4 bg-neutral-900/50 border border-neutral-800 rounded"
                    />
                    Treated acoustic environment
                  </label>
                  <label className="flex items-center gap-2 text-neutral-300 text-sm">
                    <input
                      type="checkbox"
                      checked={formData.capabilities.multiTrack}
                      onChange={() => handleCheckboxChange('multiTrack')}
                      className="w-4 h-4 bg-neutral-900/50 border border-neutral-800 rounded"
                    />
                    Multi-track capability
                  </label>
                  <label className="flex items-center gap-2 text-neutral-300 text-sm">
                    <input
                      type="checkbox"
                      checked={formData.capabilities.professionalMic}
                      onChange={() => handleCheckboxChange('professionalMic')}
                      className="w-4 h-4 bg-neutral-900/50 border border-neutral-800 rounded"
                    />
                    Professional microphone chain
                  </label>
                  <label className="flex items-center gap-2 text-neutral-300 text-sm">
                    <input
                      type="checkbox"
                      checked={formData.capabilities.dawBased}
                      onChange={() => handleCheckboxChange('dawBased')}
                      className="w-4 h-4 bg-neutral-900/50 border border-neutral-800 rounded"
                    />
                    DAW-based recording system
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-neutral-400 text-xs mb-1.5">Primary Equipment Overview</label>
                <textarea
                  required
                  rows={4}
                  value={formData.equipmentOverview}
                  onChange={(e) => setFormData({ ...formData, equipmentOverview: sanitizeInput(e.target.value) })}
                  placeholder="Brief description of microphone, interface, DAW, monitoring"
                  className="form-input w-full bg-neutral-900/50 rounded px-3 py-2 text-white text-sm resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <h4 className="text-sm font-medium text-white mb-4">Operational Alignment</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-neutral-400 text-xs mb-1.5">Years in Operation</label>
                <select
                  required
                  value={formData.yearsInOperation}
                  onChange={(e) => setFormData({ ...formData, yearsInOperation: e.target.value })}
                  className="form-input w-full bg-neutral-900/50 rounded px-3 py-2 text-white text-sm"
                >
                  <option value="">Select experience</option>
                  <option value="0-1">0–1 years</option>
                  <option value="1-3">1–3 years</option>
                  <option value="3-5">3–5 years</option>
                  <option value="5+">5+ years</option>
                </select>
              </div>
              <div>
                <label className="block text-neutral-400 text-xs mb-1.5">Previous Work (optional)</label>
                <input
                  type="url"
                  value={formData.previousWorkLink}
                  onChange={(e) => setFormData({ ...formData, previousWorkLink: e.target.value })}
                  placeholder="https://"
                  className="form-input w-full bg-neutral-900/50 rounded px-3 py-2 text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-neutral-400 text-xs mb-2">
                  Do you agree to operate under centralized review and final master validation?
                </label>
                <label className="flex items-center gap-2 text-neutral-300 text-sm">
                  <input
                    type="checkbox"
                    required
                    checked={formData.agreeCentralReview}
                    onChange={(e) => setFormData({ ...formData, agreeCentralReview: e.target.checked })}
                    className="w-4 h-4 bg-neutral-900/50 border border-neutral-800 rounded"
                  />
                  Yes
                </label>
              </div>
              <div>
                <label className="block text-neutral-400 text-xs mb-2">
                  Do you agree that mixing, mastering, and publication authorization remain centralized?
                </label>
                <label className="flex items-center gap-2 text-neutral-300 text-sm">
                  <input
                    type="checkbox"
                    required
                    checked={formData.agreeCentralProduction}
                    onChange={(e) => setFormData({ ...formData, agreeCentralProduction: e.target.checked })}
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
              <p className="text-neutral-300 text-xs leading-relaxed">
                Network studios operate within a documented production framework. Recording sessions are assigned through centralized coordination and restricted to approved contributors.
              </p>
            </div>
            <label className="flex items-start gap-2 text-neutral-300 text-sm">
              <input
                type="checkbox"
                required
                checked={formData.acknowledgeTerms}
                onChange={(e) => setFormData({ ...formData, acknowledgeTerms: e.target.checked })}
                className="w-4 h-4 bg-neutral-900/50 border border-neutral-800 rounded mt-0.5 shrink-0"
              />
              <span>I acknowledge and accept these terms.</span>
            </label>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          className="px-8 py-2.5 bg-amber-400 hover:bg-amber-500 text-neutral-950 font-medium text-sm rounded transition-colors"
        >
          Submit Studio Credentials
        </button>
      </div>
    </form>
  );
}
