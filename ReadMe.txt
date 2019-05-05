Tutorial from 
- https://www.digitalocean.com/community/tutorials/how-to-build-a-modern-web-application-to-manage-customer-information-with-django-and-react-on-ubuntu-18-04
- Used Docker images, Ubuntu and Postgres
- Added previous button, handleEdit in CustomersList.js

- Set up Django on Docker
$ docker search ubuntu
$ docker pull ubuntu
$ docker run -v ~/djangoreact:/home/djangoreact -p 8000:8000 -p 3000:3000 -it --name djangoreact ubuntu
    root@52cdc60ce802:/# exit
    $ docker start djangoreact
    $ docker exec -it djangoreact bash

root@52cdc60ce802:/# apt-get update
root@52cdc60ce802:/# apt-get install python3
root@52cdc60ce802:/# apt-get install python3-venv
root@52cdc60ce802:/# apt-get install tree

root@52cdc60ce802:/# adduser djangoreact
root@52cdc60ce802:/# usermod -aG sudo djangoreact
root@52cdc60ce802:/# su - djangoreact
djangoreact@52cdc60ce802:~$ python3 -m venv ./env
djangoreact@52cdc60ce802:~$ source env/bin/activate
(env) djangoreact@52cdc60ce802:~$ pip install django djangorestframework django-cors-headers psycopg2-binary
(env) djangoreact@52cdc60ce802:~$ django-admin startproject djangoreact
(env) djangoreact@52cdc60ce802:~$ cd ~/djangoreact
(env) djangoreact@52cdc60ce802:~/djangoreact$ python manage.py startapp customers
(env) djangoreact@52cdc60ce802:~/djangoreact$ tree

- Set up Postgres on Docker
# https://hackernoon.com/dont-install-postgres-docker-pull-postgres-bee20e200198
$ docker pull postgres
$ mkdir -p $HOME/djangoreact/postgres
$ docker run --rm --name pg-djangoreact -d -p 5432:5432 -v $HOME/djangoreact/postgres:/var/lib/postgresql/data postgres
    $ docker run --rm --name pg-djangoreact -e POSTGRES_DB=database -e POSTGRES_USER=user -e POSTGRES_PASSWORD=password -d -p 5432:5432 -v $HOME/djangoreact/postgres:/var/lib/postgresql/data postgres
$ docker exec -it pg-djangoreact psql -U postgres
postgres=# CREATE DATABASE djangoreact;
postgres=# CREATE USER djangoreact WITH ENCRYPTED PASSWORD 'djangoreact';
postgres=# GRANT ALL PRIVILEGES ON DATABASE djangoreact TO djangoreact;
postgres=# \q

- Set up Django Project to communicate with Postgres on Docker
VS Code
Open folder djangoreact/djangoreact
settings.py
    INSTALLED_APPS = [
        'django.contrib.admin',
        'django.contrib.auth',
        'django.contrib.contenttypes',
        'django.contrib.sessions',
        'django.contrib.messages',
        'django.contrib.staticfiles',
        'rest_framework',
        'corsheaders',
        'customers'
    ]

    MIDDLEWARE = [
    ...
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'corsheaders.middleware.CorsMiddleware'
    ]

    DATABASES = {
        'default': {
            # 'ENGINE': 'django.db.backends.sqlite3',
            # 'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
            'ENGINE': 'django.db.backends.postgresql_psycopg2',
            'NAME': 'djangoreact',
            'USER': 'djangoreact',
            'PASSWORD': 'md50e49e4a3b85b08c98125ce95de472c3e', # ENCRYPTED select * from pg_authid
            'HOST': '172.17.0.2', # docker inspect pg-djangoreact "IPAddress": "172.17.0.2"
            'PORT': '5432',
    }
    }

    CORS_ORIGIN_ALLOW_ALL = False

    CORS_ORIGIN_WHITELIST = (
        'localhost:3000',
    )

(env) djangoreact@52cdc60ce802:~/djangoreact$ python manage.py migrate
(env) djangoreact@52cdc60ce802:~/djangoreact$ python manage.py runserver 0.0.0.0:8000

Step 3 ~ Step 9


