/**
 * CrisisMate — Local Bundled Offline Emergency Guides
 *
 * Provides verified offline safety steps with 0 external network dependencies.
 * Used when offline or when Gemini / Firebase / Maps are unavailable.
 */

import type { EmergencyType, SeverityLevel } from '../types/crisis';

export interface LocalEmergencyGuide {
  type: EmergencyType;
  title: string;
  emoji: string;
  typicalSeverity: SeverityLevel;
  summary: string;
  immediateActions: string[];
  avoid: string[];
  whenToSeekProfessionalHelp: string;
}

export const LOCAL_EMERGENCY_GUIDES: Record<EmergencyType, LocalEmergencyGuide> = {
  FIRE: {
    type: 'FIRE',
    title: 'Fire & Smoke Hazard Guide',
    emoji: '🔥',
    typicalSeverity: 'CRITICAL',
    summary: 'Immediate structural fire or heavy smoke evacuation guidance.',
    immediateActions: [
      'Crawl low on hands and knees under smoke to avoid toxic inhalation.',
      'Check doors for heat using the back of your hand before opening.',
      'Use stairwells for evacuation; never enter an elevator during a fire emergency.',
      'Once outside, stay at a safe distance and call local fire department (101 / 112).',
    ],
    avoid: [
      'Do not return inside for personal belongings or pets.',
      'Do not use elevators under any circumstances.',
      'Do not open hot doors or broken windows that feed air to the fire.',
    ],
    whenToSeekProfessionalHelp: 'Always call fire emergency services immediately for any building fire, smoke, or gas leak.',
  },
  MEDICAL: {
    type: 'MEDICAL',
    title: 'Medical Emergency Guide',
    emoji: '🏥',
    typicalSeverity: 'CRITICAL',
    summary: 'First aid and emergency medical response guidelines.',
    immediateActions: [
      'Assess scene safety before approaching the victim.',
      'Check responsiveness and breathing.',
      'Call emergency ambulance (108 / 112) immediately for unresponsiveness or severe bleeding.',
      'Apply direct firm pressure with clean cloth to control active bleeding.',
    ],
    avoid: [
      'Do not move victims with suspected head, neck, or spinal injuries unless in immediate danger.',
      'Do not give food, water, or medication to an unconscious person.',
    ],
    whenToSeekProfessionalHelp: 'Seek immediate emergency medical help for loss of consciousness, severe bleeding, difficulty breathing, or chest pain.',
  },
  ACCIDENT: {
    type: 'ACCIDENT',
    title: 'Road & Vehicle Accident Guide',
    emoji: '🚗',
    typicalSeverity: 'HIGH',
    summary: 'Traffic accident scene management and victim safety.',
    immediateActions: [
      'Turn on hazard lights and position warning markers if safe.',
      'Call emergency control room (100 / 108 / 112).',
      'Check victims for breathing and major bleeding.',
    ],
    avoid: [
      'Do not move injured individuals unless there is imminent fire or traffic hazard.',
      'Do not remove motorcyclist helmets improperly.',
    ],
    whenToSeekProfessionalHelp: 'Call emergency services immediately for any vehicle crash with injuries or fuel leaks.',
  },
  FLOOD: {
    type: 'FLOOD',
    title: 'Flash Flood & Rising Water Guide',
    emoji: '🌊',
    typicalSeverity: 'HIGH',
    summary: 'Flood water survival and electrical hazard avoidance.',
    immediateActions: [
      'Evacuate to higher floors, roofs, or elevated ground immediately.',
      'Turn off main electrical breakers if water is approaching.',
      'Keep emergency flashlights and essential supplies ready.',
    ],
    avoid: [
      'Do not walk, swim, or drive through moving flood waters.',
      'Do not touch submerged electrical wires or outlets.',
    ],
    whenToSeekProfessionalHelp: 'Call disaster management (1078 / 112) if trapped by rising water or requiring water rescue.',
  },
  EARTHQUAKE: {
    type: 'EARTHQUAKE',
    title: 'Earthquake Tremor Guide',
    emoji: '🌍',
    typicalSeverity: 'CRITICAL',
    summary: 'Drop, Cover, and Hold On earthquake protection.',
    immediateActions: [
      'DROP onto your hands and knees.',
      'COVER your head and neck under a sturdy table or desk.',
      'HOLD ON to your shelter until all shaking stops.',
      'Evacuate carefully after shaking stops, checking for structural cracks.',
    ],
    avoid: [
      'Do not run outside while shaking is actively occurring.',
      'Do not stand near windows, glass, or heavy unanchored furniture.',
    ],
    whenToSeekProfessionalHelp: 'Contact emergency services if individuals are trapped under rubble or building structure collapses.',
  },
  CYCLONE: {
    type: 'CYCLONE',
    title: 'Severe Storm & Cyclone Guide',
    emoji: '🌀',
    typicalSeverity: 'HIGH',
    summary: 'High wind storm shelter and safety procedures.',
    immediateActions: [
      'Shelter in an interior room away from exterior windows and glass doors.',
      'Keep battery-powered radio or phone charged for emergency broadcasts.',
      'Secure loose outdoor items if storm is approaching.',
    ],
    avoid: [
      'Do not go outside during the calm "eye" of the cyclone.',
      'Do not shelter near trees or metallic roofs.',
    ],
    whenToSeekProfessionalHelp: 'Contact emergency disaster control if roof collapses or storm surge threatens structure.',
  },
  ELECTRICAL: {
    type: 'ELECTRICAL',
    title: 'Electrical Hazard & Sparks Guide',
    emoji: '⚡',
    typicalSeverity: 'HIGH',
    summary: 'Electrical shock prevention and circuit isolation.',
    immediateActions: [
      'Disconnect main circuit breaker before touching appliances or sockets.',
      'Keep distance from sparking wires or water near outlets.',
      'Use dry fire extinguisher (Class C/CO2) for electrical fires.',
    ],
    avoid: [
      'Do not use water on electrical fires.',
      'Do not touch electrocution victims directly while current is active.',
    ],
    whenToSeekProfessionalHelp: 'Call emergency fire services (101 / 112) for active electrical fires or electrocution injuries.',
  },
  PERSONAL_SAFETY: {
    type: 'PERSONAL_SAFETY',
    title: 'Personal Safety & Threat Guide',
    emoji: '🛡️',
    typicalSeverity: 'HIGH',
    summary: 'Immediate personal security and threat de-escalation.',
    immediateActions: [
      'Move toward well-lit public areas with bystanders.',
      'Call police emergency hotline (100 / 112) immediately.',
      'Shout or draw attention if actively threatened or pursued.',
    ],
    avoid: [
      'Do not isolate yourself in dark, deserted alleys or quiet spaces.',
      'Do not escalate physical arguments when an escape route exists.',
    ],
    whenToSeekProfessionalHelp: 'Contact police immediately if experiencing active assault, stalking, or physical violence threats.',
  },
  OTHER: {
    type: 'OTHER',
    title: 'General Safety Guide',
    emoji: '⚠️',
    typicalSeverity: 'MEDIUM',
    summary: 'General precautionary emergency procedures.',
    immediateActions: [
      'Assess immediate surroundings for physical danger.',
      'Move to a safe, visible area.',
      'Contact local emergency services if health or safety is at risk.',
    ],
    avoid: [
      'Do not take unverified risks or panic.',
    ],
    whenToSeekProfessionalHelp: 'Call emergency hotline 112 if situation escalates or life is threatened.',
  },
};

export function getLocalGuide(type: EmergencyType): LocalEmergencyGuide {
  return LOCAL_EMERGENCY_GUIDES[type] ?? LOCAL_EMERGENCY_GUIDES.OTHER;
}
