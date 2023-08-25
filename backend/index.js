const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb+srv://kevork:123@cluster0.khomafv.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

// Employee schema and model
const employeeSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: false
  },
  title: {
    type: String,
    required: false
  },
  location: {
    type: String,
    required: false
  }
});

const Employee = mongoose.model('Employee', employeeSchema);

// Routes
app.get('/employee/list', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal server error');
  }
});

app.post('/employee/create', async (req, res) => {
  const { firstName, lastName, age, department, image, title, location } = req.body;
  try {
    if (age >= 18 && age <= 60) {
      const employee = new Employee({ firstName, lastName, age, department, image, title, location });
      await employee.save();
      res.status(201).send('Employee created successfully');
    } else {
      res.status(400).send('Employee age must be between 18 and 60 years');
    }
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal server error');
  }
});

app.put('/employee/update/:id', async (req, res) => {
  const { firstName, lastName, age, department, image, title, location } = req.body;
  try {
    if (age >= 18 && age <= 60) {
      const employee = await Employee.findByIdAndUpdate(
        req.params.id,
        { firstName, lastName, age, department, image, title, location },
        { new: true }
      );
      if (!employee) {
        return res.status(404).send('Employee not found');
      }
      res.send('Employee updated successfully');
    } else {
      res.status(400).send('Employee age must be between 18 and 60 years');
    }
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal server error');
  }
});

app.delete('/employee/delete/:id', async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).send('Employee not found');
    }
    res.send('Employee deleted successfully');
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal server error');
  }
});

// Start server
app.listen(3003, () => {
  console.log('Server started on port 3003');
});
