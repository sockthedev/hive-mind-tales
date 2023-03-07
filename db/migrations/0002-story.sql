drop table if exists story;

create table story (
  story_id varchar(30) not null,

  title varchar(320) not null,

  root_part_id varchar(30) not null,

  created_by varchar(30) not null,
  created_at varchar(24) not null,

  primary key (story_id)
);

create table part (
  part_id varchar(30) not null,

  story_id varchar(30) not null,

  parent_part_id varchar(30) null,

  content text not null,

  created_by varchar(30) not null,
  created_at varchar(24) not null,

  primary key (part_id)
);
