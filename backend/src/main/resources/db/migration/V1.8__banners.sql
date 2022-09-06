--------------------------------------------------------------
-- Filename:  V1.8__banners.sql
--------------------------------------------------------------

-- Create this table:  banner_urgency
create table banner_urgency
(
    id               integer       not null,
    name             varchar(100)  not null,
    displayed_value  varchar(100)  not null,
    displayed_order  integer       not null,
    primary key(id)
);
comment on table banner_urgency is 'Ths banner_urgency lookup table holds the different urgency values';
insert into banner_urgency(id, displayed_order, name, displayed_value) values(10, 1, 'Low', 'Low');
insert into banner_urgency(id, displayed_order, name, displayed_value) values(20, 2, 'Medium', 'Medium');
insert into banner_urgency(id, displayed_order, name, displayed_value) values(30, 3, 'High', 'High');
insert into banner_urgency(id, displayed_order, name, displayed_value) values(40, 4, 'Critical', 'Critical');


-- Create this table:  banners
create table banners
(
    id                 integer      not null,
    message            text         not null,
    is_visible         boolean      not null,
    banner_urgency_id  integer      not null,
    primary key(id),
    constraint banner_urgency_fk foreign key(banner_urgency_id) references banner_urgency(id)
);
comment on table banners is 'The banners table holds info banners that may or may not be displayed to the user';


