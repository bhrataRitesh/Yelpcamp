if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const Campground = require('../models/campground');
const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');


mongoose.set('strictQuery', false);

const dbUrl = process.env.DB_URL;
mongoose.connect(dbUrl).then(() => {
    console.log("DataBase connected");
}).catch(e => {
    console.log('ERROR');
    console.log(e);
});



const sample = array => array[Math.floor(Math.random() * array.length)];



const seedDB = async () => {
    await Campground.deleteMany({});
    // const c = new Campground({ title: 'purple field' });
    // await c.save();
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '640827ca34c0acb1c12b2741',
            location: `${cities[random1000].city},${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            // image: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat cumque iste pariatur eligendi vel blanditiis, vero incidunt! Dolore excepturi vitae quisquam dolor eligendi tenetur, numquam ipsum provident explicabo magni. Eius.',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            image: [
                {
                    url: 'https://res.cloudinary.com/dyoynbt7i/image/upload/v1677866591/YelpCamp/rwtsbbprtewskked9znz.png',
                    filename: 'YelpCamp/rwtsbbprtewskked9znz',

                }
            ],
        })
        await camp.save();
    }
}
seedDB().then(() => {
    mongoose.connection.close();
});