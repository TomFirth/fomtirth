FROM ubuntu:14.04

COPY ./fomtirth /opt/
EXPOSE 8080

ENTRYPOINT ["/opt/fomtirth"]