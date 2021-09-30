--------------------------------------------------------------
-- Filename:  V1.6__user_preferences.sql
--------------------------------------------------------------


-----------------------------------------------------------------------------
-- Create this table:  Users
-----------------------------------------------------------------------------
create table Users
(
    id               integer      not null,
    version          integer      not null default (1),
    full_name        varchar(200) null,
    user_name        varchar(100) not null,
    is_locked        boolean      not null,
    last_login_date  timestamp    not null default now(),
    unique(user_name),
    primary key(id)
);
comment on table Users is 'The Users table holds information about each registered user';


-----------------------------------------------------------------------------------------
-- Create this table:  user_preferences
-- NOTE:  This table does not have a unique ID.  Instead the userid, page, name is unique
-----------------------------------------------------------------------------------------
create table user_preferences (
  userid                integer     NOT NULL,
  page                  varchar         NULL,
  name                  varchar(50) NOT NULL,
  value                 text        NOT NULL,
  constraint userpreferences_userid FOREIGN KEY(userid) references users(id),
  unique(userid, page, name)
);
comment on table user_preferences is 'The user_preferences table holds preferences for each user';


