import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div>
      <p className="text-3xl text-center p-4">
        Welcome to the <span className="font-bold">Meet</span> app!
      </p>
      <div className="w-full">
        <div className="flex flex-col justify-center items-center">
          <p className="text-2xl text-center p-4">
            Create a new meet session or join an existing one.
          </p>
          <div className="flex flex-row justify-center items-center">
            <Link to="/meet-session">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-2">
                Create New Meet Session
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
