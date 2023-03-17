drop table if exists user;

create table user (
  user_id varchar(30) not null,

  user_type varchar(15) not null,
  username varchar(20) not null,
  email varchar(320) null,
  twitter_id varchar(320) null,
  google_id varchar(320) null,
  created_at varchar(24) not null,

  primary key (user_id)
);

create unique index username_idx on user (
  username asc
);

create unique index email_idx on user (
  email asc
);

create unique index twitter_idx on user (
  twitter_id asc
);

create unique index google_idx on user (
  google_id asc
);

