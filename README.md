## Climb Journal

This is the UI repo for my application for tracking climbing sessions, and visualizing climbing progress over time.

- React 19.2.7
- node 24.13.2
- Typescript 6.0.2

#### Development Tools
- React
- npm
- Docker
- Git

### Set up

`npm install`

`npm run dev`

The backend application and database can be run through via Docker.
https://github.com/ThomasMaher/climb_journal

Clone the repo. In a new terminal window `cd climb_journal` and run
`docker compose up -d`

In another terminal widnow, create the database (first time only):

`docker compose run --rm rails bin/rails db:prepare db:seed`

#### To run tests

`docker compose run --rm -e RAILS_ENV=test rails bundle exec rspec`


#### TODO:
- ⏭️ Containerize the React frontend
- Improved analytics and visualizations
- Create a 'goals' feature