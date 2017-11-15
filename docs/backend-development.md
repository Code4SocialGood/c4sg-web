# Backend Development


## 1. REST API

### 1.1 General

Defining a REST API methods please follow the OPENAPI Specification: http://swagger.io/specification/

### 1.2 Naming rules

URI should make sense and adequately describes the resource. URIs must follow a predictable, hierarchical structure to enhance understandability and, therefore, usability: predictable in the sense that they're consistent, hierarchical in the sense that data has structure—relationships.

REST API call should leverage all the HTTP verbs (`GET`/`POST`/`PUT`/`DELETE`/etc.) rather than specifying requested operation in a path. E.g. use `GET http://www.c4sg.com/users/{id}` instead of `GET http://www.c4sg.com/users/search/byID/{id}`

Please follow the rule of using two base URLs for each root resource. One for creation of the resource within a collection  e.g. `POST http://www.c4sg.com/users` and the second for reading, updating and deleting the resource by its identifier, e.g. `GET|PUT|DELETE http://www.c4sg.com/users/{id}`

In case we need to return a collection of objects we can just use first case with GET verb, e.g. `GET http://www.c4sg.com/users`

### 1.3 Pluralization

The commonly-accepted practice is to always use plurals in node names to keep your API URIs consistent across all HTTP methods. While a group of resources is a collection within the service you can refer a particular resource in the collection using id.

For example: `GET http://www.c4sg.com/users/5/organizations/1/projects/2` with ‘users’, ‘organizations’, and ‘projects’ URI nodes all being their plural forms.

It's acceptable to use a singularized resource name when there can only be one of the resource—it's a singleton resource. For example, if there was a single, overarching configuration resource, you might use a singularized noun to represent that, e.g. `GET|PUT|DELETE http://www.c4sg.com/users/7/profile`

### 1.4	Visualization

This project uses Swagger to document and visualize the REST API. If your Spring application is up you can get it accessing here: http://localhost:8080/swagger-ui.html 
