import mongodb from 'mongodb';

const MongoClient = mongodb.MongoClient;

const uri = "mongodb+srv://matthew:powerkids@cluster0.laeskgp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, { useNewUrlParser: true });

export default client;