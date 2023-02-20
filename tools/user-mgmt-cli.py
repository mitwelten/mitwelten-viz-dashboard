# Copyright (c) 2023 FHNW, Switzerland. All rights reserved.
# Licensed under MIT License, see LICENSE for details.

import click
import argparse
import sqlite3
from dotenv import dotenv_values
import hashlib
import datetime


parser = argparse.ArgumentParser(
    description="Viz Dashboard User Management CLI Tool to Add, Remove or List Users",
)
parser.add_argument(
    "-e",
    "--env",
    required=True,
    help="The '.env' file where the salt for Password salting is stored. Must include SALT=...",
)
parser.add_argument(
    "-f",
    "--db_file",
    required=True,
    help="The SQLite file used to store the data. The file will be created if it does not exist",
)
parser.add_argument(
    "-a",
    "--add",
    required=False,
    action="store_true",
    help="Add a user to the database",
)
parser.add_argument(
    "-r",
    "--remove",
    required=False,
    action="store_true",
    help="Remove a user from the database",
)
parser.add_argument(
    "-l", "--list", required=False, action="store_true", help="List the users"
)
args = parser.parse_args()

db_file = args.db_file
env_file = args.env
env_vals = dotenv_values(env_file)

# Get the Salt from the env file provided in the args
salt = None
if "SALT" in env_vals:
    salt = env_vals["SALT"]
if salt is None:
    print("SALT not found in", env_file)
    exit()


# Function to hash the password
def hash_it(value: str):
    _salt = salt.encode()
    if _salt is None:
        raise ValueError("No salt provided")
    try:
        derived_key = hashlib.pbkdf2_hmac(
            hash_name="sha512",
            password=value.encode(),
            salt=_salt,
            iterations=92000,
            dklen=64,
        )
        return derived_key.hex()
    except Exception as e:
        print(e)


# SQLite Functions
conn = sqlite3.connect(db_file)

# Create a table if the file is empty
conn.execute(
    """CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        createdAt DATETIME  DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );"""
)


def check_if_user_exists(username):
    cur = conn.cursor()
    cur.execute("SELECT * FROM users WHERE email = ?", (username,))
    if len(cur.fetchall()) > 0:
        return True
    return False


def get_usernames():
    cur = conn.cursor()
    cur.execute("SELECT email FROM users")
    res = cur.fetchall()
    return [r[0] for r in res]


def insert_user(username, password):
    now = datetime.datetime.utcnow()
    conn.execute(
        "INSERT INTO users (email,password,createdAt,updatedAt) VALUES (?,?,?,?)",
        (
            username,
            password,
            now,
            now,
        ),
    )
    conn.commit()


def delete_user(username):
    cur = conn.cursor()
    cur.execute("DELETE from users where email = ?", (username,))
    conn.commit()


# Add user
if args.add == True:
    print("add user")
    uname = click.prompt("Username")
    if check_if_user_exists(uname):
        print("user with name '{}' already exists. Aborting.".format(uname))
        exit()

    password = click.prompt(
        "password for {}".format(uname), confirmation_prompt=True, hide_input=True
    )
    hashed_password = hash_it(password)
    insert_user(uname, hashed_password)
    print("inserted user '{}'".format(uname))

# Remove user
elif args.remove == True:
    print("remove user")
    uname = click.prompt("Username")
    if not check_if_user_exists(uname):
        print("user with name '{}' is not in DB. Aborting.".format(uname))
        exit()
    if click.confirm("Do you want to delete {} ?".format(uname)):
        click.echo("deleting user '{}'".format(uname))
        delete_user(uname)
    exit()

# List users
elif args.list == True:
    existing_usernames = get_usernames()
    if len(existing_usernames) == 0:
        print("No users in DB")
    else:
        print("Existing Users:")
        for u in existing_usernames:
            print("\t", u)
