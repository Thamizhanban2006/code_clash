const mongoose = require('mongoose');
const {Questions} = require('./models/Room');

mongoose.connect('mongodb://localhost:27017/codeclash');

const questions = [
  {
    title: 'Sum of Two Numbers',
    description: 'Given two integers, return their sum.',
    input: '2 3',
    expectedOutput: '5',
  },
  {
    title: 'Find Factorial',
    description: 'Given an integer N, return the factorial of N.',
    input: '5',
    expectedOutput: '120',
  },
  {
    title: 'Reverse a String',
    description: 'Given a string, return the reversed string.',
    input: 'hello',
    expectedOutput: 'olleh',
  }
];

async function seed() {
  await Questions.deleteMany({});
  await Questions.insertMany(questions);
  console.log('✅ Questions seeded successfully!');
  mongoose.connection.close();
}

seed();
