import { Link } from 'react-router-dom';

export default function JobCard({ job }) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-gray-800">{job.title}</h3>
          <span className="bg-gray-200 text-gray-800 text-xs px-3 py-1 rounded-full">
            {job.category}
          </span>
        </div>
        <p className="text-gray-600 mt-2">{job.location}</p>
        <p className="text-gray-700 mt-4">{job.description}</p>

        <div className="mt-4 flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-800">
            ${job.price}/hr
          </span>
          <Link to={`/${job.id}`}>
            <button className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-md transition-colors duration-200 shadow-md hover:shadow-lg">
              Apply Now
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
