import React, { useState } from 'react';
import { EMERGENCY_TYPES, type EmergencyType } from '../../types/crisis';
import { getEmergencyMetadata } from '../../data/emergencyTypes';

export const GuidesPage: React.FC = () => {
  const [selectedType, setSelectedType] = useState<EmergencyType>('FIRE');

  const selectedMeta = getEmergencyMetadata(selectedType);

  const guideDetails: Record<EmergencyType, { steps: string[]; avoid: string[]; whenToEscalate: string }> = {
    FIRE: {
      steps: [
        'Stay low to the ground to avoid inhaling toxic smoke.',
        'Feel doors with the back of your hand before opening. If hot, do not open.',
        'Use nearest stairs; never use elevators during a fire emergency.',
        'Once outside, stay out and call local fire emergency (101 / 112).',
      ],
      avoid: ['Do not return for personal belongings.', 'Do not use elevators.', 'Do not open hot doors.'],
      whenToEscalate: 'Always contact fire services immediately for any building fire or heavy smoke.',
    },
    MEDICAL: {
      steps: [
        'Assess scene safety before approaching victim.',
        'Check victim responsiveness and breathing.',
        'Call emergency ambulance (108 / 112) immediately for severe bleeding or collapse.',
        'Keep victim still and warm until professional help arrives.',
      ],
      avoid: ['Do not move victim with potential neck/spinal trauma.', 'Do not give liquid to an unconscious person.'],
      whenToEscalate: 'Escalate immediately for chest pain, difficulty breathing, severe bleeding, or unconsciousness.',
    },
    ACCIDENT: {
      steps: [
        'Park safely away from oncoming traffic and turn on hazard lights.',
        'Call emergency services (100 / 108 / 112).',
        'Check for breathing and severe bleeding.',
        'Direct oncoming traffic away from the scene if safe to do so.',
      ],
      avoid: ['Do not move victims unless there is immediate risk of fire or explosion.', 'Do not remove helmets from motorcyclists unnecessarily.'],
      whenToEscalate: 'Always escalate vehicle collisions involving injuries, major road blockage, or fuel leaks.',
    },
    FLOOD: {
      steps: [
        'Evacuate to higher floors, roofs, or high ground immediately.',
        'Disconnect main electrical breaker if water is entering.',
        'Keep emergency supplies and bottled water ready.',
      ],
      avoid: ['Do not walk or drive through moving flood waters.', 'Do not touch submerged electrical appliances.'],
      whenToEscalate: 'Escalate when flood waters are rapidly rising or trapped occupants require water rescue.',
    },
    EARTHQUAKE: {
      steps: [
        'DROP to hands and knees.',
        'COVER your head and neck under a sturdy table or desk.',
        'HOLD ON until shaking stops completely.',
        'Evacuate carefully after shaking stops, watching for falling debris.',
      ],
      avoid: ['Do not run outside while shaking is actively occurring.', 'Do not stand near windows or glass.'],
      whenToEscalate: 'Escalate if building structures have collapsed or occupants are trapped under debris.',
    },
    CYCLONE: {
      steps: [
        'Stay indoors away from windows, doors, and glass panels.',
        'Keep emergency battery radio or phone charged for official alerts.',
        'Move to safest interior room or storm shelter.',
      ],
      avoid: ['Do not go outside during the calm "eye" of the storm.', 'Do not shelter under trees or loose roofs.'],
      whenToEscalate: 'Escalate when storm surge threatens structure or wind damages roof/walls severely.',
    },
    ELECTRICAL: {
      steps: [
        'Shut off main electrical breaker immediately if safe.',
        'Keep everyone away from exposed wires or sparking sockets.',
        'Use dry Class C or CO2 fire extinguisher if fire starts.',
      ],
      avoid: ['Do not touch live wires or electrocution victims directly.', 'Do not use water on electrical fires.'],
      whenToEscalate: 'Escalate immediately for electrocution victims or active electrical fires.',
    },
    PERSONAL_SAFETY: {
      steps: [
        'Move towards well-lit public areas with people.',
        'Call emergency police hotline (100 / 112) immediately.',
        'Make noise and alert bystanders if actively threatened.',
      ],
      avoid: ['Do not isolate yourself in quiet or dark areas.', 'Do not escalate physical confrontations if escape is possible.'],
      whenToEscalate: 'Escalate immediately for active assault, stalking, physical threats, or violence.',
    },
    OTHER: {
      steps: [
        'Assess immediate physical surroundings for hazards.',
        'Move to a safe location.',
        'Contact emergency services if health or safety is threatened.',
      ],
      avoid: ['Do not panic or take unverified risks.'],
      whenToEscalate: 'Escalate whenever personal safety or life is endangered.',
    },
  };

  const details = guideDetails[selectedType];

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-[#e8e8f0] px-4 py-6 max-w-4xl mx-auto space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <span>📖</span> Emergency Preparedness Guides
        </h1>
        <p className="text-sm text-gray-400">
          Verified offline safety procedures per category.
        </p>
      </div>

      {/* Category Picker Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#2d2d44] pb-4">
        {EMERGENCY_TYPES.map((type) => {
          const meta = getEmergencyMetadata(type);
          const isSelected = selectedType === type;
          return (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                isSelected
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-[#1a1a2e] text-gray-300 hover:bg-[#252542] border border-[#2d2d44]'
              }`}
            >
              <span>{meta.emoji}</span>
              <span>{meta.label}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Guide Details */}
      <div className="bg-[#1a1a2e] border border-[#2d2d44] rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex items-center gap-3 border-b border-[#2d2d44] pb-4">
          <span className="text-4xl">{selectedMeta.emoji}</span>
          <div>
            <h2 className="text-2xl font-extrabold text-white">{selectedMeta.label} Guide</h2>
            <p className="text-xs text-gray-400">{selectedMeta.description}</p>
          </div>
        </div>

        {/* Immediate Steps */}
        <div className="space-y-3">
          <h3 className="text-sm font-extrabold text-green-400 uppercase tracking-wider flex items-center gap-2">
            <span>⚡</span> Immediate Action Steps
          </h3>
          <ol className="space-y-2.5">
            {details.steps.map((step, idx) => (
              <li
                key={idx}
                className="bg-[#0f0f1a] border border-[#2d2d44] p-3 rounded-lg text-gray-100 text-sm font-medium flex items-start gap-3"
              >
                <span className="font-bold text-green-400 min-w-[1.25rem]">{idx + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Avoid */}
        <div className="space-y-3">
          <h3 className="text-sm font-extrabold text-red-400 uppercase tracking-wider flex items-center gap-2">
            <span>🛑</span> Critical Mistakes to Avoid
          </h3>
          <ul className="space-y-2">
            {details.avoid.map((item, idx) => (
              <li
                key={idx}
                className="bg-[#0f0f1a] border border-[#2d2d44] p-3 rounded-lg text-gray-200 text-sm flex items-start gap-3"
              >
                <span className="text-red-500 font-bold">❌</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Escalation */}
        <div className="bg-red-950/50 border border-red-500/40 p-4 rounded-xl text-red-200 text-xs font-semibold space-y-1">
          <div className="font-bold text-red-400 flex items-center gap-1.5 text-sm">
            <span>🚨</span> When to Escalate to Professionals
          </div>
          <p>{details.whenToEscalate}</p>
        </div>
      </div>
    </div>
  );
};
