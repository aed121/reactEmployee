import React, { useEffect, useState, useContext } from 'react';
import { fetchEmployees } from '../api';
import { Link } from 'react-router-dom';
import { FavoritesContext } from '../context/FavoritesContext';

const Home = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { addFavorite, favorites } = useContext(FavoritesContext);

  useEffect(() => {
    const getEmployees = async () => {
      try {
        const employees = await fetchEmployees();
        setEmployees(employees);
      } catch (error) {
        console.error(error.message);
      }
    };

    getEmployees();
  }, []);

  const filteredEmployees = employees.filter(employee =>
    `${employee.name.first} ${employee.name.last}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Worker Directory</h1>
      <input
        type="text"
        placeholder="Search by name"
        className="form-control mb-3"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="row">
        {filteredEmployees.map((employee, index) => (
          <div key={index} className="col-md-4 mb-4">
            <div className="card">
              <img src={employee.picture.large} className="card-img-top" alt={`${employee.name.first} ${employee.name.last}`} />
              <div className="card-body">
                <h5 className="card-title">{employee.name.first} {employee.name.last}</h5>
                <p className="card-text">Age: {employee.dob.age}</p>
                <p className="card-text">Location: {employee.location.city}, {employee.location.country}</p>
                <Link to={`/employee/${index}`} className="btn btn-primary mr-2">More Details</Link>
                <button 
                  onClick={() => addFavorite(employee)} 
                  className={`btn ${favorites.find(fav => fav.login.uuid === employee.login.uuid) ? 'btn-danger' : 'btn-secondary'}`}
                >
                  {favorites.find(fav => fav.login.uuid === employee.login.uuid) ? 'Unfavorite' : 'Add to Favorites'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
