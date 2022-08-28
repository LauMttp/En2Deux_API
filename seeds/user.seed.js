require("dotenv").config();
require("../db");
const User = require("../models/User.model");
const mongoose = require("mongoose");

const users = [
  {
    username: "AgashLaMenace",
    name: "Agash",
    surname: "zemfzgjzlgj",
    password: "Usddfgdfhdfh234!",
    genre: "male",
    phoneNumber: 05623522352253,
    email: "agashDKash@mail.com",
  },
  {
    username: "Mouttakrim",
    name: "Laurent",
    surname: "Mouttapa",
    password: "Usddfgdfhdfh234!",
    genre: "male",
    phoneNumber: 0623522352253,
    email: "lau@hooooootmail.com",
  },
  {
    username: "LentrepreneurPrecoce",
    name: "Paul",
    surname: "Nizet",
    password: "Usddfgfhdfh234!",
    genre: "female",
    phoneNumber: 0723522352253,
    email: "Paul@sneakmart.com",
  },
  {
    username: "Kinofr",
    name: "Sebastien",
    surname: "Tmtcjesaispas",
    password: "Usddfgdfhdfh234!",
    genre: "male",
    phoneNumber: 03522352253,
    email: "sebakakino@mail.com",
  },
  {
    username: "Lequestionneurfouuu",
    name: "Valery",
    surname: "Valoche",
    password: "Usddfgdfhdfh234!",
    genre: "male",
    phoneNumber: 093522352253,
    email: "valoche@questionpourunchampion.com",
  },
  {
    username: "Marakechdurire",
    name: "Walid",
    surname: "jamaisla",
    password: "Usfgdfhdfh234!",
    genre: "male",
    phoneNumber: 0466352253,
    email: "blague@carambar.com",
  },
  {
    username: "BritishbutItalian",
    name: "Hamza",
    surname: "cotcotcot",
    password: "Usddfgdfhdfh234!",
    genre: "male",
    phoneNumber: 0465725253,
    email: "koucikouca@mail.com",
  },
];

async function seedTheData(newUsers) {
  console.log("Deleting users...");
  try {
    await User.deleteMany();
    const createUsers = User.create(newUsers);
    console.log(`${createUsers.length} users created !`);
    await mongoose.disconnect();
  } catch (error) {
    console.error(error.message);
  }
}

seedTheData(users);
