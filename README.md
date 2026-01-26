## Assignment 10 – Search

Search functionality is implemented as an extension of the existing article list page.
It uses PostgreSQL via Sequelize (`Op.iLike`) and applies an optional WHERE clause only
when a search query is provided.

The solution does not introduce separate controllers or duplicated logic and works
directly on top of the existing project structure.