# FitCal REST API

![api_scheme](https://github.com/FitCal-app/fitcal-api/assets/39599216/c9e2b34b-e627-4acf-aa16-4db75b3c1ae2)

Public API available at https://fitcal-api.kevinazemi.com/api

## Run the app

    npm i
    npm run dev


## Populate Environment file

    NODE_ENV=development or production
    PORT=port of your api (ex. 5000)
    FRONTEND=link of your frontend for cors (ex. http://127.0.0.1:3000)
    
    MONGO_URL=your mongodb connection string (ex. mongodb+srv://admin:superStrongPassword@test.mongodb.net/FitCal?retryWrites=true&w=majority)
    REDIS_URL=your mongodb connection string (ex. redis://default:superStrongPassword@server.redis-cloud.com:14973)
    
    CLERK_WEBHOOK_SECRET_KEY=your clerk webhook secret key

