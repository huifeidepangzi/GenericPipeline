# GenericPipeline
A generic pipeline builds by Docker and Django

# Command line to deploy to EC2
1. make sure the public key .pem is put under ~/.ssh/
2. run "ssh -i ~/.ssh/public_key.pem ec2-user@public_url"
3. run "sudo yum install git -y"
4. run "sudo yum install docker -y"
5. run "sudo systemctl enable docker.service"
6. run "sudo systemctl start docker.service"
7. run "sudo usermod -aG docker ec2-user"
8. run "sudo curl -SL https://github.com/docker/compose/releases/download/v2.24.7/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose"
9. run "sudo chmod +x /usr/local/bin/docker-compose"
10. run "exit" and then re-login
11. run "ssh-keygen -t ed25519 -b 4096"
12. Add the generate public key (.pub) to GitHub as deploy key
13. on aws run "git clone" with the SSH url
14. run "docker-compose up --build"