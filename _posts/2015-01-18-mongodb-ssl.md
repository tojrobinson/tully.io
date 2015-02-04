---
title: Building MongoDB with SSL
category: tutorials
author: Tully Robinson
layout: post
---

![mongo SSL](/img/mongoSSL.png)

Unless your data store is running on the same host as your application, you really should be concerned about the exposure sensitive communications (such as those containing user data) are subject to as they traverse any network—including the local networks of your hosting service.

Fortunately, MongoDB supports native SSL communication between itself and connecting clients. Unfortunately, the community versions of MongoDB are not built with such support, so one must either pay for the [MongoDB Enterprise](https://www.mongodb.com/products/mongodb-enterprise-advanced) service or build MongoDB themselves.

There are, of course, less involved alternatives to building MongoDB yourself, the simplest of which would most likely be to [tunnel](https://docs.mongodb.org/manual/administration/production-notes/) communications with an SSH client as this often requires no more than a line of setup, e.g.:

```bash
ssh -L 1337:localhost:27017 user@host
```

Perhaps a better alternative would be to use something like SSH2 or [stunnel](https://www.stunnel.org/index.html); however, the consideration of alternatives is not the aim of this post and is left to the reader.

This guide will proceed in the context of a sudoer on a 64-bit Ubuntu 14.04 host.

##Dependencies

- [git](http://www.git-scm.com/)
- [SCons](http://scons.org)
- build-essential
- libssl-dev
- [boost](http://www.boost.org/) libraries
    - libboost-filesystem-dev
    - libboost-program-options-dev
    - libboost-system-dev
    - libboost-thread-dev

This will install all the dependencies in one go:

```bash
sudo apt-get install git \
                     scons \
                     build-essential \
                     libssl-dev \
                     libboost-filesystem-dev \
                     libboost-program-options-dev \
                     libboost-system-dev \
                     libboost-thread-dev \
                     -y
```

> Due to the recency of Ubuntu 14.04, most of the default APT packages satisfy the version requirements for new MongoDB builds already; however, this will most likely not be the case for older releases. If you are running 12.04, e.g., you may need to utilise various PPAs (and other means) such as the [Ubuntu Toolchain PPA](https://launchpad.net/~ubuntu-toolchain-r/+archive/ubuntu/test) for installing `gcc` >= v4.8.1 (required by MongoDB >= 2.8) to get the required versions of dependencies.

The build process requires a good amount of memory and will consume a substantial chunk of disk space. To give you an idea, I had issues building all targets with much less than 2GB of memory and was left with a 25GB `mongo/` directory upon successfully building all targets. Don't worry too much, however, once the build process is complete, you can simply install the binaries and delete this large directory.

##Preparation
The working directory for the build can be arbitrarily located as you will most likely discard it afterwards anyway. One exception to be aware of is an [issue](https://jira.mongodb.org/browse/SERVER-14811) that may occur if your installation target is a direct parent of the build/source location. With this in mind, I build in `~/mongo` and install to `/src`.

Begin by cloning the mongo repository:

```bash
git clone https://github.com/mongodb/mongo.git 
cd mongo
```

Next you will need to checkout the version of MongoDB that you plan on building. Each release is tagged in the repository, so a list can be produced via:

```bash
git tag -l | grep -v rc
```

Typically, you will just want to build the latest production release who's version number you can get by checking: [mongodb.org/downloads](https://www.mongodb.org/downloads). At the time of writing this article (1/18/2015), the latest version is **2.6.7**, so I will run:

```bash
git checkout r2.6.7
```

##Building
Once you've checked out the appropriate version, it's time to use SCons to build the targets. You can build specific components who's ids are listed on the MongoDB [build page](http://www.mongodb.org/about/contributors/tutorial/build-mongodb-from-source/) or you can just build everything with the `all` argument. Since you will most likely just delete all the excess aftwards regardless, `all` is often the easiest route.

The following command will build all targets for a 64-bit system and will include SSL support. The `j` flag will allow multiple targets to be built in parallel which should result in total `real` time for the build being significantly reduced.

```bash
scons -j 4 --64 --ssl all
``` 
This should run for around 10-20 minutes depending on your environment and will hopefully result in something along the lines of: `scons: done building targets.` (i.e. not `scons: building terminated because of errors`).

> A common error is that of `scons` depleting memory during the build. If you are building on a low available memory machine and the exit status doesn't point you in any clear direction, it may serve you to add more memory or create a generous swap partition before running the build again.

The next step is to install the built targets on your system. The `--prefix` flag allows you to specify a parent directory for the binaries. Here we install them using a `/usr` prefix meaning, e.g, the `mongod` command will be installed to `/usr/bin/mongod` (this is recommended as it means you wont need to alter the configuration scripts later).

```bash
sudo scons -j 4 --64 --ssl --prefix=/usr install
```

You should see a slew of `chmod 755 /usr/bin/...` lines as output and, again, hopefully a `scons: done building targets.` at the end with no errors. Running:

```bash
ls /usr/bin | grep mongo
```

should result in a list similar to this:

```bash
mongo
mongod
mongodump
mongoexport
mongofiles
mongoimport
mongooplog
mongoperf
mongorestore
mongos
mongostat
mongotop
```

##Configuration
MongoDB operates most effectively (and securely) under a particular environmental setup. The default environment created for a new user on most Linux distributions is not conducive to optimal performance due to various security mechanisms including limitations on things such file sizes and open file limits, etc.

Similarly, there are security implications involved in running your MongoDB instance with either a standard user account or as root. As such, and before running your MongoDB server in any kind of production environment, you should ensure that it is set up to run in an appropriate environment.

The mongo repository includes some configuration scripts that effect most of the [recommended settings](http://docs.mongodb.org/manual/administration/production-notes/) for a production MongoDB environment on a [Debian](https://www.debian.org/) machine; these are located in the `debian/` directory of the mongo repository.

The `mongodb-org-server.postinst` script will setup the appropriate user and group for `mongod` to run under. You can run it with:

```bash
cd debian
sudo sh mongodb-org-server.postinst configure
```

To set the recommended user limit values and create a `mongod` service that will start the daemon correctly, install the `mongod.upstart` script:

```bash
sudo cp ./debian/mongod.upstart /etc/init/mongod.conf
```

Finally, you will need to create a configuration file for the daemon. A default `mongod.conf` can be found in the `debian/` directory aswell which you can install with:

```bash
sudo cp ./debian/mongod.conf /etc/mongod.conf
```

You can now delete the large `~/mongo` directory if you wish.

##Enabling SSL
First, you will need to create a **.pem** file containing both a certificate and its corresponding private key. These can be generated with the following command:

```bash
openssl req -newkey rsa:2048 -new -x509 -days 1024 -nodes -out mongodb.crt -keyout mongodb.key
```

Now combine the two output files into `/etc/ssl/mongodb.pem`:

```bash
sudo sh -c 'cat mongodb.crt mongodb.key > /etc/ssl/mongodb.pem'
```

Lastly, you need to enable SSL and give `mongod` the path to the newly created `mongodb.pem`. Do this by adding the following lines to your `/etc/mongod.conf` file:

```bash
sslMode=requireSSL
sslPEMKeyFile=/etc/ssl/mongodb.pem
```

This configuration will allow any clients using SSL to establish a connection while rejecting everything else. By default, a client will not need to present a certificate; it is assumed that your connecting clients are being vetted by some other means, e.g., with [iptables](http://en.wikipedia.org/wiki/Iptables). If you are looking to manage a more diverse cluster of nodes connecting to your data store, you may want to look into setting up a certificate validation system with the `sslCAFile` option.

Start the daemon and you should have a fully operational, SSL enabled, MongoDB server:

```bash
sudo service mongod start
```

##Testing SSL
You can run a quick check to make sure that `mongod` is operating in SSL mode by attempting to spawn a `mongo` shell without the `--ssl` flag. Running `mongo` should throw a `connect failed` exception and yield no shell.

However, `mongo --ssl` should successfully spawn a MongoDB shell and allow you to start running commands.

If you're somewhat paranoid and need further convincing that your data is indeed being encrypted, it's always an idea to look at the actual packets themselves. Comparing the data packets of the SSL enabled connection with that of the disabled one should put it beyond doubt.

So, lets comment out the two lines we added to `/etc/mongod.conf`:

```bash
#sslMode=requireSSL
#sslPEMKeyFile=/etc/ssl/mongodb.pem
```

and restart the daemon to put the new settings into effect with:

```bash
sudo service mongod restart
```

Your daemon should now be running without SSL, i.e., you can spawn shells with plain `mongo` (no `--ssl` flag). Now run:

```bash
sudo tcpdump -X -i eth0:0 'port 27017'
```

where `eth0:0` is the interface that your host (database server) is using to connect to the network. This will print all the packets (headers and data) that traverse port `27017`. Have your client on the remote host (application server) connect and insert some super secret sensitive data into your database, e.g.:

```bash
db.test.insert({test: 'TACO TACO TACO TACO TACO TACO TACO TACO LOOMINATI'});
```

You should be able to see the plain text TACOs in the ASCII rendering on the far right of the output:

![tcpdump](/img/tcpdump.png)

Now, re-enable SSL by uncommenting the two lines and restart the mongo daemon. Make sure that your client both supports SSL and has it enabled, e.g., the native **Node.js** client accepts a `ssl: Boolen` field in its server options object. Alternatively, you can simply pass the `?ssl=true` parameter as part of your connection URL in most cases. Run the `tcpdump` command again and insert some sweet TACOs (because they are delicious). The output should now be garbled with no plain text TACOs or illuminati to be found.

##All Done

Hopefully, you didn't run into too many problems and now have a SSL enabled MongoDB server up and running. If you did run into problems during the build, other than your traditional help channels, you may find some of the MongoDB [communities](http://www.mongodb.org/about/community/) of some use.

For issues connecting to the database, it's often useful to inspect the `mongod` log file that your upstart script created for you with:

```bash
sudo tail -n 20 /var/log/mongodb/mongod.log
```
