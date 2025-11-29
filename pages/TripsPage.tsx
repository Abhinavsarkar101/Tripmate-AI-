import React, { useState, useMemo } from 'react';
import { MOCK_TRAVEL_PACKAGES } from '../constants';
import type { TravelPackage, TransportDetails } from '../types';
import { AdjustmentsHorizontalIcon } from '../components/icons/Icons';

const TripCard: React.FC<{ trip: TravelPackage }> = ({ trip }) => (
  <div className="bg-white rounded-3xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
    <img src={trip.imageUrl} alt={trip.title} className="w-full h-48 object-cover" />
    <div className="p-5">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs text-gray-500 font-semibold">{trip.company.toUpperCase()}</p>
          <h3 className="text-lg font-poppins font-bold mt-1">{trip.title}</h3>
        </div>
        <div className="text-right flex-shrink-0 ml-2">
            <p className="text-2xl font-bold text-sunset-orange">₹{trip.price.toLocaleString()}</p>
            <p className="text-xs text-gray-500">{trip.duration}</p>
        </div>
      </div>
      <p className="text-sm text-gray-600 mt-2 text-left">{trip.description}</p>
      <div className="text-sm text-charcoal-gray mt-4 border-t border-gray-100 pt-3 space-y-1">
          <p><strong>From:</strong> {trip.startLocation}</p>
          <p><strong>Departs:</strong> {new Date(trip.departureDate + 'T00:00:00').toDateString()}</p>
          <p><strong>Transport:</strong> {trip.transport.type} ({trip.transport.amenities.join(', ')})</p>
      </div>
      <div className="mt-4 flex gap-2 flex-wrap">
            {trip.tags.map(tag => (
                <span key={tag} className="bg-sky-blue/20 text-sky-blue text-xs font-semibold px-2.5 py-1 rounded-full">{tag}</span>
            ))}
      </div>
    </div>
  </div>
);

const TripsPage: React.FC = () => {
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [date, setDate] = useState('');

    const [showFilters, setShowFilters] = useState(false);
    const [weekendOnly, setWeekendOnly] = useState(false);
    const [transportType, setTransportType] = useState<TransportDetails['type'] | 'All'>('All');
    const [acType, setAcType] = useState<'All' | 'AC' | 'Non-AC'>('All');

    const filteredPackages = useMemo(() => {
        return MOCK_TRAVEL_PACKAGES.filter(trip => {
            if (from && !trip.startLocation.toLowerCase().includes(from.toLowerCase())) return false;
            if (to && !trip.destination.toLowerCase().includes(to.toLowerCase())) return false;
            if (date && trip.departureDate !== date) return false;
            if (weekendOnly && !trip.isWeekendTrip) return false;
            if (transportType !== 'All' && trip.transport.type !== transportType) return false;
            if (acType !== 'All' && !trip.transport.amenities.includes(acType)) return false;
            return true;
        });
    }, [from, to, date, weekendOnly, transportType, acType]);
    
    const resetFilters = () => {
        setWeekendOnly(false);
        setTransportType('All');
        setAcType('All');
    };

    return (
    <div className="p-4 max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-8">
            <h1 className="text-3xl font-poppins font-bold text-charcoal-gray mb-4">Find Your Next Adventure</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                    <label htmlFor="from" className="block text-sm font-medium text-gray-600">From</label>
                    <input type="text" id="from" value={from} onChange={e => setFrom(e.target.value)} placeholder="e.g., Bangalore" className="mt-1 w-full border-gray-300 rounded-2xl shadow-sm p-3 bg-white text-charcoal-gray placeholder:text-gray-400 focus:ring-2 focus:ring-sky-blue focus:border-transparent" />
                </div>
                 <div>
                    <label htmlFor="to" className="block text-sm font-medium text-gray-600">To</label>
                    <input type="text" id="to" value={to} onChange={e => setTo(e.target.value)} placeholder="e.g., Goa" className="mt-1 w-full border-gray-300 rounded-2xl shadow-sm p-3 bg-white text-charcoal-gray placeholder:text-gray-400 focus:ring-2 focus:ring-sky-blue focus:border-transparent" />
                </div>
                 <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-600">Departure Date</label>
                    <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1 w-full border-gray-300 rounded-2xl shadow-sm p-3 bg-white text-charcoal-gray placeholder:text-gray-400 focus:ring-2 focus:ring-sky-blue focus:border-transparent" />
                </div>
            </div>
             <button onClick={() => setShowFilters(!showFilters)} className="mt-4 flex items-center space-x-2 text-sky-blue font-semibold">
                <AdjustmentsHorizontalIcon className="w-5 h-5"/>
                <span>{showFilters ? 'Hide' : 'Show'} Advanced Filters</span>
             </button>

            {showFilters && (
                <div className="border-t mt-4 pt-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center">
                            <input type="checkbox" id="weekend" checked={weekendOnly} onChange={e => setWeekendOnly(e.target.checked)} className="h-4 w-4 text-sunset-orange border-gray-300 rounded focus:ring-sunset-orange" />
                            <label htmlFor="weekend" className="ml-2 text-sm text-charcoal-gray">Weekend Trips Only</label>
                        </div>

                        <div>
                             <label htmlFor="transport" className="block text-sm font-medium text-gray-600">Transport</label>
                             <select id="transport" value={transportType} onChange={e => setTransportType(e.target.value as any)} className="mt-1 block w-full pl-3 pr-10 py-3 border-gray-300 focus:outline-none focus:ring-sky-blue focus:border-sky-blue sm:text-sm rounded-2xl bg-white text-charcoal-gray">
                                <option>All</option>
                                <option>Tempo Traveller</option>
                                <option>Bus</option>
                                <option>Train</option>
                                <option>Flight</option>
                             </select>
                        </div>
                        
                        {transportType === 'Tempo Traveller' && (
                             <div>
                                <label className="block text-sm font-medium text-gray-600">Comfort</label>
                                <div className="mt-2 flex space-x-4">
                                    <label className="flex items-center"><input type="radio" name="ac" value="All" checked={acType === 'All'} onChange={e => setAcType(e.target.value as any)} className="focus:ring-sunset-orange h-4 w-4 text-sunset-orange border-gray-300" /> <span className="ml-2 text-sm">All</span></label>
                                    <label className="flex items-center"><input type="radio" name="ac" value="AC" checked={acType === 'AC'} onChange={e => setAcType(e.target.value as any)} className="focus:ring-sunset-orange h-4 w-4 text-sunset-orange border-gray-300" /> <span className="ml-2 text-sm">AC</span></label>
                                    <label className="flex items-center"><input type="radio" name="ac" value="Non-AC" checked={acType === 'Non-AC'} onChange={e => setAcType(e.target.value as any)} className="focus:ring-sunset-orange h-4 w-4 text-sunset-orange border-gray-300" /> <span className="ml-2 text-sm">Non-AC</span></label>
                                </div>
                             </div>
                        )}
                    </div>
                     <button onClick={resetFilters} className="text-xs text-gray-500 hover:underline mt-4">Reset Filters</button>
                </div>
            )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPackages.length > 0 ? filteredPackages.map(trip => (
                <TripCard key={trip.id} trip={trip} />
            )) : (
                <p className="col-span-full text-center text-gray-600 py-10">No trips found matching your criteria.</p>
            )}
        </div>
    </div>
    );
};

export default TripsPage;