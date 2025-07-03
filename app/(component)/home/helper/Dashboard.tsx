'use client';
import React from 'react';
import MyLocationCard from './MyLocationCard';
import PeopleNearbyList from './PeopleNearbyList';

interface LocationEntry {
  userId: string;
  name: string;
  from: { name: string };
  to: { name: string };
  distanceKm: number;
  match?: string;
}

interface Props {
  results: LocationEntry[];
  currentUserId: string;
  onRefresh: () => void; // 🔄 New: callback from parent to refetch data
}

const Dashboard: React.FC<Props> = ({ results, currentUserId, onRefresh }) => {
  const myPost = results.find((p) => p.userId === currentUserId);
  const others = results.filter((p) => p.userId !== currentUserId);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
      {myPost && (
        <div className="md:col-span-1">
          <MyLocationCard
            userId={myPost.userId}
            name={myPost.name}
            from={myPost.from.name}
            to={myPost.to.name}
            distanceKm={myPost.distanceKm}
            onDeleted={onRefresh} // 👈 Call parent to re-fetch after delete
          />
        </div>
      )}

      <div className={`md:col-span-${myPost ? 2 : 3} bg-gray-50 p-4 border rounded shadow max-h-[400px] overflow-y-auto`}>
        <h3 className="text-lg font-bold mb-2 text-gray-800">Nearby People</h3>
        <PeopleNearbyList people={others} />
      </div>
    </div>
  );
};

export default Dashboard;