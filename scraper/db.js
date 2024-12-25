import mongodb from 'mongodb';

const MongoClient = mongodb.MongoClient;

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

export default client;