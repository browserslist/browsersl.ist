# Browserslist Website

<img width="120" height="120" alt="Browserslist logo by Anton Popov"
     src="https://browsersl.ist/logo.svg" align="right">

This website uses [Browserslist] and [Can I Use] to display
the compatible browsers for a browsers query.

**[browsersl.ist](https://browsersl.ist/)**

[browserslist]: https://github.com/browserslist/browserslist
[Can I Use]: https://github.com/Fyrd/caniuse


## HTTP API

You can use the site API in your own applications.

```
https://browsersl.ist/api/browsers?q=defaults&region=alt-as
```

- `q` — query or config. If config is provided it should be in `.browserslist` file format, not `package.json`-like. Examples are available [on the website](https://browsersl.ist) or in the [browserslist repository](https://github.com/browserslist/browserslist#full-list). `defaults` by default.
- `region` — region code (optional). List of all region codes can be found at [caniuse-lite/data/regions](https://github.com/browserslist/caniuse-lite/tree/main/data/regions).


### Response example

```js
// https://browsersl.ist/api/browsers?q=>defaults+and+supports+es6-module&region=alt-as

{
  "config": ">0.3%",
  "lint": [
    {
      "id": "countryWasIgnored",
      "message": "Less than 80% coverage in `China`, `Nigeria`, `Tanzania`, `Ghana`, and `Uganda` regions"
    }
  ],
  "region": "alt-as",
  "coverage": 88.44,
  "versions": {
    "browserslist": "4.21.3",
    "caniuse": "1.0.30001381"
  },
  "updated": 1675156330646,
  "browsers": [
    {
      "id": "chrome",
      "name": "Chrome",
      "coverage": 17.06,
      "versions": {
        "102": 0.72,
        "103": 16.32
      }
    }
    ...
  ]
}
```

### Errors

If you send a request with an error, you will receive error message with the status 400.

```js
// https://browsersl.ist/api/browsers?q=>0%&region=XX

{
  "message": "Unknown region name `XX`."
}
```


## Development

We recommend installing Prettier and EditorConfig plugins to your text editor.

To run a local copy for development:

1. Install Node.js 22 and pnpm 9.
2. Install dependencies:

   ```sh
   pnpm install
   ```

3. Run local server  with client-side watcher.

   ```sh
   pnpm start
   ```

To run local server in production mode:

```sh
pnpm ssdeploy run
```
