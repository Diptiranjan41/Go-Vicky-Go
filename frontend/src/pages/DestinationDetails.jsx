import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { destinations } from "../data/destinations";

const DestinationDetails = () => {
  const { id } = useParams();
  const destination = destinations.find((d) => d.id === id);
  const navigate = useNavigate();

  if (!destination) return <div className="text-white p-8">Destination not found</div>;

  return (
    <div className="bg-black text-white min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <img
          src={destination.image}
          alt={destination.name}
          className="rounded-2xl w-full mb-6"
        />
        <h1 className="text-4xl font-bold text-cyan-400">{destination.name}</h1>
        <p className="text-gray-300 mt-4">{destination.description}</p>

        <ul className="mt-6 list-disc list-inside text-gray-400">
          {destination.highlights.map((item, index) => (
            <li key={index}>🗺️ {item}</li>
          ))}
        </ul>

        <button
          onClick={() => {
            alert(`${destination.name} added to your planner!`);
            navigate("/explore");
          }}
          className="mt-8 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-xl text-white"
        >
          ➕ Add to Planner
        </button>
      </div>
    </div>
  );
};

export default DestinationDetails;
