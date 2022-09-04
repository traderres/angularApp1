--------------------------------------------------------------
-- Filename:  V1.7__exceptions.sql
--------------------------------------------------------------

-- Create this table:  Exceptions
create table exceptions
(
    id               integer      not null,
    user_id          integer          null,
    user_name        varchar(100) not null,
    app_name         varchar(100) not null,
    app_version      varchar(100) not null,
    url              varchar(200) not null,
    event_date       timestamp    not null,
    message          text             null,
    cause            text             null,
    stack_trace      text             null,
    primary key(id)
);
comment on table exceptions is 'The Exceptions table holds info about every exception that was raised in the backend';

-- Add an index to improve the performance of filtering on event dates
create index on exceptions(event_date);

