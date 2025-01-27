import { Storage } from '@google-cloud/storage';

// Initialize the Google Cloud Storage client
const storage = new Storage({
    keyFilename: './cloudkey.json',
});

// Define the bucket name
const bucketName = 'zoneimages_saved';

// Get a reference to the bucket
const bucket = storage.bucket(bucketName);

// Export the storage and bucket for use
export { storage, bucket };