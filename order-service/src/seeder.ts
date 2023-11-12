import { createConnection } from 'mongoose';

const connection = createConnection('mongodb://mongo:27017/restaurant');

const foodArray = [
  { name: 'Mie', price: 10000 },
  { name: 'Es Teh', price: 5000 },
  { name: 'Nasi Goreng', price: 15000 },
  { name: 'Baso', price: 8000 },
  { name: 'Jus Jeruk', price: 6000 },
  { name: 'Soto', price: 7000 },
  { name: 'Nasi Putih', price: 5000 },
];

connection
  .collection('menus')
  .insertMany(foodArray)
  .then((r) => {
    console.log(r);
  })
  .catch((e) => {
    console.log(e);
    connection.close();
    process.exit(0);
  });
