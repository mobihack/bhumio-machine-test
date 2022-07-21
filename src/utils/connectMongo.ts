import { DB_URI } from 'config';
import mongoose from 'mongoose';

const connectMongo = async () => mongoose.connect(DB_URI);

export default connectMongo;
