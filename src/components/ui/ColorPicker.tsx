import { cn } from '../../lib/utils';
import { Check } from 'lucide-react';

// Curated color palette for projects, labels, and filters
const PRESET_COLORS = [
    { name: 'Berry', value: '#b8256f' },
    { name: 'Red', value: '#db4035' },
    { name: 'Orange', value: '#ff9933' },
    { name: 'Yellow', value: '#fad000' },
    { name: 'Olive', value: '#afb83b' },
    { name: 'Lime', value: '#7ecc49' },
    { name: 'Green', value: '#299438' },
    { name: 'Mint', value: '#6accbc' },
    { name: 'Teal', value: '#158fad' },
    { name: 'Sky', value: '#14aaf5' },
    { name: 'Blue', value: '#4073ff' },
    { name: 'Grape', value: '#884dff' },
    { name: 'Violet', value: '#af38eb' },
    { name: 'Lavender', value: '#eb96eb' },
    { name: 'Magenta', value: '#e05194' },
    { name: 'Salmon', value: '#ff8d85' },
    { name: 'Charcoal', value: '#808080' },
    { name: 'Taupe', value: '#b8b8b8' },
];

interface ColorPickerProps {
    value: string;
    onChange: (color: string) => void;
}

export const ColorPicker = ({ value, onChange }: ColorPickerProps) => {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Color
            </label>
            <div className="flex flex-wrap gap-2">
                {PRESET_COLORS.map((color) => (
                    <button
                        key={color.value}
                        type="button"
                        onClick={() => onChange(color.value)}
                        className={cn(
                            "w-7 h-7 rounded-full flex items-center justify-center transition-transform hover:scale-110",
                            value === color.value && "ring-2 ring-offset-2 ring-gray-400 dark:ring-offset-gray-800"
                        )}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                    >
                        {value === color.value && (
                            <Check size={14} className="text-white drop-shadow-sm" />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};
