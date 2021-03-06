--
-- JBoss, Home of Professional Open Source
-- Copyright 2015, Red Hat, Inc. and/or its affiliates, and individual
-- contributors by the @authors tag. See the copyright.txt in the
-- distribution for a full listing of individual contributors.
--
-- Licensed under the Apache License, Version 2.0 (the "License");
-- you may not use this file except in compliance with the License.
-- You may obtain a copy of the License at
-- http://www.apache.org/licenses/LICENSE-2.0
-- Unless required by applicable law or agreed to in writing, software
-- distributed under the License is distributed on an "AS IS" BASIS,
-- WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
-- See the License for the specific language governing permissions and
-- limitations under the License.
--

-- You can use this file to load seed data into the database using SQL statements
-- Since the database doesn't know to increase the Sequence to match what is manually loaded here it starts at 1 and tries
--  to enter a record with the same PK and create an error.  If we use a high number we don't interfere with the sequencing 
--  (at least until later).
-- NOTE: this file should be removed for production systems. 
insert into Contact (id, first_name, last_name, email, phone_number, birth_date) values (10001, 'Luke', 'Skywaller', 'luke@sw.com', '+1 212 555-1212', '1977-05-25')
insert into Contact (id, first_name, last_name, email, phone_number, birth_date) values (10002, 'Leia', 'Oregano', 'leia@sw.com', '+1 212-555-3333', '1977-05-25')
insert into Contact (id, first_name, last_name, email, phone_number, birth_date) values (10003, 'Han', 'Sold', 'han@sw.com', '+1 212-555-3333', '1977-05-25')
insert into Contact (id, first_name, last_name, email, phone_number, birth_date) values (10004, 'Obi-Wan', 'Kenoli', 'old.ben@sw.com', '+1 212-555-3333', '1977-05-25')
insert into Contact (id, first_name, last_name, email, phone_number, birth_date) values (10005, 'Anakin', 'Skywaller', 'darkside@sw.com', '+1 212-555-3333', '1977-05-25')
insert into Contact (id, first_name, last_name, email, phone_number, birth_date) values (10006, 'JarJar', 'Blinks', 'why.me@sw.com', '+1 212-555-3333', '1977-05-25')
insert into Contact (id, first_name, last_name, email, phone_number, birth_date) values (10007, 'Qui-Gon', 'Jeans', 'gone@sw.com', '+1 212-555-3333', '1977-05-25')
insert into Contact (id, first_name, last_name, email, phone_number, birth_date) values (10008, 'Wedge', 'Antlers', 'unsung@sw.com', '+1 212-555-3333', '1977-05-25')
insert into Contact (id, first_name, last_name, email, phone_number, birth_date) values (10009, 'Padme', 'Amidaus', 'queen@sw.com', '+1 212-555-3333', '1977-05-25')
