import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import type { Itinerary } from '../types';

const ItineraryForm: React.FC<{ onSave: (itinerary: Itinerary) => void }> = ({ onSave }) => {
  const [destination, setDestination] = useState('');
  const [plan, setPlan] = useState([{ day: 1, activities: '' }]);
  const [notes, setNotes] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  const handlePlanChange = (index: number, value: string) => {
    const newPlan = [...plan];
    newPlan[index].activities = value;
    setPlan(newPlan);
  };
  
  const addDay = () => setPlan([...plan, { day: plan.length + 1, activities: '' }]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination) return;
    const newItinerary: Itinerary = {
      id: Date.now().toString(),
      destination,
      plan,
      notes,
      isPublic,
    };
    onSave(newItinerary);
    // Reset form
    setDestination('');
    setPlan([{ day: 1, activities: '' }]);
    setNotes('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl shadow-lg space-y-4">
      <h3 className="text-xl font-poppins font-semibold">Create New Itinerary</h3>
      <input type="text" value={destination} onChange={e => setDestination(e.target.value)} placeholder="Destination (e.g., Goa)" className="w-full border-gray-300 border p-3 rounded-2xl bg-white text-charcoal-gray placeholder:text-gray-400 focus:ring-2 focus:ring-sky-blue focus:border-transparent" required />
      
      {plan.map((dayPlan, index) => (
        <div key={index}>
            <label className="font-semibold text-gray-700">Day {dayPlan.day}</label>
            <textarea value={dayPlan.activities} onChange={e => handlePlanChange(index, e.target.value)} placeholder="Activities for the day..." className="w-full border-gray-300 border p-3 rounded-2xl mt-1 h-20 bg-white text-charcoal-gray placeholder:text-gray-400 focus:ring-2 focus:ring-sky-blue focus:border-transparent"></textarea>
        </div>
      ))}
      <button type="button" onClick={addDay} className="text-sm text-sky-blue hover:underline font-semibold">+ Add Day</button>

      <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Additional notes..." className="w-full border-gray-300 border p-3 rounded-2xl h-24 bg-white text-charcoal-gray placeholder:text-gray-400 focus:ring-2 focus:ring-sky-blue focus:border-transparent"></textarea>
      
      <div className="flex items-center space-x-2">
        <input type="checkbox" id="isPublic" checked={isPublic} onChange={e => setIsPublic(e.target.checked)} className="h-4 w-4 text-sunset-orange rounded border-gray-300 focus:ring-sunset-orange" />
        <label htmlFor="isPublic">Make Public</label>
      </div>

      <button type="submit" className="w-full bg-sunset-orange text-white py-3 rounded-2xl font-semibold text-lg hover:bg-opacity-90 transition-colors">Save Itinerary</button>
    </form>
  );
};

const ProfilePage: React.FC = () => {
  const { user, itineraries, addItinerary } = useUser();
  
  return (
    <div className="p-4 max-w-2xl mx-auto space-y-8">
      <div>
        <div className="flex flex-col items-center">
          <img src={user.profilePicture} alt={user.name} className="w-28 h-28 rounded-full shadow-2xl border-4 border-white" />
          <h1 className="text-3xl font-poppins font-bold mt-4">{user.name}</h1>
          <p className="text-gray-600">{user.age}, {user.gender}</p>
        </div>
        <div className="mt-6 bg-white p-5 rounded-3xl shadow-lg">
          <h2 className="text-xl font-poppins font-semibold mb-3">About Me</h2>
          <div className="space-y-2 text-sm text-charcoal-gray">
            <p><strong>Travel Style:</strong> {user.travelStyle}</p>
            <p><strong>Interests:</strong> {user.interests.join(', ')}</p>
            <p><strong>Preferred Destinations:</strong> {user.preferredDestinations.join(', ')}</p>
          </div>
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-poppins font-bold mb-4">My Itineraries</h2>
        {itineraries.length > 0 ? (
          <div className="space-y-4">
            {itineraries.map(it => (
              <div key={it.id} className="bg-white p-4 rounded-2xl shadow-lg">
                <h3 className="font-bold font-poppins">{it.destination} <span className="text-xs font-inter font-normal text-gray-500">{it.isPublic ? '' : '(Private)'}</span></h3>
                {it.plan.map(p => <p key={p.day} className="text-sm mt-1"><strong>Day {p.day}:</strong> {p.activities}</p>)}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center bg-white p-6 rounded-2xl shadow-lg">You haven't created any itineraries yet.</p>
        )}
      </div>

      <ItineraryForm onSave={addItinerary} />
    </div>
  );
};

export default ProfilePage;