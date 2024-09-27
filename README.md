# Nestor - An API Hub for AI Agents

These are examples for Nestor, the API Hub for AI Agents. For more details about Nestor, please refer to the [Nestor repository](https://github.com/nbonamy/nestor).

## Service 1

Service 1 exposes two mock APIs:
- Search the internet: always return the same dummy URL
- Fetch the content of a URL: always return the same dummy content

## Service 2

Service 2 exposes three mock APIs:
- Create a playlist and return a unique ID
- Get the unique ID of a song given a title and an artist
- Add a song to a playlist (by providing both IDs)

## Client

The client is an OpenAI implementation of a chatbot: you need an OpenAI API key in order to be able to run it:

```
OPENAI_API_KEY=xxxx npm start
```

The client should automatically discover the hub and ask the LLM to create a playlist of the songs played by The National in Chicago on September 24, 2024. You should see the LLM:
- Using `service1`:
  - Search the internet for the setlist of the concert
  - Ask for the contents of the dummy URL
- Using `service2`:
  - Create a playlist with a title and description and get an ID in return
  - Get the unique ID of the three songs. Notice tha the artist is not The National for song number 2
  - Add the three songs to the playlist


