FROM ubuntu:14.04

COPY . /opt/fomtirth/
EXPOSE 8080

ENTRYPOINT ["/opt/fomtirth"]