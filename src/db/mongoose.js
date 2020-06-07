const mongoose = require('mongoose');

// Connecten van database

mongoose.connect(process.env.MONGODB_URL,  {
    useNewUrlParser: false,
    useCreateIndex: true,
    useFindAndModify: false
});