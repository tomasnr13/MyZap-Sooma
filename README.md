# MyZap-Sooma
Proof of concept web app that retrieves posts from a GhostJs blog when they're published and posts it on Twitter, Fediverse and Facebook.

Phase 0: Setup
-Troubleshooting and running Ghostjs docker container, first on windows and then on linux
-Ended up on using the Makefile provided to run on Linux

1st phase: Code comprehension
-Ghostjs interface exploration: post creation and integrations tab
-Ghostjs code exploration to try and understand how the Zapier service worked
-Research on the Zapier service, which allowed me to discover that it worked based on webhooks, which, in the case, are notifications in form of requests that are sent to a Zapier server endpoint when a new post is created
-Another research, this time on webhooks, made me understand that, as I expected, these are mechanisms that allows one application or service to send real-time data to another application or service. These mechanisms are usually implemented as HTTP callbacks, so in this case, when a new post is created, a request (typically POST) is sent over to the other application or service, which receives and processes it
-More code exploration, this time to discover the Zapier endpoint to which the webhook requests were being sent
-After some exploration, I realized that I could create my own custom integration and add a webhook to it with a certain event and target URL
-Created my custom integration, MyZap, which, similarly to Zapier, included a webhook connected to every post creation event. The target URL would be my page, which had not been created yet

2nd phase: Setup project
-Web app setup using Node v12.22.9
-The idea for the project was an web app, on which the server would always be listening, waiting for the webhook requests;
-When it catched a new request, it would decode it, verify if it was indeed a new post on the Ghostjs blog and post it on Twitter, Fediverse and Mastodon 
-Created a simple Node app with a single route for the webhook requests to be sent and that would initiate the posting on the social media

2nd phase: Ghostjs webhooks
-Firstly I had to understand how the Ghostjs webhooks worked so I could integrate them in my code:
-I had the following doubts: The webhook comes in what type of request? Does Ghostjs sends multiple requests for a single event (post creation)? Do I need to send an acknowledgement message to the Ghostjs enpoint? As  the Ghostjs documentation on webhooks was lacking, I had to try and experiment it.
-To do this, I firstly had (or at least I thought I had) to make my local server endpoint visible to Ghostjs so I could receive the requests. For this I used the ngrok service, a tool that creates secure tunnels to expose local web servers or services to the public internet.
-After experimenting, it turned out to be more or less as expected: The webhooks came in a single POST request per event with some exceptions (in case of server/ghostjs malfunction), and it wasn't needed to send an acknowledgement message

3rd phase: Post on Twitter

4th phase: Post on Fediverse (Mastodon)

5th phase: Post on Facebook

6th phase: Dockerize
