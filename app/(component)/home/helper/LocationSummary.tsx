// components/home/helper/LocationSummary.tsx
import React from "react";

interface Location {
  name: string;
  lat?: number;
  lng?: number;
}

interface Props {
  from: Location | null | undefined;
  to: Location | null | undefined;
}

const LocationSummary: React.FC<Props> = ({ from, to }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow border text-sm text-gray-800">
      <div className="mb-2">
        <strong>From:</strong>{" "}
        {from?.name ? (
          <>
            {from.name}
            {from.lat && from.lng && (
              <span className="text-gray-500 text-xs">
                {" "}
                ({from.lat.toFixed(4)}, {from.lng.toFixed(4)})
              </span>
            )}
          </>
        ) : (
          <span className="text-gray-400">Not set</span>
        )}
      </div>
      <div>
        <strong>To:</strong>{" "}
        {to?.name ? (
          <>
            {to.name}
            {to.lat && to.lng && (
              <span className="text-gray-500 text-xs">
                {" "}
                ({to.lat.toFixed(4)}, {to.lng.toFixed(4)})
              </span>
            )}
          </>
        ) : (
          <span className="text-gray-400">Not set</span>
        )}
      </div>
    </div>
  );
};

export default LocationSummary;