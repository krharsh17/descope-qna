# Add Authentication and Authorization to a React App with Descope

This repository is part of a tutorial on setting up authentication and authorization in a React app using [Descope](https://www.descope.com/). To get started with the code in this repository, clone it locally and:

* Set up [a new Descope Free Forever](https://www.descope.com/sign-up) account.
* Create a new Descope Flow with **Social Login (OAuth / OIDC)** as the primary authentication method.
* Retrieve the project ID in which you created the new flow.
* Rename `.env.example` to `.env` and store the project ID in it.
* Next, create a new Postgres instance to use with the project. You can either go for a [local PostgreSQL installation](https://www.postgresql.org/download/) or opt for a freemium remote PostgreSQL service like [Neon](https://neon.tech/). Retrieve its credentials and update it in the `.env` file.
* Before starting the app, load some data in the database by connecting to it through psql (using the command `psql -h <your-db-host> -p <your-db-port> -d <your-db-name> -U <your-db-username>`) or a GUI and run the following commands:

```sql
CREATE TABLE public.questions (
    qaid integer NOT NULL,
    content character varying(512)
);

CREATE TABLE public.answers (
    qaid integer NOT NULL,
    content character varying(512)
);

ALTER TABLE public.questions OWNER TO postgres;

ALTER TABLE public.answers OWNER TO postgres;

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_pkey PRIMARY KEY (qaid);

ALTER TABLE ONLY public.answers
    ADD CONSTRAINT answers_pkey PRIMARY KEY (qaid);


COPY public.questions (qaid, content) FROM stdin;
0	Compared to their body weight, what animal is the strongest - Dung Beetle, Elephant, Ant, or Cow?
1	How many dots appear on a pair of dice?
2	Which is the only body part that is fully grown from birth?
3	What is acrophobia a fear of?
4	In what country was Elon Musk born?
5	Who performs the voice of Homer Simpson?
6	What country has the most islands?
7	In Australia what is commonly known as a Bottle-o?", "An off-license / Liquor Store
8	How many hearts does an octopus have?
9	What planet is closest to the sun?
\.

COPY public.answers (qaid, content) FROM stdin;
0	Dung Beetle
1	42
2	Eyes
3	Heights
4	South Africa
5	Dan Castellaneta
6	Sweden - 270,000
7	An off-license / Liquor Store
8	3
9	Mercury
\.
```
* Finally, run `npm i` or `yarn` to install the dependencies and `npm run dev` or `yarn dev` to start the app.