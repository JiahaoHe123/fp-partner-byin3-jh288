# Sign up api
This api works for the sign in process of our website, it would allow users to input the username and password, and the system would push that information to the database.

## calculate reactangle information

**Request Format:** /signup

**Request Type:** post

**Returned Data Format**: JSON

**Description:** the user would input their email, username and password through a post command, need all of the information to create the new account.

**Example Request:** /signup

**Example Response:**
```json
{
"email":12345@gmail.com
"Username":123
"Password":12345678
}
```
**Error Handling:**
If the user had pushed an email which is not a valid email or this email had already
in the database, the server would return a 400 error which remind the user this email
had already have an account.
If the password is so short, the server would return another error which suggest there
are some issues.



# Sign in api
This api is works for sign in the website we used, the system would require users to input
their username, email and password.

## calculate reactangle information

**Request Format:** /signin/:email/:username/:password where ```email```, ```username``` and ```password``` are user input

**Request Type:** get

**Returned Data Format**: PLAIN TEXT

**Description:**the user would input their ```email```, ```username``` and ```password``` through a get command, if the account recorded in the database and every other information had been correct, the system would inform the user you have successfully sign in into your account.

**Example Request:** /signin/:email/:username/:password

**Example Response:**
```
"You had successfully signin into your account"
```

**Error Handling:**
If the user had pushed an email which is not a valid email or this email is not
in the database, the server would return a 400 error which remind the user this email
is not a valid one and you should make an account first.
If the account is exist but the password user input would be a wrong password, the server
would produce a 400 error to remind user that you have input the wrong password.


# My profile api
This endpoint will be used to view the users’ personal information, including the enrolled email, password,and user’s name. In addition, this endpoint will allow users to view their enrolled course.

## Get users’ own information

**Request Format:** /profile/:email ```email``` will be sent from the endpoint sign up or sign in

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** The user input ```email``` will be used to find the information of the specific users’ information in our database

**Example Request:** /profile/12345@gmail.com

**Example Response:**
```json
{
 "email":12345@gmail.com
 "Username":123
 "Password":********
}
```

**Error Handling:**
no error message.


# Enrolled course api
This endpoint will be used to view the users enrolled course
## Get users enrolled course
**Request Format:** /profile/enrolled/:email ```email``` will be sent from the endpoint profile

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** The user input ```email``` will be used to find the courses that have been enrolled by the specific user.

**Example Request:** /profile/enrolled/12345@gmail.com

**Example Response:**
```json
{
 "TOEFL":[Listening:[normal], Reading:[vip]]
 "GRE":[Gramma:[normal], Math:[vip]]
}
```

**Error Handling:**
None for this endpoint


# delete course api
This endpoint will be used to delete the users enrolled course

## Get users enrolled course

**Request Format:** /profile/enrolled/delete/:email/:major/:subject/:level ```email``` will be sent from the endpoint /profile/enrolled, ```major``` will be the major of the course like GRE, ```subject``` will be the subject in a specific major like math in GRE, ```Level``` will be the level of the specific subject like Math[Vip].

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** The user input will be used to find the specific courses that the user wants to delete.

**Example Request:** /profile/enrolled/delete/12345@gmail.com/TOEFL/Listening/normal

**Example Response:**
```json
{
 "TOEFL":[Reading:[vip]] #(the Listening is deleted)
 "GRE":[Gramma:[normal], Math:[vip]]
}
```

**Error Handling:**
None for this endpoint


# find course proposal
This endpoint will be used to find all the course

## Get users enrolled course

**Request Format:** /profile/findCourse/:email ```email``` will be sent from the endpoint profile

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** The user input ```email``` will be used to link to the specific user

**Example Request:** /profile/findCourse/12345@gmail.com

**Example Response:**
```json
{
 "TOEFL":[Listening:[normal, vip], Reading:[normal, vip], Writing:[normal, vip], Speaking:[normal, vip]]
 "GRE":[Gramma:[normal, vip], Math:[normal, vip]]
}
```

**Error Handling:**
None for this endpoint


# enroll course proposal
This endpoint will be used to enroll the specific course

## Get users enrolled course

**Request Format:** /profile/enrollCourse/:email/:major/:subject/:level
```email``` will be sent from the endpoint /profile/enrolled, ```major``` will be the major of the course like GRE, ```subject``` will be the subject in a specific major like math in GRE, ```Level``` will be the level of the specific subject like Math[Vip].

**Request Type:** POST

**Returned Data Format**: JSON

**Description:** The user input will be used send to the database linking to the specific user

**Example Request:** /profile/enrollCourse/12345@gmail.com/GRE/Math/normal

**Example Response:**
```json
{
 "email":12345@gmail.com
  "GRE":[Math:[normal]]
}
```

**Error Handling:**
Non for this endpoint