create table user_searches
(
    userid              integer      not null,
    page_name           varchar(50)  not null,
    display_name        varchar(256) not null,
    is_default_search   boolean      not null,
    grid_state          text          null
);