const redisConnection = require('./redis_connection');
const bluebird = require('bluebird');
const redis = require('redis');
const axios = require('axios');
const client = redis.createClient();
// const apiKey = '12375299-a0b9decb6e5e5dd1c52c768dc';
const apiUrl = 'https://pixabay.com/api/?key=12375299-a0b9decb6e5e5dd1c52c768dc&q=';

async function imageResearch(queryString) {
    let qs = queryString.replace(' ', '+');
    const apiCall = await axios.get(apiUrl + qs + '&image_type=photo');
    return apiCall;
}

bluebird.promisifyAll(redis.RedisClient.prototype);

redisConnection.on('research-request', async (data, channel) => {
    console.log('received research request');
    console.log(data.message);
    const researchedData = await imageResearch(data.message['searchQuery']);
    console.log('research request complete');
    redisConnection.emit('research-response', {
        message: {
            results: researchedData.data,
            username: data.message['username'],
            message: data.message['submitMessage']
        }
    });
});
