A simple CRUD application using Node.js

Install the dependencies present in package.json

Use basic authentication with:-

username = admin

password = admin

the basic urls are :-

'http://127.0.0.1:3000/create'

'http://127.0.0.1:3000/read'

'http://127.0.0.1:3000/update'

'http://127.0.0.1:3000/delete'

Sample curl command through postman would look like :-

```
curl --location --request POST 'http://127.0.0.1:3000/create' \
--header 'Authorization: Basic YWRtaW46YWRtaW4=' \
--header 'Content-Type: application/json' \
--header 'Cookie: csrftoken=AnytpRebwI74ZKcfzSDtulboWd9fN7TbuugvL2RLWDtRlO5L2DMpbS9yJnMaPwcs' \
--data-raw '{
    "address": "smtp",
    "username": "example@gmail.com",
    "password": "abcdef",
    "port": 123
}'

```

NOTE : Authorization is encoded in base64