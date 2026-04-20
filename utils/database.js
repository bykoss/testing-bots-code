const mongoose = require('mongoose');
const config = require('../config.json');

async function connectDB() {
  const uri = config.mongoURI || process.env.MONGO_URI;
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Conectado a MongoDB');
  } catch (err) {
    console.error('❌ Error al conectar a MongoDB:', err);
    process.exit(1);
  }
}

module.exports = { connectDB };
