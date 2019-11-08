# Local Server

## Goal
This local server can be used to simulate _some_ REST answers without calling directly the remote server.

This solution is useful during the development if we need some services from a remote server (e.g. login) but we want
 to test the application with local data because we are commuting/playing with different use cases etc.. 

## How it works
This local servers is a nodejs application. It acts as proxy for each request, if the request is not in the list of the 'simulated answers' this one is proxied to the target server.
The JSON simulated answers are stored in files with the name '[url].json'.

E.g. http://localhost:3000/customers will look for the file './json/customers.json'.
The active urls have to be activated in server.js changing the `LOCAL_ANSWERS_URL`, e.g. `const LOCAL_ANSWERS_URL = ['/customers']`;

If the path is not present in `LOCAL_ANSWERS_URL` the request will be sent to the remote server, e.g.:
`http://mytestserver.xyz/customers` and the answer proxied to the client.

### Configuration
The nodejs server is configured to answer requests sent to port 3000 and it looks for the server at the port 8080.
The client app has to send all the requests to port 3000.

### Start
`node server.js`
