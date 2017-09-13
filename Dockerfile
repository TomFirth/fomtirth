FROM ubuntu:14.04

COPY . /opt/fomtirth/
EXPOSE 3000

ENTRYPOINT ["/opt/fomtirth"]