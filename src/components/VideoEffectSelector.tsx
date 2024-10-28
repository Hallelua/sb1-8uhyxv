import { videoEffects, transitionEffects } from '../services/videoEffects';

interface VideoEffectSelectorProps {
  onEffectChange: (effectName: string) => void;
  onTransitionChange: (transitionName: string) => void;
  selectedEffect: string;
  selectedTransition: string;
}

export default function VideoEffectSelector({
  onEffectChange,
  onTransitionChange,
  selectedEffect,
  selectedTransition
}: VideoEffectSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Video Effect</label>
        <select
          value={selectedEffect}
          onChange={(e) => onEffectChange(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          {videoEffects.map((effect) => (
            <option key={effect.name} value={effect.name}>
              {effect.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Transition Effect</label>
        <select
          value={selectedTransition}
          onChange={(e) => onTransitionChange(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          {transitionEffects.map((transition) => (
            <option key={transition.name} value={transition.name}>
              {transition.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}