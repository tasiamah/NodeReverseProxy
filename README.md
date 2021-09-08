## NodeJS Reverse Proxy

1. The proxy server comes with predefined configurations in proxy.yml. This file be exchanged with your own custom configurations. Make sure configurations follow YAML standard. 
2. Run "npm install" to install all dependencies
3. Run "npm start" to start reverse proxy server along with 4 sample downstream servers.
4. Run "npm run" if you are unable to use "npm start"

## Folder/File Details

- index.js contains code for creating http server and initializing downstream servers
- config parses YAML configurations from proxy.yml
- cache contains code for cache management and cache lifetime can be specified in proxy.yml file "proxyCacheTTLSeconds"
- utils contains code for random and round robin strategies
- httpRequest contains code for doing http requests to downstream servers
- proxy contains code for doing all proxy functionality

## Design
The NodeJS based reverse proxy supports multiple load balancing strategies with high availability and error handling. It is made using the well known Reactor design pattern. The main idea behind it is to have a handler (which in Node.js is represented by a callback function) associated with each I/O operation, which will be invoked as soon as an event is produced and processed by the event loop.
Running this reverse proxy with pm2 in cluster mode will scale up and enable the server to handle many more concurrent requests. The server can also be run as a simple single threaded server. This reverse proxy supports HTTP version 1.1 and messages encoded in JSON. The proxy server can be configured using by editing the proxy.yml file. A break down of the other files can be found below


## Random load balancing strategy
Multiple load balancing strategies are implemented in the reverse proxy. The first and most basic strategy is the random load balancing strategy. Here the request is just forwarded at random to a downstream server. This way of load balancing can often lead to poor performance i.e. on time constrained parallel ray tracing on large numbers of computers. A random value is returned in util which is used to select the server. The current load balancing strategy can be modified in the proxy.yml.

## Round-robin load balancing strategy
he second load balancer which is implemented uses a round-robin strategy. Recent research, has shown that round robin strategy is better than random strategy. This  approach  distributes  the  request to the paths in sequence, starting from the first path to the last one in rotation continuously. 
On the server, the first request forwards to the downstream server listening on port 3000. The next three consecutive request forwards to user to the downstream ports listening on 3001, 3002, and 3003 respectively. These downstream services can be modified in downStreamServers. The functionality of the strategy has been tested thoroughly with Postman. This platform has many tools that simplify the testing of APIs and servers.

## In memory-cache
The caching logic  implemented is compliant with http cache control. In addition, the Time-to-Live in-memory cache mechanism enhances performance. Time-to-Live (TTL) caches decouple the eviction mechanisms amongst objects by associating each object with a timer. When a timer expires, the corresponding object is evicted from the cache \cite{berger2014exact}. \\
The cache lifetime can be easily specified in proxy.yml file using the "proxyCacheTTLSeconds" property.

## Limitations
Every project comes with its limitations. This NodeJS based proxy server is no different. The proxy server is currently configured for a specific small scope. The server has many shortcomings and limitations. These limits include but are not limited to request queuing and routing support. 
Since there is no functionality to queue requests,  when the server reaches its limit future requests will be discarded or timed out. In its current state, the server uses an in-memory cache. Meaning that when processes are restarted the cache will be flushed. This can have a very unpleasant user experience, depending on the eventual usage. 

## Future work and Improvements:
Due to time constraints the reverse proxy is not optimized and can be improved on many aspects. Above, I already touched upon some limitations of the server. Both in terms of performance, testing and additional load balancing strategies. These following have been identified as points for improvement:
1. Server health monitoring and analytics
2. Https support
3. Add more load balancing strategies; pick up servers based on their response times
4. Unit testing with Jest and stress testing
5. Request Queuing
6. Rate limiting can be added to blacklist unwanted IP addresses
  
