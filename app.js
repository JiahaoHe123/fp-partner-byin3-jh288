/*
 * Name: Bochao Yin, Jiahao He
 * Date: 2023.12.12
 * Section: CSE 154 AD
 * TA name: Marina Wooden
 *
 * This is app.js file which mainly used for creating a set of endpoints which
 * servers for all of the operations.
 */
"use strict";

const express = require('express');
const DEFAULT = 8080;
const app = express();
app.use(express.urlencoded({ extended: true }));
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');
const multer = require("multer");
app.use(express.json());
app.use(multer().none());

let thisEmail;

const INVALID_PARAM_ERROR = 400;
const SERVER_ERROR = 500;
const SERVER_ERROR_MSG = 'An error occurred on the server. Try again later.';
const CLIENT_ERROR_MSG = 'Missing one or more of the required params.';

/**
 * Establishes a database connection to a database and returns the database object.
 * Any errors that occur during connection should be caught in the function
 * that calls this one.
 * @returns {Object} - The database object for the connection.
 */
async function getDBConnection() {
  const db = await sqlite.open({
    filename: 'course(3).db',
    driver: sqlite3.Database
  });
  return db;
}

/**
 * Express route to handle GET requests to course/signin/:email/:password
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
app.get('/course/signin/:email/:password', async function (req, res) {
  try {
    let email = req.params.email;
    let password = req.params.password;
    let db = await getDBConnection();
    let qry = "SELECT * FROM user WHERE email = ?";
    let pw = await db.get(qry, email);
    await db.close();
    if (!pw) {
      return res.type('text').send('Sorry you do not have an account');
    }
    if (password !== pw.passward) {
      res.type('text').send('Password is not right');
    } else {
      thisEmail = email;
      res.type('text').send('Successfully Logged in!');
    }
  } catch (err) {
    res.type('text');
    res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
  }
});

/**
 * Express route to handle GET requests to /course/signup
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
app.post('/course/signup', async function (req, res) {
  if (!req.body) {
    res.type('text').status(INVALID_PARAM_ERROR);
    return res.send(CLIENT_ERROR_MSG);
  }
  let userEmail = req.body.email;
  let userName = req.body.Username;
  let passWord = req.body.Password;
  thisEmail = userEmail;
  if ((userName && passWord) && userEmail) {
    try {
      let db = await getDBConnection();
      if (await checkUsernameExists(res, userEmail)) {
        let qry = 'INSERT INTO user (username, passward, email) VALUES (?, ?, ?)';
        let changes = await db.run(qry, userName, passWord, userEmail);
        helperOne(res, changes, userEmail);
        await db.close();
      } else {
        await db.close();
        res.type('text').send('You already have an account!');
      }
    } catch (err) {
      res.type('text').status(SERVER_ERROR);
      res.send(SERVER_ERROR_MSG);
    }
  } else {
    res.type('text').status(INVALID_PARAM_ERROR);
    res.send(CLIENT_ERROR_MSG);
  }
});

/**
 * Express route to handle GET requests to /course/signup
 *
 * @param {Object} res - The Express response object.
 * @param {Object} changes - changes made.
 * @param {string} userEmail - user email.
 */
function helperOne(res, changes, userEmail) {
  if (changes.changes === 1) {
    res.type('text').send("Successfully created with eamil: " + userEmail);
  } else {
    res.type('text').send('fail to create user.');
  }
}

/**
 * check whether this user email is valid.
 *
 * @param {Object} res - The Express response object.
 * @param {string} email - user email.
 */
async function checkUsernameExists(res, email) {
  let db = await getDBConnection();
  let qry = "SELECT * FROM user WHERE email = ?";
  try {
    let menu = await db.get(qry, email);
    await db.close();
    return !menu;
  } catch (err) {
    res.type('text');
    res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
  }
  return true;
}

/**
 * check whether the user exist
 *
 * @param {string} email - user email.
 * @param {string} course - the name of the course.
 * @param {string} subject - the subject of the course.
 * @param {Object} res - The Express response object.
 */
async function checkCourseExists(email, course, subject, res) {
  let db = await getDBConnection();
  let qry = "SELECT * FROM " + subject + " WHERE email = ? AND course = ?";
  try {
    let menu = await db.get(qry, email, course);
    await db.close();
    return !menu;
  } catch (err) {
    res.type('text');
    res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
  }
  return true;
}

/**
 * set the function for /course/profile/enrollCourse/gre
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
app.post('/course/profile/enrollCourse/gre', async function (req, res) {
  if (!req.body) {
    res.status(INVALID_PARAM_ERROR);
    res.type('text');
    return res.send(CLIENT_ERROR_MSG);
  }
  let userEmail = thisEmail;
  let gre = req.body.course;
  if (gre && userEmail) {
    if (!await checkAvailability('gre', gre)) {
      return res.type('text').send('No availibility of this course!');
    }
    try {
      helperTwo(userEmail, gre, res);
    } catch (err) {
      res.type('text');
      res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
    }
  } else {
    res.status(INVALID_PARAM_ERROR);
    res.type('text');
    res.send(CLIENT_ERROR_MSG);
  }
});

/**
 * helper function for the previous one
 *
 * @param {string} userEmail - user email.
 * @param {string} gre - gre information
 * @param {Object} res - The Express response object.
 */
async function helperTwo(userEmail, gre, res) {
  let db = await getDBConnection();
  if (await checkCourseExists(userEmail, gre, 'gre', res)) {
    let qry = 'INSERT INTO gre (email, course) VALUES (?, ?)';
    let changes = await db.run(qry, userEmail, gre);
    if (changes.changes === 1) {
      res.type('text').send("Successfully added course: " + gre);
      updateHistory(userEmail, gre, 'enroll', res);
      updateCourse('gre', gre, 'add', res);
    } else {
      res.type('text').send('fail to add course');
    }
    await db.close();
  } else {
    await db.close();
    res.type('text');
    res.send('You already enroll this course');
  }
}

/**
 * set the function for /course/profile/enrollCourse/tofel
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
app.post('/course/profile/enrollCourse/tofel', async function (req, res) {
  if (!req.body) {
    res.status(INVALID_PARAM_ERROR);
    res.type('text');
    return res.send(CLIENT_ERROR_MSG);
  }
  let userEmail = thisEmail;
  let tofel = req.body.course;
  if (tofel && userEmail) {
    if (!await checkAvailability('tofel', tofel)) {
      return res.type('text').send('No availibility of this course');
    }
    try {
      helperThree(userEmail, tofel, res);
    } catch (err) {
      res.type('text');
      res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
    }
  } else {
    res.status(INVALID_PARAM_ERROR);
    res.type('text');
    res.send(CLIENT_ERROR_MSG);
  }
});

/**
 * helper function for the previous one
 *
 * @param {string} userEmail - user email.
 * @param {string} tofel - tofel information
 * @param {Object} res - The Express response object.
 */
async function helperThree(userEmail, tofel, res) {
  let db = await getDBConnection();
  if (await checkCourseExists(userEmail, tofel, 'tofel', res)) {
    let qry = 'INSERT INTO tofel (email, course) VALUES (?, ?)';
    let changes = await db.run(qry, userEmail, tofel);
    if (changes.changes === 1) {
      res.type('text').send("Successfully added course: " + tofel);
      updateHistory(userEmail, tofel, 'enroll', res);
      updateCourse('tofel', tofel, 'add', res);
    } else {
      res.type('text').send('fail to add course');
    }
    await db.close();
  } else {
    await db.close();
    res.type('text');
    res.send('You already enroll this course');
  }
}

/**
 * update the history.
 *
 * @param {string} email - user email.
 * @param {string} course - the name of the course
 * @param {string} operation - the type of operation
 * @param {Object} res - The Express response object.
 */
async function updateHistory(email, course, operation, res) {
  let db = await getDBConnection();
  let qry;
  let status;
  try {
    if (operation === 'enroll') {
      qry = "INSERT INTO history (email, course, status) VALUES(?, ?, 'enrolled')";
      await db.run(qry, email, course);
      await db.close();
    } else if (operation === 'drop') {
      qry = 'UPDATE history SET status = ? WHERE course = ? AND email = ?';
      status = 'dropped';
      await db.run(qry, status, course, email);
      await db.close();
    } else {
      qry = 'UPDATE history SET status = ? WHERE code = ?';
      status = 'complete';
      await db.run(qry, status, course);
      await db.close();
    }
  } catch (err) {
    res.type('text');
    res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
  }
}

/**
 * update the course.
 *
 * @param {string} type - user type.
 * @param {string} course - the name of the course
 * @param {string} operation - the type of operation
 * @param {Object} res - The Express response object.
 */
async function updateCourse(type, course, operation, res) {
  let qry;
  if (type === 'tofel' && operation === 'add') {
    qry = 'UPDATE tofelCourse SET number = number - 1 WHERE name = ?';
  } else if (type === 'gre' && operation === 'add') {
    qry = 'UPDATE greCourse SET number = number - 1 WHERE name = ?';
  } else if (type === 'tofel' && operation === 'drop') {
    qry = 'UPDATE tofelCourse SET number = number + 1 WHERE name = ?';
  } else {
    qry = 'UPDATE greCourse SET number = number + 1 WHERE name = ?';
  }
  try {
    let db = await getDBConnection();
    let changes = await db.run(qry, course);
    await db.close();
    return changes.changes;
  } catch (err) {
    res.type('text');
    res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
  }
}

/**
 * check the avililability.
 *
 * @param {string} type - user type.
 * @param {string} course - the name of the course
 * @param {Object} res - The Express response object.
 */
async function checkAvailability(type, course, res) {
  let qry;
  if (type === 'tofel') {
    qry = 'SELECT number FROM tofelCourse WHERE name = ?';
  } else {
    qry = 'SELECT number FROM greCourse WHERE name = ?';
  }
  try {
    let db = await getDBConnection();
    let changes = await db.get(qry, course);
    await db.close();
    return (changes.number > 0);
  } catch (err) {
    res.type('text');
    res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
  }
}

/**
 * Express route to handle GET requests to /course/profile
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
app.get('/course/profile', async function (req, res) {
  try {
    let email = thisEmail;
    let qry;
    qry = 'SELECT username, email FROM user WHERE email = ?';
    let db = await getDBConnection();
    let result = await db.get(qry, email);
    await db.close();
    res.json(result);
  } catch (err) {
    res.type('text');
    res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
  }
});

/**
 * Express route to handle GET requests to /course/profile/findCourse/gre
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
app.get('/course/profile/findCourse/gre', async function (req, res) {
  try {
    let email = thisEmail;
    let qry;
    if (email) {
      qry = 'SELECT * FROM gre WHERE email = ?';
    }
    let db = await getDBConnection();
    let result = await db.all(qry, email);
    await db.close();
    res.json(result);
  } catch (err) {
    res.type('text');
    res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
  }
});

/**
 * Express route to handle GET requests to /course/profile/findCourse/tofel
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
app.get('/course/profile/findCourse/tofel', async function (req, res) {
  try {
    let email = thisEmail;
    let qry;
    if (email) {
      qry = 'SELECT * FROM tofel WHERE email = ?';
    }
    let db = await getDBConnection();
    let result = await db.all(qry, email);
    await db.close();
    res.json(result);
  } catch (err) {
    res.type('text');
    res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
  }
});

/**
 * Express route to handle post requests to /course/profile/removecourse/gre
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
app.post('/course/profile/removecourse/gre', function (req, res) {
  if (!req.body) {
    res.status(INVALID_PARAM_ERROR);
    res.type('text');
    return res.send(CLIENT_ERROR_MSG);
  }
  let userEmail = thisEmail;
  let gre = req.body.course;

  if (gre && userEmail) {
    try {
      helperFour(userEmail, gre, res);
    } catch (err) {
      res.type('text');
      res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
    }
  } else {
    res.status(INVALID_PARAM_ERROR);
    res.type('text');
    res.send(CLIENT_ERROR_MSG);
  }
});

/**
 * helper function for the previous one
 *
 * @param {string} userEmail - user email.
 * @param {string} gre - gre information
 * @param {Object} res - The Express response object.
 */
async function helperFour(userEmail, gre, res) {
  let db = await getDBConnection();
  if (!await checkCourseExists(userEmail, gre, 'gre', res)) {
    let qry = 'DELETE FROM gre WHERE email = ? AND course = ?;';
    let changes = await db.run(qry, userEmail, gre);
    if (changes.changes === 1) {
      res.type('text').send("Successfully remove course: " + gre);
      updateCourse('gre', gre, 'drop', res);
      updateHistory(userEmail, gre, 'drop', res);
    } else {
      res.type('text').send('fail to remove course');
    }
    await db.close();
  } else {
    await db.close();
    res.type('text');
    res.send('This course is not in your course list');
  }
}

/**
 * Express route to handle GET requests to /course/history/complete
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
app.get('/course/history/complete', async function (req, res) {
  let email = thisEmail;
  try {
    let db = await getDBConnection();
    let qry = "SELECT course FROM history WHERE email = ? AND status = 'complete'";
    let menu = await db.all(qry, email);
    if (menu) {
      res.type('json').send(menu);
    } else {
      res.type('text').send('No completed course');
    }
    await db.close();
  } catch (err) {
    res.type('text');
    res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
  }
});

/**
 * Express route to handle GET requests to /course/history/search
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
app.get('/course/history/search', async function (req, res) {
  let code = req.query.code;
  let course = req.query.course;
  let userEmail = thisEmail;
  try {
    let db = await getDBConnection();
    if (code) {
      let qry = 'SELECT * FROM history WHERE code = ? AND email = ?';
      let changes = await db.get(qry, code, thisEmail);
      helperSix(changes, userEmail, code, res);
      await db.close();
      res.type('text');
      res.send('successfully completed the course:' + changes.course);
    } else {
      let qry = 'SELECT * FROM history WHERE course = ? AND email = ? AND status = ?';
      let status = 'complete';
      let menu = await db.get(qry, course, thisEmail, status);
      if (!menu) {
        res.type('json').send({ 'note': 'You could not enroll' });
        await db.close();
      } else {
        res.type('json').send(menu);
        await db.close();
      }
    }
  } catch (err) {
    res.type('text');
    res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
  }
});

/**
 * helper function for the previous one
 *
 * @param {Object} changes - the f.
 * @param {string} userEmail - user email.
 * @param {string} code - the code
 * @param {Object} res - The Express response object.
 * @return {object} the error
 *
 */
function helperSix(changes, userEmail, code, res) {
  if (changes) {
    updateHistory(userEmail, code, 'complete', res);
  } else {
    return res.type('text').send('something went wrong');
  }
}

/**
 * Increase the number of likes for a yip with given ID.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
app.post('/course/profile/removecourse/tofel', function (req, res) {
  if (!req.body) {
    res.status(INVALID_PARAM_ERROR);
    res.type('text');
    return res.send(CLIENT_ERROR_MSG);
  }
  let userEmail = thisEmail;
  let tofel = req.body.course;
  if (tofel && userEmail) {
    try {
      helperSeven(userEmail, tofel, res);
    } catch (err) {
      res.type('text');
      res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
    }
  } else {
    res.status(INVALID_PARAM_ERROR);
    res.type('text');
    res.send(CLIENT_ERROR_MSG);
  }
});

/**
 * helper function for the previous one
 *
 * @param {string} userEmail - user email.
 * @param {string} tofel - tofel information
 * @param {Object} res - The Express response object.
 */
async function helperSeven(userEmail, tofel, res) {
  let db = await getDBConnection();
  if (!await checkCourseExists(userEmail, tofel, 'tofel', res)) {
    let qry = 'DELETE FROM tofel WHERE email = ? AND course = ?;';
    let changes = await db.run(qry, userEmail, tofel);
    if (changes.changes === 1) {
      res.type('text').send("Successfully remove course: " + tofel);
      updateCourse('tofel', tofel, 'drop', res);
      updateHistory(userEmail, tofel, 'drop', res);
    } else {
      res.type('text').send('fail to remove course');
    }
    await db.close();
  } else {
    await db.close();
    res.type('text');
    res.send('This course is not in your course list');
  }
}

/**
 * Express route to handle GET requests to /course/profile/search
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
app.get('/course/profile/search', async function (req, res) {
  try {
    let asearch = req.query.search;
    let userEmail = thisEmail;
    let qry1, params1;
    let qry2, params2;
    res.type("json");
    if (asearch) {
      qry1 = 'SELECT * FROM tofel WHERE course LIKE ? AND email = ?;';
      params1 = ['%' + asearch + '%', userEmail];
      qry2 = 'SELECT * FROM gre WHERE course LIKE ? AND email = ?;';
      params2 = ['%' + asearch + '%', userEmail];
    }
    let db = await getDBConnection();
    let result1 = await db.all(qry1, params1);
    let result2 = await db.all(qry2, params2);
    let combinedResult = {
      result1: result1,
      result2: result2
    };
    res.json({ combinedResult });
    await db.close();
  } catch (err) {
    res.type('text');
    res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
  }
});

/**
 * Express route to handle GET requests to /tofel/course/left
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
app.get('/tofel/course/left', async function (req, res) {
  try {
    let name = req.query.left;
    let qry1 = 'SELECT number FROM tofelCourse WHERE name=?';
    let db = await getDBConnection();
    let changes = await db.all(qry1, name);
    res.json({ "numbers": changes });
    await db.close();
  } catch (err) {
    res.type('text');
    res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
  }
});

/**
 * Express route to handle GET requests to /gre/course/left
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
app.get('/gre/course/left', async function (req, res) {
  try {
    let name = req.query.left;
    let qry1 = 'SELECT number FROM greCourse WHERE name=?';
    let db = await getDBConnection();
    let changes = await db.all(qry1, name);
    res.json({ "numbers": changes });
    await db.close();
  } catch (err) {
    res.type('text');
    res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
  }
});

/**
 * Express route to handle GET requests to /course/history
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
app.get('/course/history', async function (req, res) {
  let userEmail = thisEmail;
  try {
    let qry = 'SELECT * FROM history WHERE email = ?';
    let db = await getDBConnection();
    let menu = await db.all(qry, userEmail);
    await db.close();
    if (menu.length === 0) {
      res.type('json').send({ 'note': 'You do not have any transaction' });
    } else {
      res.type('json').send(menu);
    }
  } catch (err) {
    res.type('text');
    res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
  }
});

/**
 * Logout the page
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Failed to logout.');
    }
    res.send('Logged out successfully');
  });
});


app.use(express.static('public'));
const PORT = process.env.PORT || DEFAULT;
app.listen(PORT);