#!/bin/sh

# Create config.js with environment variables
echo "window.ENV = {" > /usr/share/nginx/html/config.js
echo "  GEMINI_API_KEY: \"$GEMINI_API_KEY\"" >> /usr/share/nginx/html/config.js
echo "};" >> /usr/share/nginx/html/config.js

# Execute the original entrypoint (if any) or just exit to let CMD take over
# In standard nginx image, /docker-entrypoint.d/ scripts are run before CMD
