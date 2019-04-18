# Throttle CI/CD QueueManager Service (WIP)

Trigger and debounce the CI/CD of apps. Make sure a certain pipeline is run, but prevent useless intermediate deployments. This is especially useful when required to rebuild static apps on content updates.

i.e. user edits three items in short succession would normally queue 3 new builds, this throttles/debounces that to the first and the last. Any new edits while still building/deploying will supersede any queued builds.

## Environment

|Key|Value|
|---|---|
|`REDIS_URL`|The current state is stored in redis. The URL to the redis service. If not set transient/in memory cache is used.|
|`[[UPSTREAM_]<service>_]ACCESS_TOKEN`|The token the incoming service webhook uses to access this service.<br/><br/>e.g.<br/>For explicit access from contentful `UPSTREAM_CONTENTFUL_ACCESS_TOKEN` or when you need the key to be used for both upstream and downstream `CONTENTFUL_ACCESS_TOKEN`.<br/>For generic/shared access use `UPSTREAM_ACCESS_TOKEN` (not advised but useful in a closed environment).<br/>|
|`[DOWNSTREAM_]<service>_ACCESS_TOKEN`|The token this service uses to access an external CI/CD service|

## Webhook payload

See [openapi specification](routes/api/openapi.json)

e.g. To kick off a wercker pipeline on contentful update add the following payload to the contentful webhook data

`POST` to `/api/queue` with (including the access token in either the query `token` or the header `x-api-token`)

````json
{
  "upstream": {
    "service": "contentful",
    "params": {
      "spaceId": "{ /payload/sys/space/sys/id }",
      "entityId": "{ /payload/sys/id }"
    }
  },
  "downstream": {
    "service": "wercker",
    "params": {
      "pipelineId": "X"
    }
  }
}
````

Upstream params are only really used for logging.
Downstream params are mostly required and otherwise used for logging.

See [openapi specification](routes/api/openapi.json)

## Development

    yarn run dev

This runs the dev server on http://localhost:5000
