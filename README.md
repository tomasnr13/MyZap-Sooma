# MyZap-Sooma
Proof of concept web app that retrieves posts from a GhostJs blog when they're published and posts it on Twitter, Fediverse and Facebook.

# Phase 0: Setup 
Troubleshooting and running Ghost docker container after many tries, first on Windows and then on Linux.
Ended up on using the Makefile provided to run on the container on Linux.
#1st Phase: Code comprehension
Ghostjs interface exploration: post creation and integrations tab.
Ghostjs code exploration to try and understand how the Zapier service worked.
Research on the Zapier service, which allowed me to discover that it worked based on webhooks.
After some more exploration, I realized that I could create my own custom integration and add a webhook, connecting it to post creation events.
Created my custom integration, MyZap, which, similarly to Zapier, included a webhook connected to every post creation event. The target URL associated would be my page, which had not been created yet.

# 2nd phase: Setup project 
Web app setup using Node v12.22.9 
Created a simple Node app with a single route for the webhook requests to be sent and that would initiate the posting on the social media

# 3rd phase: Ghost webhooks
Firstly I had to understand how the Ghost webhooks worked so I could integrate them in my code: 
I had the following doubts: The webhook comes in what type of request? Does Ghost send multiple requests for a single event (post creation)? Do I need to send an acknowledgement message to the Ghost endpoint? As the Ghost documentation on webhooks was lacking, I had to try and experiment with it.
To do this, I firstly had to make my local server endpoint visible to Ghost so I could receive the requests. For this I used the ngrok service, a tool that creates secure tunnels to expose local web servers or services to the public internet. 
After experimenting, it turned out to be more or less as expected: The webhooks came in a single POST request per event with some exceptions (in case of server/ghost malfunction), and there wasn’t an actual need to send an acknowledgement message.

# 4th phase: Post on Twitter
For posting on social media, I opted for a module-like development, developing a component for each social, test it and validate it before I hopped into the next one.
For Twitter, I started by creating a developer account, which I could post to. After this I read the documentation of Twitter’s API v2, on which I found out about the access levels on different accounts and the requests I had to do to post to my account. 
After getting my account authorized, I created an application and retrieved my tokens.
After several tries, and because the code on the documentation didn’t work initially, I ended up on using the module TwitterAPI, from which I could post directly from my code

# 5th phase: Post on Fediverse (Mastodon)
Posting on Fediverse was pretty straightforward, being the quickest out of all social media.
After choosing Mastodon.social as my Fediverse instance, I created an account and quickly got my access token.
After some research, I quickly found out about the module ‘mastodon-api’, which worked at the first time, only needing the access token and the instance name.

# 6th phase: Post on Facebook
Facebook was my last social media to post on, and also the most complex one in terms of integration. The biggest problem I had was the access tokens, that 
I started by creating a new developer account and a Facebook page on which I could post on. After getting my account authorized, I created a new app on the Developers portal, making sure I had permissions to post.
Then, I reached my biggest problem on this module, which was to get the access tokens needed. After reading the documentation and testing some requests, I found out about the ‘Graph API Explorer’ , which I used, to get my page access token, after some unsuccessful tries. After getting the token, I still had to solve another problem, which was its low duration. which I extended to two months using the ‘Access Token Debugger’.   
After trying some API interfaces on my code, the first method that worked and the one I ended up on using, was the ‘axios’ request method, making a single asynchronous POST request with a message.

# 7th phase: Dockerize
The last phase consisted in the dockerization of my project.
I started by creating a standard dockerfile, on which I installed the dependencies used, and started my container. After building and running, my container, I realized it was taking a lot of time than the normal executions.
