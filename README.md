# FetchHelper.js - A Simple and Efficient HTTP Request Library

## A fully functional EXAMPLE JavaScript library showing how to simplify HTTP requests with caching and async handling!

This project is an example utility library that helps streamline HTTP requests (GET and POST) using JavaScript's fetch API. It was built to provide a lightweight, easy-to-use solution for dealing with asynchronous API requests, caching responses to improve performance, and managing repetitive network calls efficiently. Below, you'll find an overview of what this project is about and what it can teach you.


### Features of FetchHelper.js:
* 🟦 Easy HTTP Requests: Create GET and POST requests with minimal code.

* 🟨 Automatic Caching: Avoids redundant API calls by caching results.
* 🔄 Configurable Cache Size: Automatically manages cache, evicting older entries once the limit is reached.
* 🚦 Time-to-Live (TTL) Support: Set expiration times to ensure data in cache remains fresh.
* ⚙️ Customizable Options: Accepts headers and configurations to make requests adaptable.
* 📡 Error Handling: Automatically handles network errors, logs issues, and keeps your code cleaner.


## Project Overview

This project demonstrates how to use FetchHelper to make HTTP requests easily and efficiently in a JavaScript environment. With features like caching, TTL (time-to-live), and error handling, FetchHelper is ideal for those who need to minimize repeated requests, work with frequently updated data, and manage network resources effectively. 

### Example Use Cases

#### Make a GET Request

The following example shows how to make a GET request using FetchHelper:

```javascript
const url = 'https://api.example.com/data';

try {
  const data = await FetchHelper.get(url);
  console.log(data);
} catch (error) {
  console.error('Error fetching data:', error);
}

```

### Make a POST Request
```javascript
const url = 'https://api.example.com/data';
const body = { key: 'value' };

try {
  const response = await FetchHelper.post(url, body);
  console.log(response);
} catch (error) {
  console.error('Error posting data:', error);
}
```

## Configuration

You can customize FetchHelper to fit your needs. Here are the configurable options:

- **Maximum Cache Size (maxCacheSize)**: The default is 1000 entries. This determines how many responses you want to store in the cache.
- **Cache Time-to-Live (cacheTTL)**: The default is 60000 milliseconds (or 60 seconds). This defines how long the cached data remains valid.

### Custom Configuration Example

You can create your own instance of FetchHelper with customized cache settings like so:

```javascript
// Create an instance with a cache size of 500 and TTL of 2 minutes
const customFetchHelper = new FetchHelper(500, 120000);
```

# Installation
```javascript
npm install fetchhelper
```

