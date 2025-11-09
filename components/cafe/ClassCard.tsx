import React from 'react';
import Image from 'next/image';
import { Calendar, Clock, MapPin, Users, Video } from 'lucide-react';

interface ClassCardProps {
  id: number;
  title: string;
  description?: string;
  classType: string;
  dateTime?: Date;
  duration?: number;
  maxParticipants: number;
  currentParticipants: number;
  communityPrice: string;
  fairPrice: string;
  supporterPrice: string;
  skillLevel?: string;
  imageUrl?: string;
  locationName?: string;
  onRegister?: (classId: number, priceTier: 'community' | 'fair' | 'supporter') => void;
}

export const ClassCard: React.FC<ClassCardProps> = ({
  id,
  title,
  description,
  classType,
  dateTime,
  duration,
  maxParticipants,
  currentParticipants,
  communityPrice,
  fairPrice,
  supporterPrice,
  skillLevel,
  imageUrl,
  locationName,
  onRegister,
}) => {
  const [selectedTier, setSelectedTier] = React.useState<'community' | 'fair' | 'supporter'>('fair');
  const spotsLeft = maxParticipants - currentParticipants;
  const isFull = spotsLeft <= 0;

  const handleRegister = () => {
    if (onRegister && !isFull) {
      onRegister(id, selectedTier);
    }
  };

  const formatDateTime = (date?: Date) => {
    if (!date) return 'TBD';
    return new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(date));
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {imageUrl && (
        <div className="relative h-48 w-full">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
          />
          <div className="absolute top-2 right-2 bg-white bg-opacity-90 px-2 py-1 rounded text-xs font-semibold">
            {classType === 'virtual' ? (
              <span className="flex items-center text-blue-600">
                <Video className="w-3 h-3 mr-1" />
                Virtual
              </span>
            ) : (
              <span className="flex items-center text-green-600">
                <MapPin className="w-3 h-3 mr-1" />
                In-Person
              </span>
            )}
          </div>
          {isFull && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-semibold text-lg">Class Full</span>
            </div>
          )}
        </div>
      )}

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {skillLevel && (
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
              {skillLevel}
            </span>
          )}
        </div>

        {description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>
        )}

        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-green-600" />
            {formatDateTime(dateTime)}
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2 text-green-600" />
            {duration} minutes
          </div>
          {locationName && classType === 'in-person' && (
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-green-600" />
              {locationName}
            </div>
          )}
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-2 text-green-600" />
            {spotsLeft} spots left ({currentParticipants}/{maxParticipants})
          </div>
        </div>

        <div className="border-t pt-3">
          <p className="text-xs text-gray-600 mb-2">Choose your pricing tier:</p>
          <div className="grid grid-cols-3 gap-2 mb-3">
            <button
              onClick={() => setSelectedTier('community')}
              className={`px-2 py-1 text-xs rounded ${
                selectedTier === 'community'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Community<br />₹{communityPrice}
            </button>
            <button
              onClick={() => setSelectedTier('fair')}
              className={`px-2 py-1 text-xs rounded ${
                selectedTier === 'fair'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Fair<br />₹{fairPrice}
            </button>
            <button
              onClick={() => setSelectedTier('supporter')}
              className={`px-2 py-1 text-xs rounded ${
                selectedTier === 'supporter'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Supporter<br />₹{supporterPrice}
            </button>
          </div>

          <button
            onClick={handleRegister}
            disabled={isFull}
            className={`w-full py-2 rounded font-medium transition-colors ${
              isFull
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isFull ? 'Class Full' : 'Register Now'}
          </button>
        </div>
      </div>
    </div>
  );
};
