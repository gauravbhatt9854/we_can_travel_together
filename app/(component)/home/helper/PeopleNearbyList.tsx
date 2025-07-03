'use client';
import React from 'react';
import PersonCard from './PersonCard';

interface Person {
  userId: string;
  name: string;
  from: { name: string };
  to: { name: string };
  distanceKm: number;
  match?: string;
}

interface Props {
  people: Person[];
}

const PeopleNearbyList: React.FC<Props> = ({ people }) => {
  if (people.length === 0) {
    return (
      <div className="text-sm text-gray-600">No nearby people found.</div>
    );
  }

  return (
    <div className="space-y-3">
      {people.map((person, idx) => (
        <PersonCard
          key={idx}
          name={person.name}
          from={person.from.name}
          to={person.to.name}
          distanceKm={person.distanceKm}
          match={person.match}
        />
      ))}
    </div>
  );
};

export default PeopleNearbyList;