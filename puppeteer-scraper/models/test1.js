import mongoose from 'mongoose';

const test1Schema = new mongoose.Schema({
    Location : String,
    Breakfast : [{
        name : String,
    }],
    Lunch : [{
        name : String,
    }],
    LateNight : [{
        name : String,
    }],
});

const Test1 = mongoose.model('Test1', test1Schema, "test1");

export default Test1;