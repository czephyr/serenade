FROM python:3.11-alpine3.19

# Build-time flags
ARG WITH_PLUGINS=true

# Environment variables
ENV PACKAGES=/usr/local/lib/python3.11/site-packages
ENV PYTHONDONTWRITEBYTECODE=1

# Copy files necessary for build
COPY . .

RUN pip install -r requirements.txt --upgrade
# Expose MkDocs development server port
EXPOSE 80

# Start development server by default
ENTRYPOINT ["mkdocs"]
CMD ["serve", "--dev-addr=0.0.0.0:80"]
