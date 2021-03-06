--------------------------------------------------------------------------------
-- Filename:  r__security.sql
--
-- NOTE:  This is a repeatable migration file because this data does not change
--        So, if anything changes in this file, this script is re-executed on startup
--------------------------------------------------------------------------------
drop table if exists roles_uicontrols;
drop table if exists uicontrols;
drop table if exists roles;


-- Create this table:  roles
create table roles (
  id   integer not null,
  name varchar(50) not null,
  primary key(id)
);

comment on table  roles       is 'This table holds all of the application roles used by the web app.';;
comment on column roles.id   is 'This number uniquely identifies this role.';
comment on column roles.name is 'This identifies the name of the role.';



-- Create this table:  uicontrols
create table uicontrols (
   id   integer not null,
   name varchar(50) not null,
   primary key(id)
);

comment on table  uicontrols       is 'This table holds all of the application roles used by the web app.';;
comment on column uicontrols.id   is 'This number uniquely identifies this UI feature.';
comment on column uicontrols.name is 'This identifies the name of the UI feature.';




-- Create this table:  roles_uicontrols
create table roles_uicontrols (
    role_id      integer not null,
    uicontrol_id integer not null
);
comment on table  roles_uicontrols   is 'This table holds the relationships between the roles and uicontrols tables.';


--
-- Add the security records
--
insert into roles(id, name) values (1, 'ADMIN');
insert into roles(id, name) values(2, 'READER');


--
-- Add the uicontrols records
--
insert into uicontrols(id, name) values(1001, 'page/viewReports');
insert into uicontrols(id, name) values(1002, 'page/addReport');
insert into uicontrols(id, name) values(1003, 'page/longReport');
insert into uicontrols(id, name) values(1004, 'page/searchResults');


-- Assign ui controls for the 'admin' role
insert into roles_uicontrols(role_id, uicontrol_id) values(1, 1001);
insert into roles_uicontrols(role_id, uicontrol_id) values(1, 1002);
insert into roles_uicontrols(role_id, uicontrol_id) values(1, 1003);
insert into roles_uicontrols(role_id, uicontrol_id) values(1, 1004);


-- Assign ui controls for the 'reader' role  (cannot get to addReport)
insert into roles_uicontrols(role_id, uicontrol_id) values(2, 1001);
insert into roles_uicontrols(role_id, uicontrol_id) values(2, 1003);
insert into roles_uicontrols(role_id, uicontrol_id) values(2, 1004);


