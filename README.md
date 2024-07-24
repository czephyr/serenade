# 🎻 Serenade · Tutti più vicini

## Project Overview

This project is a Pilot study for developing a platform to support the Serenade medical study by Policlinico di Milano in collaboration with Università degli studi di Milano.
The platform is needed to facilitate the intercollaboration between the Hospital personnel, the hardware installators and the University team of researchers overseeing the study.

Considering the GDPR's classification of medical data as Special Category Data, the platform ensures precise management and monitoring of data accesses.
To achieve correct data access governance the platform follows RBAC (Role-Based Access Control) authorization using the OpenID Connect standard; the access are monitored and store using a modern observability stack.

### Platform Actors

The actors interacting with the system are: hospital personnell (HOS) inputting data about patients, IIM and IIT which are installation teams for the needed hardware in the patients home and the are the researchers overseeing the study (UniMi).

<img src="images/actors.png" alt="actors" width="500"/>

### System Architecture

![arch](images/architecture.drawio.svg)

## Backend

### Tools

<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" width=36 height=36 /> Python | <img src="https://www.jetbrains.com/guide/assets/fastapi-6837327b.svg" width=36 height=36 /> FastAPI | <img src="https://avatars.githubusercontent.com/u/110818415?v=4&s=160" width=36 height=36 /> Pydantic | <img src="https://quintagroup.com/cms/python/images/sqlalchemy-logo.png/@@images/eca35254-a2db-47a8-850b-2678f7f8bc09.png" width=120 height=36 /> SQLAlchemy |

The backend features a REST api structure and serves requests under RBAC enforced by using Keycloak jwt tokens.
The API is written using the FastAPI framework, SQLAlchemy is used for ORM interaction with the database and Pydantic is used for data schema validation.

The RBAC auth and authz is implemented achieved by leveraging the `KeycloakOpenID` and FastAPI integration; everytime a request is sent to the backend before serving a response the jwt token is checked for validity and authorization based on user role against Keycloak.

Using the OpenAPI specification FastAPI creates automatic API endpoint documentation with a Swagger UI at the ```/docs``` endpoint.
<img src="images/swagger.png" width=700 />

All the endpoints have their request and response body parameters documented.

<img src="images/api_specifics.png" width=700 />

## Database

### Tools

<img src="https://netdata.cloud/img/percona.svg" width=36 height=36 /> Percona postgreSQL |

The database table storing data that could identify patients is stored under transparent data encryption as additional security measure by using the `pg_tde` functionality offered by this Percona postgreSQL16 distribution.

## Frontend

### Tools

<img src="https://next-auth.js.org/img/logo/logo-sm.png" width=36 height=36 /> NextAuth.js | <img src="https://static-00.iconduck.com/assets.00/nextjs-icon-512x512-y563b8iq.png" width=36 height=36 /> Next.js |

The frontend is in NextJS, NextAuth.js offers interoperability with Keycloak. NextJS provides serverside loading, where that is possible requests tokens are checked for validity and authorization based on user role against Keycloak.

## IAM

### Tools

<img src="https://cf.appdrag.com/dashboard-openvm-clo-b2d42c/uploads/Keycloak-VC4L-19JH.png" width=80 height=80 /> KeyCloak |

Keycloak is an open-source identity and access management solution that provieds IAM capabilities but can also serve as an adapter for external IdPs. It's used to create the RBAC Auth and Authz through the OpenID connect standard.
