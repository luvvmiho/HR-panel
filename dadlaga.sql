CREATE DATABASE dadlaga;

USE dadlaga;

CREATE TABLE hereglegch (
    h_id INT AUTO_INCREMENT PRIMARY KEY,
    ovog VARCHAR(50),
    ner VARCHAR(50),
    gmail VARCHAR(100),
    utas VARCHAR(8),
    nuutsUg VARCHAR(100) 
);

ALTER TABLE hereglegch ADD COLUMN h_role ENUM('admin', 'user') DEFAULT 'user';
SELECT * FROM hereglegch;

UPDATE hereglegch
SET h_role = 'admin'
WHERE h_id = '1';

CREATE TABLE `sessions` (
  `session_id` varchar(128) COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` text COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE attendance (
  userHId INT NOT NULL ,
  id INT AUTO_INCREMENT PRIMARY KEY,
  date DATE,
  checkInTime DATETIME,
  checkOutTime DATETIME,
  CONSTRAINT fk_user_attendance
    FOREIGN KEY (userHId) REFERENCES hereglegch(h_id) ON DELETE CASCADE
);

DROP TABLE attendance;
DESCRIBE attendance;
select * from attendance;
DESCRIBE hereglegch;
DESCRIBE sessions;


