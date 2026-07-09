// Generate 1000 Customers
const generateCustomers = () => {
  const customers = [];
  const firstNames = ["Rahul", "Aman", "Priya", "Neha", "Rohit", "Vikram", "Sneha", "Karan", "Anjali", "Siddharth", "Satwik", "Riya"];
  const lastNames = ["Sharma", "Singh", "Verma", "Patel", "Reddy", "Gupta", "Rao", "Kumar", "Deshmukh", "Joshi"];
  const cities = ["Delhi", "Mumbai", "Bangalore", "Hyderabad", "Pune", "Chennai", "Kolkata", "Ahmedabad", "Jaipur", "Lucknow"];
  const statuses = ["Active", "Inactive", "Premium"];

  for (let i = 1; i <= 1000; i++) {
    const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
    const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    customers.push({
      id: `CUST-${10000 + i}`,
      name: `${fn} ${ln}`,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@example.com`,
      phone: `+91 9${Math.floor(100000000 + Math.random() * 900000000)}`,
      address: `${Math.floor(Math.random() * 999) + 1} Main St, ${city}`,
      orders: Math.floor(Math.random() * 50),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      joinDate: new Date(Date.now() - Math.random() * 10000000000).toISOString().split('T')[0]
    });
  }
  return customers;
};

// Generate 1000 Drivers
const generateDrivers = () => {
  const drivers = [];
  const names = ["Aman Singh", "Ramesh Kumar", "Vikram Rathore", "Suresh Patel", "Abdul Khan", "Rajesh Verma", "Deepak Sharma", "Manoj Tiwari", "Anil Deshmukh", "Kishore Reddy"];
  const vehicles = ["Maruti Eeco", "Tata Ace", "Mahindra Bolero", "Honda Activa", "Bajaj Chetak", "Electric Van"];
  const statuses = ["Available", "On Delivery", "Offline"];

  for (let i = 1; i <= 1000; i++) {
    drivers.push({
      id: `DRV-${5000 + i}`,
      name: names[Math.floor(Math.random() * names.length)] + (i > 10 ? ` ${i}` : ""),
      phone: `+91 8${Math.floor(100000000 + Math.random() * 900000000)}`,
      vehicle: vehicles[Math.floor(Math.random() * vehicles.length)],
      license: `DL-${Math.floor(1000000 + Math.random() * 9000000)}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      rating: (Math.random() * 1.5 + 3.5).toFixed(1), // 3.5 to 5.0
      deliveries: Math.floor(Math.random() * 1000),
    });
  }
  return drivers;
};

export const MOCK_CUSTOMERS = generateCustomers();
export const MOCK_DRIVERS = generateDrivers();
