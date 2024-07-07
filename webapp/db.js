import mongodb from 'mongodb';

const MongoClient = mongodb.MongoClient;

const uri = "mongodb+srv://matthew:powerkids@cluster0.laeskgp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, { 
    minPoolSize: 10,
    maxPoolSize: 50,
});

client.connect(err => {
    if (err) {
        console.log('Failed to connect to MongoDB', err)
        process.exit(1);
    }
    console.log('Connected to MongoDB')
})

export default client;

