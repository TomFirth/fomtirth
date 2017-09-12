FROM ubuntu:14.04

COPY ./fomtirth /home/ubuntu/
EXPOSE 8080

ENTRYPOINT ["/home/ubuntu/fomtirth"]