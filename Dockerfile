# Building on top of Ubuntu 16.04. The best distro around.
FROM ubuntu:16.04

COPY ./fomtirth /opt/
EXPOSE 3000

ENTRYPOINT ["/opt/fomtirth"]