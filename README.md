# PMO

## Install docker for server

```
sudo apt-get remove docker docker-engine docker.io containerd runc

sudo apt-get update
sudo apt-get install ca-certificates curl gnupg lsb-release

sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

### Install for raspberry with this command (64bit chip)

```
sudo rm /etc/apt/sources.list.d/docker.list
sudo curl -sL https://get.docker.com | sed 's/9)/10)/' | sh
```

## Manage Docker as a non-root user

Create the docker group:

```
sudo groupadd docker
```

Restart the docker service:

```
sudo service docker restart
```

The UNIX socket /var/run/docker.sock is now readable and writable by members of the docker group.

Add the users that should have Docker access to the docker group:

```
sudo usermod -a -G docker user1
```

Remove a group

```
sudo groupdel Group_Name
```

## Install public key to ubuntu

```
mkdir .ssh
chmod 0700 .ssh
cd .ssh
touch authorized_keys
```

## Connect to Github by SSH key

### Generating a new SSH key

```
ssh-keygen -t ed25519 -C "your_email@example.com"
```

### Adding your SSH key to the ssh-agent

```
eval "$(ssh-agent -s)"
chmod 400 ~/.ssh/id_ed25519
ssh-add ~/.ssh/id_ed25519
```

## Add user to Docker group

Create a docker group if there isn’t one:

```
sudo groupadd docker
```

Add your user to the docker group:

```
sudo usermod -aG docker [non-root user]
```

Log out and log back in so that your group membership is re-evaluated.

## Initialize admin account for database

```
environment:
    MONGO_INITDB_ROOT_USERNAME: root
    MONGO_INITDB_ROOT_PASSWORD: root
```

### CREATE ACCOUNT FOR DATABASE

```
use pmoData
db.createUser(
   {
    user: "test",
    pwd: "test123",  // Or  "<cleartext password>"
    roles: [{ role: "readWrite", db: "pmoData" }]
   }
)
db.changeUserPassword("test", "test123")
```

## Nodemailer

### How to set up nodemailer and gmail OAuth2

https://dev.to/chandrapantachhetri/sending-emails-securely-using-node-js-nodemailer-smtp-gmail-and-oauth2-g3a

### Install Nodemailer

```
npm install nodemailer
```

### Create a Transporter object

```
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
    clientId: process.env.OAUTH_CLIENTID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN,
  },
});
```

Create a new project on Google Cloud Platform with OAuth2
[OAuth2 Playground](https://developers.google.com/oauthplayground/)

### Create a MailOptions Object

```
var mailOptions = {
        from: '"Press and Media Office" <pmo@hcmute.edu.vn>', // sender address
        to: listAdminTest, // list of receivers
        subject: "Sự kiện mới trong lịch đăng ký hội trường", // Subject line
        html: html, // html body
      };
```

## Install MDBootstrap

```
npm install mdb-ui-kit
```

## Docker compose setting

```
docker-compose up --build --detach
docker-compose down -v
```

## Setup to run on startup

```
sudo apt install cron
sudo systemctl enable cron
crontab -e
```

```
@reboot screen -dmS Server sh -c 'docker compose -f /home/pmo/PMOschedule/docker-compose.yml up --build'
```
