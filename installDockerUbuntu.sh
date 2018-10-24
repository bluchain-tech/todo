#/bin/bash

apt-get update -y
sudo apt-get install apt-transport-https ca-certificates curl software-properties-common -y
apt-get install python-pip -y
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" #para o 18.04 trocar stable por test se não funcionar
apt-get update -y
apt-get install docker-ce -y
pip install docker-compose
pip install --upgrade pip

