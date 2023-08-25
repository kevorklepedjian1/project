import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddEditEmployeeModal from './AddEditEmployeeModal';
import Swal from 'sweetalert2';

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [editEmployee, setEditEmployee] = useState();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    axios.get('http://localhost:3003/employee/list')
      .then(res => {
        setEmployees(res.data);
      })
      .catch(err => console.log(err));
  }, []);

  const handleDelete = id => {
    Swal.fire({
      title: 'Are you sure you want to delete this employee?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:3003/employee/delete/${id}`)
          .then(res => {
            setEmployees(employees.filter(employee => employee._id !== id));
            Swal.fire({
              icon: 'success',
              title: 'Employee deleted successfully',
            });
          })
          .catch(err => console.log(err));
      }
    });
  };

  const handleAddEmployee = () => {
    setIsAddEditModalOpen(true);
    setIsEditModal(false);
    setEditEmployee(null);
  };

  const handleEditEmployee = (employee) => {
    setIsAddEditModalOpen(true);
    setIsEditModal(true);
    setEditEmployee(employee);
  };

  const handleCloseModal = () => {
    setIsAddEditModalOpen(false);
    setIsEditModal(false);
    setEditEmployee(null);
  };

  const handleEmployeeSubmit = (employee) => {
    handleCloseModal();
    if (employee.id) {
      axios.put(`http://localhost:3003/employee/update/${employee.id}`, employee)
        .then(res => {
          setEmployees(employees.map(emp => emp._id === employee.id ? employee : emp));
          Swal.fire({
            icon: 'success',
            title: 'Employee updated successfully',
          });
        })
        .catch(err => console.log(err));
    } else {
      axios.post('http://localhost:3003/employee/create', employee)
        .then(res => {
          setEmployees([...employees, employee]);
          Swal.fire({
            icon: 'success',
            title: 'Employee added successfully',
          });
        })
        .catch(err => console.log(err));
    }
  };

  const handleSave = (employee) => {
    handleEmployeeSubmit(employee);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset pagination when searching
  };

  const filteredEmployees = employees.filter(employee =>
    employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = pageNumber => setCurrentPage(pageNumber);
  console.log(isAddEditModalOpen);

  const fetchRandomUsers = async (numUsers) => {
    try {
      const response = await axios.get(`https://randomuser.me/api/?results=${numUsers}`);
  
      const randomUsers = response.data.results.map(user => ({
        firstName: user.name.first,
        lastName: user.name.last,
        department: 'Random Department',
        age: user.dob.age,
        title: 'Random Title',
        location: `${user.location.city}, ${user.location.country}`,
        image: user.picture.large,
      }));
  
      randomUsers.forEach(async (user) => {
        try {
          await axios.post('http://localhost:3003/employee/create', user);
        } catch (error) {
          console.error('Error adding random user:', error);
        }
      });
  
      setEmployees([...employees, ...randomUsers]);
      Swal.fire({
        icon: 'success',
        title: 'Random Employees Added',
        text: `Added ${numUsers} random employees to the list.`,
      });
    } catch (error) {
      console.error('Error fetching random users:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while fetching random users.',
      });
    }
  };
  

  return (
    <div>
      <h1 className='sa'>Employees</h1>
      <button onClick={handleAddEmployee}>Add Employee</button>
      <button onClick={() => fetchRandomUsers(10)}>Add Random Employees</button> {/* New button */}
      <input type="text" placeholder="Search by name" value={searchTerm} onChange={handleSearch} autoFocus id="search" />
      <div className='k'>
        <table className="content-table">
        <thead>
            <tr>
              <th>Image</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Department</th>
              <th>Age</th>
              <th>Title</th>
              <th>Location</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map(employee => (
              <tr key={employee._id}>
               <td>
                  <img src={employee.image} alt="Employee" style={{ width: '50px', height: '50px' , borderRadius:'50%'}} />
                </td>
                <td>{employee.firstName}</td>
                <td className="active-row">{employee.lastName}</td>
                <td className="active-row">{employee.department}</td>
                <td>{employee.age}</td>
                <td>{employee.title}</td>
                <td>{employee.location}</td>
                <td>
                  <button onClick={() => handleEditEmployee(employee)}>Edit</button>
                </td>
                <td>
                  <button onClick={() => handleDelete(employee._id)}>X</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
        {Array.from({ length: Math.ceil(filteredEmployees.length / itemsPerPage) }).map((_, index) => (
            <button key={index} onClick={() => paginate(index + 1)}>
              {index + 1}
            </button>
          ))}
        </div>
      </div>
      {isAddEditModalOpen && (
        <AddEditEmployeeModal
          isOpen={isAddEditModalOpen}
          isEditModal={isEditModal}
          editEmployee={editEmployee}
          isClose={handleCloseModal}
          onSubmit={handleEmployeeSubmit}
          onSave={handleSave}
          Closing={() => setIsAddEditModalOpen(false)}
        />
      )}
    </div>
  );
}

export default EmployeeList;
