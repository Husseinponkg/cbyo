create DATABASE cybo;



use cybo;

create table admin(
    id int primary key auto_increment,
    username varchar(100),
    password varchar(100)
);


create table users(
    id int primary key auto_increment,
    user_id int null,
    username varchar(100),
    email varchar(100),
    password  varchar(100),
    phone varchar(100),
    location varchar(100),
    foreign key users(user_id)references admin(id)
);
create table activities(
    activity_id int primary key auto_increment,
    files varchar(100),
    reports varchar(100),
    news varchar(100),
    images varchar(100)
);
create table reports(
id int primary key auto_increment,
title varchar(100),
description TEXT,
activity varchar(100),
created_at DATETIME
);
create table media(
id int primary key auto_increment,
name varchar(100),
type varchar(100),
filename varchar(100),
filepath varchar(100),
created_at DATETIME
);
insert into  admin(username,password)values('chris','qric123');
