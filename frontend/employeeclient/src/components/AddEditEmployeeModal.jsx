import React, { useState } from 'react';
import { Button, Modal, TextField } from '@mui/material';
import Swal from 'sweetalert2';

const AddEditEmployeeModal = ({ isOpen, onRequestClose, onSave, isEditModal, editEmployee, Closing }) => {
  const [firstName, setFirstName] = useState(editEmployee ? editEmployee.firstName : '');
  const [lastName, setLastName] = useState(editEmployee ? editEmployee.lastName : '');
  const [department, setDepartment] = useState(editEmployee ? editEmployee.department : '');
  const [age, setAge] = useState(editEmployee ? editEmployee.age : '');
  const [title, setTitle] = useState(editEmployee ? editEmployee.title : '');
  const [location, setLocation] = useState(editEmployee ? editEmployee.location : '');
  const [image, setImage] = useState(editEmployee ? editEmployee.image : '');
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !department || !age || !title || !location) {
      Swal.fire({
        icon: 'error',
        title: 'Incomplete Form',
        text: 'Please fill in all required fields.',
      });
      return;
    }

    if (age < 18 || age > 60) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Age',
        text: 'Employee age must be between 18 and 60 years.',
      });
      return;
    }

    const newEmployee = {
      firstName,
      lastName,
      department,
      age: parseInt(age),
      title,
      location,
      image: selectedImage || image,
    };

    if (isEditModal) {
      onSave({ ...newEmployee, id: editEmployee._id });
    } else {
      onSave(newEmployee);
    }

    setFirstName('');
    setLastName('');
    setDepartment('');
    setAge('');
    setTitle('');
    setLocation('');
    setImage('');
    setSelectedImage(null);
  };

  return (
    <Modal open={isOpen} onClose={Closing} >
      <div style={{ backgroundColor: 'white', padding: '24px', height: '100vh', borderRadius: '8px' }}>
        <h2>{isEditModal ? 'Edit Employee' : 'Add Employee'}</h2>
        <form onSubmit={handleSubmit}>
          <TextField
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Age"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
          />
          <TextField
            label="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            fullWidth
          />
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {selectedImage && (
            <img src={selectedImage} alt="Selected" style={{ width: '100px', height: '100px' }} />
          )}
          <Button type="submit" variant="contained" sx={{ mr: 2 }}>
            {isEditModal ? 'Save Changes' : 'Add Employee'}
          </Button>
          <Button variant="contained" onClick={Closing}>
            Cancel
          </Button>
        </form>
      </div>
    </Modal>
  );
};

export default AddEditEmployeeModal;
