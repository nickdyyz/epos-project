import React, { useState } from 'react';
// Add Mapbox SearchBox import
// import { SearchBox } from '@mapbox/search-js-react';

const ORG_TYPES = [
  'Educational Institution', 'Healthcare Facility', 'Corporate Office',
  'Manufacturing Plant', 'Retail Store', 'Government Agency', 'Non-Profit', 'Other'
];
const SCOPE_OPTIONS = [
  'Municipality', 'Campus', 'Building', 'Part of a Building', 'Distributed Operations', 'Other'
];
const HAZARD_CATEGORIES = [
  {
    name: 'Natural Hazards',
    hazards: [
      'Avalanche',
      'Drought',
      'Earthquake',
      'Epidemic/Pandemic (disease outbreak)',
      'Flooding',
      'Tsunami',
      'Tropical Cyclone (Hurricane/Typhoon)',
      'Tornado',
      'Waterspout',
      'Hailstorm',
      'Lightning',
      'Wildfire',
      'Extreme Heat (Heat Wave)',
      'Extreme Cold (Cold Wave/Winter Storm)',
      'Volcanic Eruption',
      'Landslide',
      'Sinkhole',
      'Erosion / Land Degradation',
      'Geomagnetic (Space) Storm',
    ],
  },
  {
    name: 'Technological Hazards',
    hazards: [
      'Hazardous Chemical Release (TIC/TIM)',
      'Radiation / Nuclear Release',
      'Dam/Levee Failure',
      'Power/Utilities Outage',
      'Transportation Accident',
      'Urban Conflagration',
      'Industrial Explosion',
      'Infrastructure Collapse',
      'Urban flooding',
    ],
  },
  {
    name: 'Human-caused Hazards',
    hazards: [
      'Civil Unrest / Disturbance',
      'Terrorist Attack',
      'Cyberattack',
      'Mass Violence (Active Shooter)',
      'Sabotage/Vandalism',
      'Armed Conflict',
    ],
  },
];
const SPECIALS = [
  'Multi-story Building', 'Hazardous Materials On-site',
  'Public Access Areas', 'Remote/Isolated Location', '24/7 Operations',
  'Rural area', 'Urban area', 'Suburban area', 'Proximity to major roadway', 'Proximity to commercial rail', 'None'
];

function PlanForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({
    organization_name: '',
    organization_type: ORG_TYPES[0],
    location: '',
    scope: SCOPE_OPTIONS[0],
    scope_other: '',
    primary_hazards: [],
    special_considerations: [],
    additional_requirements: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [hazardSearch, setHazardSearch] = useState('');
  const [expanded, setExpanded] = useState({
    'Natural Hazards': true,
    'Technological Hazards': false,
    'Human-caused Hazards': false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setForm((prev) => ({
        ...prev,
        [name]: checked
          ? [...prev[name], value]
          : prev[name].filter((v) => v !== value),
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleScopeChange = (e) => {
    setForm((prev) => ({ ...prev, scope: e.target.value, scope_other: '' }));
  };

  // const handleLocationSelect = (result) => {
  //   setForm((prev) => ({ ...prev, location: result?.place_name || '' }));
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    onSubmit(form);
    setSubmitting(false);
  };

  const toggleCategory = (cat) => {
    setExpanded((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const filteredHazards = (hazards) =>
    hazards.filter((h) => h.toLowerCase().includes(hazardSearch.toLowerCase()));

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-xl bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Generate Emergency Plan</h2>
      <div>
        <label className="block font-medium mb-1">Organization Name</label>
        <input
          type="text"
          name="organization_name"
          value={form.organization_name}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Organization Type</label>
        <select
          name="organization_type"
          value={form.organization_type}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {ORG_TYPES.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block font-medium mb-1">Location</label>
        {/* <SearchBox
          accessToken="pk.eyJ1Ijoibmlja2RlIiwiYSI6ImNtZGR0dmdmeDAyZmYybXB2NTBqZnh2emQifQ.pPLCVFOImU2O2FwzDTo7qg"
          value={form.location}
          onRetrieve={handleLocationSelect}
          placeholder="Search for an address or place"
          theme={{ input: 'w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500' }}
        /> */}
        <input
          type="text"
          name="location"
          value={form.location}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter location (address, city, etc.)"
          required
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Scope</label>
        <select
          name="scope"
          value={form.scope}
          onChange={handleScopeChange}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {SCOPE_OPTIONS.map((scope) => (
            <option key={scope} value={scope}>{scope}</option>
          ))}
        </select>
        {form.scope === 'Other' && (
          <input
            type="text"
            name="scope_other"
            value={form.scope_other}
            onChange={handleChange}
            placeholder="Describe the scope"
            className="w-full mt-2 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        )}
      </div>
      <div>
                    <label className="block font-medium mb-1">Hazard Identification</label>
        <input
          type="text"
          placeholder="Search hazards..."
          value={hazardSearch}
          onChange={(e) => setHazardSearch(e.target.value)}
          className="w-full mb-2 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="space-y-2">
          {HAZARD_CATEGORIES.map((cat) => {
            const matches = filteredHazards(cat.hazards);
            if (hazardSearch && matches.length === 0) return null;
            return (
              <div key={cat.name} className="border rounded">
                <button
                  type="button"
                  className="w-full flex justify-between items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-t focus:outline-none"
                  onClick={() => toggleCategory(cat.name)}
                >
                  <span className="font-semibold">{cat.name}</span>
                  <span>{expanded[cat.name] ? '−' : '+'}</span>
                </button>
                {expanded[cat.name] && (
                  <div className="p-2">
                    {matches.length === 0 ? (
                      <div className="text-gray-400 text-sm">No hazards found.</div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {matches.map((hazard) => (
                          <label key={hazard} className="flex items-center space-x-1">
                            <input
                              type="checkbox"
                              name="primary_hazards"
                              value={hazard}
                              checked={form.primary_hazards.includes(hazard)}
                              onChange={handleChange}
                            />
                            <span>{hazard}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div>
        <label className="block font-medium mb-1">Special Considerations</label>
        <div className="flex flex-wrap gap-2">
          {SPECIALS.map((spec) => (
            <label key={spec} className="flex items-center space-x-1">
              <input
                type="checkbox"
                name="special_considerations"
                value={spec}
                checked={form.special_considerations.includes(spec)}
                onChange={handleChange}
              />
              <span>{spec}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <label className="block font-medium mb-1">Additional Requirements (optional)</label>
        <textarea
          name="additional_requirements"
          value={form.additional_requirements}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
      </div>
      <div className="flex justify-end gap-2 mt-4">
        {onCancel && (
          <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
        )}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          disabled={submitting}
        >
          {submitting ? 'Generating...' : 'Generate Plan'}
        </button>
      </div>
    </form>
  );
}

export default PlanForm; 