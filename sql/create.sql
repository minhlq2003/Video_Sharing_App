-- create database db_videosharingapp
-- use db_videosharingapp

-- Tạo bảng Users
CREATE TABLE Users (
  idUser INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  sdt VARCHAR(15),
  birthDay DATE,
  avatar VARCHAR(255),
  email VARCHAR(255) NOT NULL
);

CREATE TABLE Account (
  idAccount INT AUTO_INCREMENT PRIMARY KEY,
  idUser INT NOT NULL,
  username VARCHAR(100) NOT NULL,
  pass VARCHAR(255) NOT NULL,
  FOREIGN KEY (idUser) REFERENCES Users(idUser)
);

CREATE TABLE Follow (
  id_following INT NOT NULL,
  id_followed INT NOT NULL,
  PRIMARY KEY (id_following, id_followed),
  FOREIGN KEY (id_following) REFERENCES Users(idUser),
  FOREIGN KEY (id_followed) REFERENCES Users(idUser)
);

CREATE TABLE Post (
  idPost INT AUTO_INCREMENT PRIMARY KEY,
  idUser INT NOT NULL,
  type VARCHAR(50),
  url VARCHAR(255),
  content VARCHAR(1000),
  upload_at DATETIME,
  FOREIGN KEY (idUser) REFERENCES Users(idUser)
);

CREATE TABLE `Like` (
  idLike INT AUTO_INCREMENT PRIMARY KEY,
  idUser INT NOT NULL,
  idPost INT NOT NULL,
  FOREIGN KEY (idUser) REFERENCES Users(idUser),
  FOREIGN KEY (idPost) REFERENCES Post(idPost)
);

CREATE TABLE Comment (
  idComment INT AUTO_INCREMENT PRIMARY KEY,
  idPost INT NOT NULL,
  idUser INT NOT NULL,
  text VARCHAR(1000),
  time DATETIME,
  FOREIGN KEY (idUser) REFERENCES Users(idUser),
  FOREIGN KEY (idPost) REFERENCES Post(idPost)
);
