
## What is En2Deux

A collaborative work with Laurent M. and Agash J. made for the 2nd project of Ironhack. 

For those who have organized events with their friends, family or collegues,
We know how much it is a struggle to make sure you satisfy everyone's demands.
They never have the same plannings or budgets, some take a long time to answer ...etc 🤯

Thus, that is exactly why we created En Deux-Deux !



## About Implementations:

This implementation uses the following:
   - A document based database hosted on MongoDB on Atlas
   - JWT for authentication
   - Hekoru for deployment 



## Data model

### Models
- User
- Event (created by a user)
- Attendee (user attending to an event)
- Option (option of event for what attendees have to vote)
- Vote (vote by attendee to event option)
- Friendship



## User Experience
User1 creates an event, he fills the different options.
Then he invites friends to join event and they'll vote for the best option.



## Tech Stack

Nodejs | Express | MongoDB (Compass locally & Altas for managing the deployed database)

_All data in the cloud is stored in Europe._



## Documentation

https://documenter.getpostman.com/view/22855445/VUxRN5fe


## Deployed API

https://test-endeuxdeux.herokuapp.com/
