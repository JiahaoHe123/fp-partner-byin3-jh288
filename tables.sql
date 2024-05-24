CREATE TABLE user (
  username VARCHAR(255),
  password VARCHAR(255),
  email VARCHAR(255) PRIMARY KEY
);

CREATE TABLE tofel (
  email VARCHAR(255),
  course VARCHAR(255),
  PRIMARY KEY(email, course),
  FOREIGN KEY(email) REFERENCES user(email),
  FOREIGN KEY(course) REFERENCES tofelCourse(name)
);

CREATE TABLE gre (
  email VARCHAR(255),
  course VARCHAR(255),
  PRIMARY KEY(email, course),
  FOREIGN KEY(email) REFERENCES user(email),
  FOREIGN KEY(course) REFERENCES greCourse(name)
);

CREATE TABLE greCourse (
  name VARCHAR(255),
  number int,
  PRIMARY KEY(name)
);

CREATE TABLE tofelCourse (
  name VARCHAR(255),
  number int,
  PRIMARY KEY(name)
);

CREATE TABLE history (
  code int IDENTITY(1,1),
  email VARCHAR(255),
  course VARCHAR(255),
  status VARCHAR(255),
  PRIMARY KEY(code),
  FOREIGN KEY(email) REFERENCES user(email)
);