require('dotenv').config()
require('../db')
const User = require("../models/User.model");
const mongoose = require('mongoose');

const users = [
    {
        username: 'AgashLaMenace',
        name: 'Agash',
        surname: 'zemfzgjzlgj',
        password: 'Usddfgdfhdfh234!',
        genre: 'stupid',
        phoneNumber: 05623522352253,
        address: "9 avenue de la fameeee, 93100, Le ZOOOOOO"
        email: 'agashDKash@mail.com',
      },
      {
        username: 'Mouttakrim',
        name: 'Laurent',
        surname: 'Mouttapa',
        password: 'Usddfgdfhdfh234!',
        genre: 'male',
        phoneNumber: 0623522352253,
        address: "13 rue Ernestine, 75018, BEEESBAAAAAR"
        email: 'lau@hooooootmail.com',
      },
      {
        username: 'LentrepreneurPrecoce',
        name: 'Paul',
        surname: 'Nizet',
        password: 'Usddfgfhdfh234!',
        genre: 'shemale',
        phoneNumber: 0723522352253,
        address: "Station Fuck, 75013, La capitale"
        email: 'Paul@sneakmart.com',
      },
      {
        username: 'Kinofr',
        name: 'Sebastien',
        surname: 'Tmtcjesaispas',
        password: 'Usddfgdfhdfh234!',
        genre: 'male',
        phoneNumber: 03522352253,
        address: "12 rue du squatt, 75020, Chez ma meuf"
        email: 'sebakakino@mail.com',
      },
      {
        username: 'Lequestionneurfouuu',
        name: 'Valery',
        surname: 'Valoche',
        password: 'Usddfgdfhdfh234!',
        genre: 'stupid',
        phoneNumber: 093522352253,
        address: "5 avenue de la quarantaine, 77310, Melun"
        email: 'valoche@questionpourunchampion.com',
      },
      {
        username: 'Marakechdurire',
        name: 'Walid',
        surname: 'jamaisla',
        password: 'Usfgdfhdfh234!',
        genre: 'male',
        phoneNumber: 0466352253,
        address: "9 avenue de la fameeee, 93100, Le ZOOOOOO"
        email: 'blague@carambar.com',
      },
      {
        username: 'BritishbutItalian',
        name: 'Hamza',
        surname: 'cotcotcot',
        password: 'Usddfgdfhdfh234!',
        genre: 'male',
        phoneNumber: 0465725253,
        address: "118 rue du poulet, 75017, Rome"
        email: 'koucikouca@mail.com',
      },
]


async function seedTheData(newUsers) {
    console.log("Deleting users...");
    try{
        await User.deleteMany()
        const createUsers = User.create(newUsers);
        console.log(`${createUsers.length} users created !`);
        await mongoose.disconnect();
    }
    catch(error){
        console.error(error.message)
    }
}

seedTheData(users)
