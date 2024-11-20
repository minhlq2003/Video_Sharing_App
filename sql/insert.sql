INSERT INTO Users (username, sdt, birthDay, avatar, email)
VALUES 
('Quang', '0901234567', '1995-08-15', 'https://imgur.com/RrBwvfA.png', 'Quang@example.com'),
('Thang', '0901234567', '1995-08-15', 'https://imgur.com/RrBwvfA.png', 'Quang@example.com'),
('Minh', '0901234567', '1995-08-15', 'https://imgur.com/RrBwvfA.png', 'Quang@example.com');
INSERT INTO Account (idUser, username, pass)
VALUES
(1, 'Quang', '123'),
(2, 'Thang', '123'),
(3, 'Minh', '123')
;

INSERT INTO Follow (id_following, id_followed)
VALUES
(1, 2),  -- QUang follows Thang
(1, 3),  -- Quang follows Minh
(2, 1),  -- Thang follows Quang
(3, 1);  -- Minh follows Quang

INSERT INTO Post (idUser, type, url, content, upload_at)
VALUES
(1, 'image', 'https://example.com/images/post1.jpg', 'Alice first post', '2024-11-08 08:00'),
(2, 'video', 'https://example.com/videos/post2.mp4', 'Bob cool video', '2024-11-08 09:00'),
(3, 'story', 'https://example.com/stories/post3.jpg', 'Charlie story', '2024-11-08 10:00');

INSERT INTO `Like` (idUser, idPost)
VALUES
(1, 2),  
(2, 1),  
(3, 2),  
(1, 3),  
(2, 3);  