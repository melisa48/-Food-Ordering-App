# Credentials Folder

## The purpose of this folder is to store all credentials needed to log into your server and databases. This is important for many reasons. But the two most important reasons is
    1. Grading , servers and databases will be logged into to check code and functionality of application. Not changes will be unless directed and coordinated with the team.
    2. Help. If a class TA or class CTO needs to help a team with an issue, this folder will help facilitate this giving the TA or CTO all needed info AND instructions for logging into your team's server. 


# Below is a list of items required. Missing items will causes points to be deducted from multiple milestone submissions.

1. Server URL or IP: 52.33.83.41:3000
2. Instance id: i-0613d94402e033e94
3. SSH username: ec2-user
4. SSH password or key.
    <br> If a ssh key is used please upload the key to the credentials folder.
4. Database URL or IP and port used.
    52.33.83.41:3306
5. Database username: team7
6. Database password: Backside180!
7. Database name: team7
8. Amazon AWS Management Console username: aalmeida1@sfsu.edu
9. Amazon AWS Management Console password: Backside180!
9. Instructions on how to use the above information.

a. Connect to the instance: 
ssh -i (.pem file location) ec2-user@52.33.83.41

b. cd csc648-03-sp23-team07

c. cd application

d. run the server: 
npm start

You can then go to the webpage using: 52.33.83.41:3000

# Most important things to Remember
## These values need to kept update to date throughout the semester. <br>
## <strong>Failure to do so will result it points be deducted from milestone submissions.</strong><br>
## You may store the most of the above in this README.md file. DO NOT Store the SSH key or any keys in this README.md file.


